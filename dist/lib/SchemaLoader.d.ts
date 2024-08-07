import { NamespaceSchemaConsumer } from './NamespaceSchema';
export default class SchemaLoader {
    private schema;
    loadSchemaFromFile(namespaceSchemaFile: string): Promise<void>;
    loadSchema(schema: any | string): Promise<void>;
    unload(): void;
    isLoaded(): boolean;
    getModulesPath(): string[];
    getNamespace(): string | undefined;
    getCompatibleNamespaces(): (string | undefined)[];
    getActionQueuerInterfaceProvider(): string | null;
    getActiveEventsReferenceCounterInterfaceProvider(): string | null;
    getConfigurationInterfaceProvider(): string | null;
    getJournalLoggerInterfaceProvider(): string | null;
    getLoggerInterfaceProvider(): string | null;
    getMetricsInterfaceProvider(): string | null;
    getReactToFailureInterfaceProvider(): string | null;
    getScheduledEventsInterfaceProvider(): string | null;
    getDistributedLocksInterfaceProvider(): string | null;
    getRulesForEvent(namespace: string, entityName: string, eventName: string): string[];
    getFiltersForEvent(namespace: string, entityName: string, eventName: string): string[];
    getConsumers(): NamespaceSchemaConsumer[];
    getEventLevelConfig(entityName: string, eventName: string): any;
    getEventLevelSchemaFile(entityName: string, eventName: string): string | undefined;
    private getEventLevelKeyObject;
    private getEventLevelKeyValue;
    getAsyncActions(): import("./NamespaceSchema").AsyncActionConfigType[];
}
