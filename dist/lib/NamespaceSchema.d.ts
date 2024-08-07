import { ConfigType } from '../interfaces/Providers/ConfigurationInterface';
export type NamespaceSchema = {
    $namespace: string;
    $namespaceAliases?: string[];
    $modulesPaths?: string[];
    $entities: NamespaceSchemaEntity;
    $config?: ConfigType;
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
    $consumers?: NamespaceSchemaConsumer[];
    $schemaFile?: string;
    $asyncActions?: AsyncActionConfigType[];
};
export type NamespaceSchemaEntity = {
    $config?: ConfigType;
    $schemaFile?: string;
    [entity: string]: ConfigType | NamespaceSchemaEvent | string | undefined;
};
export type NamespaceSchemaEvent = {
    $config?: any;
    $schemaFile: string;
    [event: string]: {
        $schemaFile?: string;
        $config?: ConfigType;
        $filters?: string[];
        $rules: string[];
    } | any;
};
export type NamespaceSchemaConsumer = {
    name: string;
    type: string;
    config: any;
    eventDispatcher?: string;
};
export declare function IsTypeNamespaceSchemaConsumer(value: any): value is NamespaceSchemaConsumer;
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
