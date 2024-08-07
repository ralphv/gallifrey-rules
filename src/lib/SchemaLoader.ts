/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { readFile } from 'node:fs/promises';
import { Draft07, Draft, JsonError } from 'json-schema-library';
import namespaceJsonSchema from '../schemas/namespace-schema.json';
import { NamespaceSchemaConsumer, NamespaceSchema } from './NamespaceSchema';
import { logger } from './logger';
import EngineCriticalError from '../errors/EngineCriticalError';

export default class SchemaLoader {
    private schema: NamespaceSchema | undefined;
    public async loadSchemaFromFile(namespaceSchemaFile: string) {
        logger.info(`Loading schema from file: ${namespaceSchemaFile}.`);
        const buffer = await readFile(namespaceSchemaFile);
        return this.loadSchema(String(buffer));
    }

    public async loadSchema(schema: any | string) {
        logger.info(`Loading schema.`);
        this.schema = undefined;
        if (typeof schema === 'string') {
            schema = JSON.parse(schema);
        }
        // validate schema
        const jsonSchema: Draft = new Draft07(namespaceJsonSchema);
        const errors: JsonError[] = jsonSchema.validate(schema);
        if (errors.length !== 0) {
            throw new EngineCriticalError(`Invalid namespace schema: ${JSON.stringify(errors, null, 2)}`);
        }
        this.schema = schema as NamespaceSchema;
        logger.info(`Schema is loaded for namespace ${this.schema.$namespace}`);
    }

    public unload() {
        this.schema = undefined;
    }

    public isLoaded() {
        return this.schema !== undefined;
    }

    @AssertSchemaLoaded
    getModulesPath() {
        return this.schema?.$modulesPaths ?? [];
    }

    @AssertSchemaLoaded
    getNamespace() {
        return this.schema?.$namespace;
    }

    @AssertSchemaLoaded
    getCompatibleNamespaces() {
        const namespaces = [];
        if (this.getNamespace()) {
            namespaces.push(this.getNamespace());
        }
        return [...namespaces, ...(this.schema?.$namespaceAliases ?? [])];
    }

    @AssertSchemaLoaded
    getActionQueuerInterfaceProvider() {
        return this.schema?.$providers?.actionQueuer ?? null;
    }
    @AssertSchemaLoaded
    getActiveEventsReferenceCounterInterfaceProvider() {
        return this.schema?.$providers?.activeEventsReferenceCounter ?? null;
    }
    @AssertSchemaLoaded
    getConfigurationInterfaceProvider() {
        return this.schema?.$providers?.configuration ?? null;
    }
    @AssertSchemaLoaded
    getJournalLoggerInterfaceProvider() {
        return this.schema?.$providers?.journalLogger ?? null;
    }
    @AssertSchemaLoaded
    getLoggerInterfaceProvider() {
        return this.schema?.$providers?.logger ?? null;
    }
    @AssertSchemaLoaded
    getMetricsInterfaceProvider() {
        return this.schema?.$providers?.metrics ?? null;
    }

    @AssertSchemaLoaded
    getReactToFailureInterfaceProvider() {
        return this.schema?.$providers?.reactToFailure ?? null;
    }

    @AssertSchemaLoaded
    getScheduledEventsInterfaceProvider() {
        return this.schema?.$providers?.scheduledEvents ?? null;
    }

    @AssertSchemaLoaded
    getDistributedLocksInterfaceProvider() {
        return this.schema?.$providers?.distributedLocks ?? null;
    }

    @AssertSchemaLoaded
    getRulesForEvent(namespace: string, entityName: string, eventName: string): string[] {
        // @ts-expect-error expected
        return this.schema?.$entities?.[entityName]?.[eventName]?.$rules ?? [];
    }

    @AssertSchemaLoaded
    getFiltersForEvent(namespace: string, entityName: string, eventName: string): string[] {
        // @ts-expect-error expected
        return this.schema?.$entities?.[entityName]?.[eventName]?.$filters ?? [];
    }

    @AssertSchemaLoaded
    getConsumers(): NamespaceSchemaConsumer[] {
        return this.schema?.$consumers ?? [];
    }

    getEventLevelConfig(entityName: string, eventName: string) {
        return this.getEventLevelKeyObject(entityName, eventName, '$config');
    }

    getEventLevelSchemaFile(entityName: string, eventName: string): string | undefined {
        return this.getEventLevelKeyValue(entityName, eventName, '$schemaFile');
    }

    private getEventLevelKeyObject(entityName: string, eventName: string, key: string) {
        const objects = []; // lowest level/highest priority first.

        objects.push((this.schema as any)?.$entities?.[entityName]?.[eventName]?.[key]);
        objects.push((this.schema as any)?.$entities?.[entityName]?.[key]);
        objects.push((this.schema as any)?.$entities?.[key]);
        objects.push((this.schema as any)?.[key]);

        return objects
            .filter((a) => a !== undefined)
            .reduce(
                ($current, compiled) => ({
                    ...compiled,
                    ...$current, // previous takes priority, so current will only overwrite what is not already there
                }),
                {},
            );
    }

    private getEventLevelKeyValue(entityName: string, eventName: string, key: string) {
        const values = []; // lowest level/highest priority first.

        values.push((this.schema as any)?.$entities?.[entityName]?.[eventName]?.[key]);
        values.push((this.schema as any)?.$entities?.[entityName]?.[key]);
        values.push((this.schema as any)?.$entities?.[key]);
        values.push((this.schema as any)?.[key]);

        // pick the first value in the array, it's the highest priority
        return values.filter((a) => a !== undefined)[0] ?? undefined;
    }

    getAsyncActions() {
        return this.schema?.$asyncActions ?? [];
    }
}

function AssertSchemaLoaded(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    function replacement(this: SchemaLoader, ...args: any[]) {
        if (!this.isLoaded()) {
            throw new EngineCriticalError(`SchemaLoader${methodName} method called without a loaded schema.`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return originalMethod.apply(this, args);
    }
    return replacement;
}
