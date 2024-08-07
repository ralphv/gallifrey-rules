export declare enum PluginType {
    Action = "Action",
    DataObject = "DataObject",
    Filter = "Filter",
    Rule = "Rule"
}
export declare enum ProviderType {
    ActionQueuer = "ActionQueuer",
    ActiveEventsReferenceCounter = "ActiveEventsReferenceCounter",
    Configuration = "Configuration",
    JournalLogger = "JournalLogger",
    Logger = "Logger",
    Metrics = "Metrics",
    ScheduledEvents = "ScheduledEvents",
    ReactToFailure = "ReactToFailure",
    EventDispatcher = "EventDispatcher",
    DistributedLocks = "DistributedLocks"
}
export declare function GallifreyPlugin(pluginType: PluginType): (originalClass: any) => void;
export declare function getGallifreyPluginType(classReference: any): {
    pluginType: PluginType | undefined;
    className: string | undefined;
};
export declare function GallifreyProvider(providerType: ProviderType, isDefault?: boolean): (originalClass: any) => void;
export declare function getGallifreyProviderType(classReference: any): {
    providerType: ProviderType | undefined;
    isDefault: boolean;
    className: string | undefined;
};
export declare const AsyncActionTag = "AsyncAction";
export declare function getGallifreyTags(classReference: any): string[];
export declare function AsyncAction(originalClass: any): void;
