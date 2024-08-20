import { IsObject, IsString } from '../BasicTypeGuards';
import { ConfigType } from '../interfaces/Providers/ConfigurationInterface';

export type NamespaceSchema = {
    $namespace: string;
    $namespaceAliases?: string[];
    $modulesPaths: string[];
    $entities: NamespaceSchemaEntity;
    $config?: ConfigType; // namespace level config
    $atomicEntity?: boolean;
    $atomicEvent?: boolean;
    $providers?: {
        actionQueuer?: string;
        activeEventsReferenceCounter?: string;
        configuration?: string;
        journalLogger?: string;
        logger?: string;
        metrics?: string;
        scheduledEvents?: string;
        distributedLocks?: string;
        reactToFailure?: string;
    };
    $consumers?: NamespaceSchemaConsumer<any>[];
    $schemaFile?: string;
    $asyncActions?: AsyncActionConfigType[]; // async actions must be explicitly activated
    // modules override
};

export type NamespaceSchemaEntity = {
    [entity: string]: NamespaceSchemaEvent;
};

export type NamespaceSchemaEvent = {
    $config?: any; // entity level config
    $atomicEntity?: boolean;
    $atomicEvent?: boolean;
    $schemaFile?: string;
    [event: string]:
        | {
              $config?: ConfigType; // event level config
              $atomicEntity?: boolean;
              $atomicEvent?: boolean;
              $schemaFile?: string;
              $filters?: string[];
              $rules: string[];
          }
        | any;
};

export type NamespaceSchemaConsumer<ConfigType> = {
    name: string;
    type: string;
    config: ConfigType;
    eventDispatcher?: string;
    /**
     * If specified, then this boolean environment variable will be
     * used to determine whether to start this consumer or not
     */
    envVariable?: string;
};

export function IsTypeNamespaceSchemaConsumer(value: any): value is NamespaceSchemaConsumer<any> {
    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsString(value.name) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsString(value.type) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsObject(value.config) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsString(value.eventDispatcher, true) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ['kafka', 'kafka:scheduled-events', 'kafka:async-actions'].includes(value.type)
    );
}

export type AsyncActionConfigType = {
    /**
     * Name of action plugin
     */
    actionPluginName: string;
    /**
     * producer config depending on type, for example kafka would have topic, brokers
     */
    queuerConfig: ConfigType;
};
