export declare function getMethodNames<T>(obj: T): string[];
export declare enum InterfaceNames {
    JournalLoggerInterface = "JournalLoggerInterface",
    ActionQueuerInterface = "ActionQueuerInterface",
    LoggerInterface = "LoggerInterface",
    MetricsInterface = "MetricsInterface",
    ActiveEventsReferenceCounterInterface = "ActiveEventsReferenceCounterInterface",
    ConfigurationInterface = "ConfigurationInterface",
    ReactToFailureInterface = "ReactToFailureInterface",
    ScheduledEventsInterface = "ScheduledEventsInterface",
    EventDispatcherInterface = "EventDispatcherInterface",
    DistributedLocksInterface = "DistributedLocksInterface",
    ActionInterface = "ActionInterface",
    AsyncActionInterface = "AsyncActionInterface",
    BatchAsyncActionInterface = "BatchAsyncActionInterface",
    DataObjectInterface = "DataObjectInterface",
    FilterInterface = "FilterInterface",
    RuleInterface = "RuleInterface"
}
export declare function getInterfaceMethods(interfaceName: InterfaceNames): any;
