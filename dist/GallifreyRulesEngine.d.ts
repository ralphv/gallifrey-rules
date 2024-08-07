import { BaseEventPayload } from './base-interfaces/BaseTypes';
import { GallifreyEventType } from './GallifreyEventType';
import { GallifreyRulesEngineConsumerInterface } from './consumers/GallifreyRulesEngineConsumerInterface';
import { ScheduledEventType } from './engine-events/ScheduledEventType';
import { AsyncActionEventType } from './engine-events/AsyncActionEventType';
export declare class GallifreyRulesEngine {
    private readonly schemaLoader;
    private readonly modulesLoader;
    private readonly config;
    private readonly providersContext;
    private readonly instancesFactory;
    private engineContext?;
    private metrics;
    private startedConsumers;
    private readonly asyncActions;
    constructor();
    describeEnvironment(): string;
    initializeFromFile(namespaceSchemaFile: string): Promise<void>;
    initialize(namespaceSchema: any): Promise<void>;
    private continueInitialize;
    shutdown(): Promise<void>;
    handleAsyncActionEvent<ActionPayloadType>(asyncActionEvent: AsyncActionEventType<ActionPayloadType>, source: string, pause?: () => () => void): Promise<void>;
    handleScheduledEvent(scheduledEvent: ScheduledEventType, pause?: () => () => void): Promise<void>;
    handleEvent<EventPayloadType extends BaseEventPayload>(event: GallifreyEventType<EventPayloadType>, pause?: () => () => void): Promise<void>;
    private coreHandleEvent;
    private handleException;
    getNamespace(): string | undefined;
    private prepareProviders;
    private prepareEngineContext;
    private runRules;
    private getScheduledEventContext;
    private insertScheduledEvent;
    private doAction;
    private pullDataObject;
    isInitialized(): boolean;
    private runRule;
    publishPartitionLag(lag: number, partition: number, topic: string, groupId: string): void;
    private reactToRuleFailure;
    private reactToEventFailure;
    private addResultIntoEventStore;
    private getDataObjectEventStoreKey;
    private processFilters;
    private processRules;
    private runFilters;
    private canContinueFilter;
    startConsumers(): Promise<GallifreyRulesEngineConsumerInterface[]>;
    stopConsumers(): Promise<void>;
    stopConsumersAndWait(): Promise<void>;
    /**
     * Used for testing in the derived classes
     * @param actionName
     * @protected
     */
    protected isActionDisabled(actionName: string): boolean;
    /**
     * Used for testing in the derived classes
     * @protected
     */
    protected isPullDataObjectHookAttached(): boolean;
    /**
     * Used for testing in the derived classes
     * @protected
     */
    protected callPullDataObject(dataObjectName: string, request: any): Promise<undefined>;
    private startConsumer;
    private validatePayloadSchema;
    private processAsyncActions;
    private doAsyncAction;
    private static banner;
}
