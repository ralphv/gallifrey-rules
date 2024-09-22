import {
    BaseActionPayload,
    BaseActionResponse,
    BaseDataObjectRequest,
    BaseDataObjectResponse,
    BaseEventPayload,
} from './base-interfaces/BaseTypes';
import CriticalError from './errors/CriticalError';
import WarningError from './errors/WarningError';
import InfoError from './errors/InfoError';
import SchemaLoader from './lib/SchemaLoader';
import ModulesLoader from './lib/ModulesLoader';
import Config from './lib/Config';
import { ProvidersContext } from './lib/ProvidersContext';
import InstancesFactory from './lib/InstancesFactory';
import { EngineContext } from './lib/EngineContext';
import { AssertNotNull, fe, TypeAssertNotNull } from './lib/Utils';
import { EngineEventContext } from './lib/EngineEventContext';
import RuleInterface from './interfaces/Plugins/RuleInterface';
import EngineRule from './lib/EngineRule';
import { GallifreyEventTypeInternal } from './lib/GallifreyEventTypeInternal';
import { AsyncActionTag, PluginType } from './interfaces/InterfaceDecorators';
import { ActionInterface, AsyncActionInterface, DataObjectInterface, FilterInterface } from './interfaces/Plugins';
import EngineDataObject from './lib/EngineDataObject';
import EngineAction from './lib/EngineAction';
import { Metrics } from './lib/Metrics';
import EngineCriticalError from './errors/EngineCriticalError';
import PauseConsumer from './errors/PauseConsumer';
import PerformanceTimer from './lib/PerformanceTimer';
import SafeJournalLoggerWrapper from './SafeJournalLoggerWrapper';
import { DontThrowJustLog } from './lib/Decorators';
import hash from 'object-hash';
import EngineFilter from './lib/EngineFilter';
import { AsyncActionConfigType, IsTypeNamespaceSchemaConsumer, NamespaceSchemaConsumer } from './lib/NamespaceSchema';
import { KafkaConsumer, KafkaConsumerConfig } from './KafkaConsumer';
import { AssertTypeGuard } from './BasicTypeGuards';
import { GallifreyEventType, IsTypeGallifreyEventType } from './GallifreyEventType';
import GallifreyRulesEngineKafkaConsumer from './consumers/GallifreyRulesEngineKafkaConsumer';
import { GallifreyRulesEngineConsumerInterface } from './consumers/GallifreyRulesEngineConsumerInterface';
import { IsTypeScheduledEventType, ScheduledEventType } from './engine-events/ScheduledEventType';
import EngineScheduledEventContextInterface from './engine-interfaces/EngineScheduledEventContextInterface';
import {
    ScheduledEventRequest,
    CompleteScheduledEventRequest,
    ScheduledEventIDResponse,
    ScheduledEventQuery,
} from './interfaces/Providers/ScheduledEventsInterface';
import DistributedLocksWrapper from './DistributedLocksWrapper';
import EngineReactToFailure from './lib/EngineReactToFailure';
import JsonSchemaTester from './lib/JsonSchemaTester';
import { AsyncActionEventType } from './engine-events/AsyncActionEventType';
import { textSync } from 'figlet';
import { EOL } from 'os';
import colors from 'colors';
import { ascii } from './ascii';
import { loadAll } from 'js-yaml';
import { WithModuleNameType } from './base-interfaces/ModuleInterface';
import LoggerInterface from './interfaces/Providers/LoggerInterface';
import ConsoleLoggerProvider from './modules/ConsoleLoggerProvider';

export class GallifreyRulesEngine {
    private readonly schemaLoader: SchemaLoader;
    private readonly modulesLoader: ModulesLoader;
    private readonly providersContext: ProvidersContext;
    private readonly instancesFactory: InstancesFactory;
    private engineContext?: EngineContext;
    private metrics: Metrics | undefined;
    private startedConsumers: KafkaConsumer[] = [];
    private readonly asyncActions: AsyncActionConfigType[] = [];

    static {
        GallifreyRulesEngine.banner();
    }

    constructor() {
        this.schemaLoader = new SchemaLoader();
        this.modulesLoader = new ModulesLoader();
        this.providersContext = new ProvidersContext();
        this.instancesFactory = new InstancesFactory(this.schemaLoader, this.modulesLoader);
    }

    describeEnvironment() {
        const config = new Config();
        return config.describe();
    }

    async initializeFromFile(namespaceSchemaFile: string): Promise<void> {
        if (this.schemaLoader.isLoaded()) {
            throw new EngineCriticalError(`Engine already initialized`);
        }
        try {
            await this.schemaLoader.loadSchemaFromFile(namespaceSchemaFile);
            return this.continueInitialize();
        } catch (e) {
            this.schemaLoader.unload();
            throw e;
        }
    }

    async initializeFromYaml(namespaceYaml: string): Promise<void> {
        const documents: unknown[] = loadAll(namespaceYaml);
        if (documents.length !== 1) {
            throw new EngineCriticalError(`Loading YAML namespace file should have exactly one document`);
        }
        return this.initialize(documents[0]);
    }

    async initialize(namespaceSchema: any): Promise<void> {
        if (this.schemaLoader.isLoaded()) {
            throw new EngineCriticalError(`Engine already initialized`);
        }
        try {
            await this.schemaLoader.loadSchema(namespaceSchema);
            return this.continueInitialize();
        } catch (e) {
            this.schemaLoader.unload();
            throw e;
        }
    }

    private async continueInitialize() {
        const config = new Config();
        // loading modules
        if (config.getModulesPaths().length !== 0) {
            await this.getLogger().info(undefined, `Found modules path to load from config.`);
            await Promise.all(config.getModulesPaths().map((path) => this.modulesLoader.loadModulesFromPath(path)));
        }
        if (this.schemaLoader.getModulesPath().length !== 0) {
            await this.getLogger().info(undefined, `Found modules path to load from schema.`);
            await Promise.all(
                this.schemaLoader.getModulesPath().map((path) => this.modulesLoader.loadModulesFromPath(path)),
            );
        }
        if (this.modulesLoader.getModules().length === 0) {
            await this.getLogger().warn(undefined, `No modules has been loaded.`);
        }

        this.prepareEngineContext();
        await this.prepareProviders();
        await this.processAsyncActions();
        this.metrics?.engineInitialized(AssertNotNull(this.getNamespace()));

        /**
         *
         * namespace aliases?
         * we need plugins/providers loader with special prefix for internal? perhaps a prefix to load from http/file or internal
         * throwOnFailure for un-identified exceptions? thresholds?
         * warning thresholds?
         * warning behavior? requeue?
         * un-identified exceptions? requeue or push to another topic?
         * initialize events reference counter
         * initialize instances factory class
         * initialize error threshold class
         * discover all needed plugins/providers (assert naming conventions on classes, types, entities and so on)
         * start db connections
         * start other dependencies
         */
    }

    async shutdown(): Promise<void> {
        this.schemaLoader.unload();
        await this.stopConsumers();
    }

    @AssertInitialized
    async handleAsyncActionEvent<ActionPayloadType>(
        asyncActionEvent: AsyncActionEventType<ActionPayloadType>,
        source: string,
        pause?: () => () => void,
    ): Promise<void> {
        const { namespace, actionName, payload, entityName, eventName, eventId } = asyncActionEvent;
        //const eventLag = 0; // todo: calculate
        await this.getLogger().info(undefined, `handleAsyncActionEvent [START: ${actionName}]`);
        await this.getLogger().debug(
            undefined,
            `handleAsyncActionEvent [START: ${actionName}] Details: ${JSON.stringify(asyncActionEvent, null, 2)}`,
        );
        if (namespace !== this.getNamespace()) {
            throw new EngineCriticalError(
                `namespace used in async action event: ${namespace} doesn't match engine namespace: ${this.getNamespace()}`,
            );
        }

        const engineEventContext = await this.createEngineEventContext(
            asyncActionEvent.entityName,
            asyncActionEvent.eventName,
            asyncActionEvent.eventId,
            source,
        );

        try {
            await this.doAction(
                {
                    namespace,
                    entityName,
                    eventName,
                    eventId,
                    payload: undefined, //todo is this needed for actions?
                    source,
                    eventLag: 0, //todo
                },
                engineEventContext,
                actionName,
                payload,
                true,
            );
        } catch (e) {
            await this.getLogger().error(
                undefined,
                `handleAsyncActionEvent [EXCEPTION: ${actionName}]: ${JSON.stringify({
                    ...asyncActionEvent,
                    error: fe(e),
                })}`,
            );
            const { bubble } = await this.handleException(e, engineEventContext, pause);
            if (bubble) {
                throw e;
            }
        }
    }

    @AssertInitialized
    async handleScheduledEvent(scheduledEvent: ScheduledEventType, pause?: () => () => void): Promise<void> {
        const { entityName, eventName, eventId, source } = scheduledEvent.event;
        const eventLag = 0; // todo: calculate
        const engineEventContext = await this.createEngineEventContext(
            scheduledEvent.event.entityName,
            scheduledEvent.event.eventName,
            scheduledEvent.event.eventId,
            scheduledEvent.event.source,
        );

        await this.getLogger().info(
            engineEventContext,
            `handleScheduledEvent [START: ${eventId}]: ${JSON.stringify({
                entityName,
                eventName,
                eventId,
                source,
                eventLag,
            })}`,
        );
        await this.getLogger().debug(
            engineEventContext,
            `handleScheduledEvent [START: ${eventId}] Details: ${JSON.stringify(scheduledEvent, null, 2)}`,
        );
        if (scheduledEvent.event.namespace !== this.getNamespace()) {
            throw new EngineCriticalError(
                `namespace used in scheduled event: ${scheduledEvent.event.namespace} doesn't match engine namespace: ${this.getNamespace()}`,
            );
        }

        engineEventContext.setScheduledEvent(scheduledEvent);

        return await this.coreHandleEvent<any>(
            engineEventContext,
            {
                namespace: this.getNamespace() as string,
                entityName: scheduledEvent.event.entityName,
                eventId: scheduledEvent.event.eventId,
                eventLag,
                eventName: scheduledEvent.event.eventName,
                payload: scheduledEvent.event.payload,
                source: scheduledEvent.event.source,
            },
            pause,
        );
    }

    @AssertInitialized
    async handleEvent<EventPayloadType extends BaseEventPayload>(
        event: GallifreyEventType<EventPayloadType>,
        pause?: () => () => void,
    ): Promise<void> {
        const internalEvent = {
            ...event,
            namespace: this.getNamespace(),
        } as GallifreyEventTypeInternal<EventPayloadType>;
        const { entityName, eventName, eventId, eventLag, source } = internalEvent;
        const engineEventContext = await this.createEngineEventContext(entityName, eventName, eventId, source);
        await this.getLogger().info(
            engineEventContext,
            `handleEvent [START: ${eventId}]: ${JSON.stringify({
                entityName,
                eventName,
                eventId,
                source,
                eventLag,
            })}`,
        );
        await this.getLogger().debug(
            engineEventContext,
            `handleEvent [START: ${eventId}] Details: ${JSON.stringify(event, null, 2)}`,
        );
        AssertTypeGuard(IsTypeGallifreyEventType, event);

        await this.validatePayloadSchema(engineEventContext, event.payload);
        return await this.coreHandleEvent<any>(engineEventContext, internalEvent, pause);
    }

    private async coreHandleEvent<EventPayloadType extends BaseEventPayload>(
        engineEventContext: EngineEventContext,
        internalEvent: GallifreyEventTypeInternal<EventPayloadType>,
        pause?: () => () => void,
    ): Promise<void> {
        this.metrics?.handleEvent(internalEvent);
        const timer = new PerformanceTimer().resume();
        const { entityName, eventName, eventId, eventLag, source } = internalEvent;

        const { release, acquired } = await AssertNotNull(this.providersContext.distributedLocks).acquireLock(
            engineEventContext,
            internalEvent,
            this.schemaLoader.getEventLevelAtomicEvent(entityName, eventName) ?? false,
            this.schemaLoader.getEventLevelAtomicEntity(entityName, eventName) ?? false,
        );

        if (!acquired) {
            if (engineEventContext.getEventLevelConfig().isContinueOnFailedAcquireLock()) {
                await this.getLogger().warn(
                    engineEventContext,
                    `Failed to acquire distributed lock, but set to ignore, continuing with event.`,
                );
            } else {
                throw new EngineCriticalError(`Failed to acquire distributed lock`);
            }
        }

        try {
            engineEventContext.getJournalLogger().startEvent(internalEvent);

            const canContinue = await this.processFilters(internalEvent, engineEventContext);
            if (canContinue) {
                await this.processRules(internalEvent, engineEventContext, source, pause);
            } else {
                await this.getLogger().info(engineEventContext, `Skipping rules, canContinue is false`);
            }

            // check max event size as guardrails and more
            // start metrics
            // create journal logger token and use it in this run
            // log
            //todo discover testIfEventNeedsToBeDelayed?
            // calculate event lag and add it to metrics, from the time it was added to the time it was processed. This should be passed in.
            // do we need application locks? do we need to time application locks, wrap it with utility class...

            // some instances of plugins need to be evaluated per event, like filters and config, they are pulled from the providers like getNewConfigInstance/// pass in configs from schema instance

            const duration = timer.end();
            this.metrics?.timeEvent(internalEvent, duration); //*/ extra tags/fields like canContinue
            engineEventContext.getJournalLogger().endEvent(duration);
            await this.metrics?.flush();
        } catch (e) {
            const duration = timer.end();
            this.metrics?.timeEvent(internalEvent, duration);
            engineEventContext.getJournalLogger().endEvent(duration, e as Error);
            await this.getLogger().error(
                engineEventContext,
                `handleEvent [EXCEPTION: ${eventId}]: ${JSON.stringify({
                    entityName,
                    eventName,
                    eventId,
                    source,
                    eventLag,
                    error: fe(e),
                })}`,
            );
            this.metrics?.countErrors(internalEvent);
            const { bubble } = await this.handleException(e, engineEventContext, pause);
            if (bubble) {
                await this.reactToEventFailure(
                    new EngineReactToFailure(
                        await AssertNotNull(this.providersContext.configuration).getConfigurationAccessorInterface(
                            engineEventContext,
                            this.schemaLoader.getEventLevelConfig(internalEvent.entityName, internalEvent.eventName),
                        ),
                        AssertNotNull(engineEventContext),
                        `reactToEventFailure`,
                        engineEventContext.getJournalLogger(),
                        (measurementName: string) =>
                            AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
                        () => this.getScheduledEventContext(engineEventContext),
                        this.getScheduledEventsDelegate(engineEventContext, source),
                    ),
                    internalEvent.payload,
                    e,
                );
                throw e;
            }
        } finally {
            await this.getLogger().info(
                engineEventContext,
                `handleEvent [END: ${eventId}]: ${JSON.stringify({
                    entityName,
                    eventName,
                    eventId,
                    source,
                    eventLag,
                })}`,
            );
            await this.getLogger().debug(
                engineEventContext,
                `handleEvent [END: ${eventId}] Details: ${JSON.stringify(internalEvent, null, 2)}`,
            );
            await release();
            // cleanups? journal logs?
            // decrement active events
        }
    }

    private getEventLevelConfig(entityName: string, eventName: string) {
        return new Config(this.schemaLoader.getEventLevelConfig(entityName, eventName));
    }

    private async handleException(
        e: any,
        engineEventContext: EngineEventContext,
        pause: (() => () => void) | undefined,
    ): Promise<{ bubble: boolean; type?: 'EngineCriticalError' | 'CriticalError' | 'Error' }> {
        if (pause && e instanceof PauseConsumer) {
            await this.getLogger().info(
                engineEventContext,
                `Got PauseConsumer exception with seconds: ${e.getSeconds()}`,
            );
            const resume = pause();
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            setTimeout(async () => {
                await this.getLogger().info(engineEventContext, `PauseConsumer timer expired, resuming`);
                resume();
            }, e.getSeconds() * 1000);
            return { bubble: false };
        }

        if (e instanceof EngineCriticalError) {
            await this.getLogger().error(
                engineEventContext,
                `An engine critical error has occurred while handling event: ${fe(e)}`,
            );
            return { bubble: true, type: 'EngineCriticalError' };
        }
        if (e instanceof CriticalError) {
            await this.getLogger().error(
                engineEventContext,
                `A critical error has occurred while handling event: ${fe(e)}`,
            );
            if (!engineEventContext.getEventLevelConfig().throwOnCriticalError()) {
                await this.getLogger().warn(engineEventContext, `throw on critical error exception is off, continuing`);
                return { bubble: false };
            }
            return { bubble: true, type: 'CriticalError' }; //todo rate limiting?
        }
        if (e instanceof InfoError) {
            await this.getLogger().info(
                engineEventContext,
                `An info error has occurred while handling event: ${fe(e)}`,
            );
            return { bubble: false };
        }
        if (e instanceof WarningError) {
            await this.getLogger().warn(
                engineEventContext,
                `A warning error has occurred while handling event: ${fe(e)}`,
            );
            return { bubble: false }; //todo we will figure out whether to stop or not
        }
        if (!engineEventContext.getEventLevelConfig().throwOnEventUnhandledException()) {
            await this.getLogger().error(
                engineEventContext,
                `An unhandled error has occurred while handling event: ${fe(e)}`,
            );
            await this.getLogger().warn(engineEventContext, `throw on event unhandled exception is off, continuing`);
            return { bubble: false };
        }
        return { bubble: true, type: 'Error' };
    }

    @AssertInitialized
    getNamespace() {
        return this.schemaLoader.getNamespace();
    }

    private async prepareProviders() {
        this.providersContext.configuration = await this.instancesFactory.getConfigurationInterfaceProvider(
            AssertNotNull(this.engineContext),
        );
        this.providersContext.metrics = await this.instancesFactory.getMetricsInterfaceProvider(
            AssertNotNull(this.engineContext),
            await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
        );
        this.metrics = new Metrics(this.providersContext.metrics);

        this.providersContext.reactToFailure = await this.instancesFactory.getReactToFailureInterfaceProvider(
            AssertNotNull(this.engineContext),
            await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
        );

        this.providersContext.scheduledEvents = await this.instancesFactory.getScheduledEventsInterfaceProvider(
            AssertNotNull(this.engineContext),
            await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
        );

        this.providersContext.logger = await this.instancesFactory.getLoggerInterfaceProvider(
            AssertNotNull(this.engineContext),
            await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
        );

        this.providersContext.distributedLocks = new DistributedLocksWrapper(
            await this.instancesFactory.getDistributedLocksInterfaceProvider(
                AssertNotNull(this.engineContext),
                await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
            ),
            this.metrics,
            this.providersContext.logger,
        );
    }

    private prepareEngineContext() {
        this.engineContext = new EngineContext(AssertNotNull(this.getNamespace()));
    }

    private getLogger(): LoggerInterface {
        if (this.providersContext.logger) {
            return this.providersContext.logger;
        }
        return new ConsoleLoggerProvider();
    }

    private async runRules(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        rulesInstances: WithModuleNameType<RuleInterface<any>>[],
        source: string,
        pause?: () => () => void,
    ) {
        let engineRule;
        try {
            for (const ruleInstance of rulesInstances) {
                const configAccessor = await TypeAssertNotNull(
                    this.providersContext.configuration,
                ).getConfigurationAccessorInterface(
                    engineEventContext,
                    this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
                );
                await this.getLogger().debug(
                    engineEventContext,
                    `Getting configuration accessor from Configuration provider`,
                );

                engineRule = new EngineRule(
                    configAccessor,
                    engineEventContext,
                    (actionName: string, payload: any) => this.doAction(event, engineEventContext, actionName, payload),
                    (dataObjectName: string, request?: any) =>
                        this.pullDataObject(event, engineEventContext, dataObjectName, request),
                    `rules - ${ruleInstance.getModuleName()}`,
                    event.payload,
                    engineEventContext.getJournalLogger(),
                    (measurementName: string) =>
                        AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
                    () => this.getScheduledEventContext(engineEventContext),
                    this.getScheduledEventsDelegate(engineEventContext, source),
                );
                await this.getLogger().info(
                    engineEventContext,
                    `Calling trigger on rule: ${ruleInstance.getModuleName()}`,
                );
                // do we throw if a single rule fails?
                await this.runRule(engineEventContext, event, ruleInstance, engineRule, source, pause);
            }
        } catch (e) {
            const { bubble } = await this.handleException(e, engineEventContext, pause);
            if (bubble) {
                throw e;
            }
        }
        // run rules, on errors should we skip overrule or the whole event? also configurable
        // within rules, run actions and see if we have to queue them or not
        // check error rates
    }

    private getScheduledEventContext(
        engineEventContext: EngineEventContext,
    ): EngineScheduledEventContextInterface | undefined {
        const scheduledEvent = engineEventContext.getScheduledEvent();
        if (IsTypeScheduledEventType(scheduledEvent)) {
            return {
                createdAt: scheduledEvent.meta.createdAt,
                scheduledAt: scheduledEvent.meta.scheduledAt,
                scheduledCount: scheduledEvent.meta.scheduledCount,
                triggeredBy: scheduledEvent.meta.triggeredBy,
            };
        } else {
            return undefined;
        }
    }

    private async insertScheduledEvent(
        engineEventContext: EngineEventContext,
        event: ScheduledEventRequest,
        scheduleAt: Date | undefined,
        source: string,
    ): Promise<ScheduledEventIDResponse> {
        const scheduledEvent = engineEventContext.getScheduledEvent();
        const scheduledCount = scheduledEvent !== undefined ? scheduledEvent.meta.scheduledCount + 1 : 1;

        if (!event.namespace) {
            event.namespace = this.getNamespace();
        }
        if (!event.source) {
            event.source = engineEventContext.getSource();
        }

        engineEventContext.getJournalLogger().insertScheduledEvent(
            event as CompleteScheduledEventRequest,
            {
                entityName: engineEventContext.getEntityName(),
                eventID: engineEventContext.getEventID(),
                eventName: engineEventContext.getEventName(),
                namespace: AssertNotNull(this.getNamespace()),
                source,
            },
            scheduleAt,
            scheduledCount,
        );
        return await AssertNotNull(this.providersContext.scheduledEvents).insertScheduledEvent(
            event as CompleteScheduledEventRequest,
            {
                entityName: engineEventContext.getEntityName(),
                eventID: engineEventContext.getEventID(),
                eventName: engineEventContext.getEventName(),
                namespace: AssertNotNull(this.getNamespace()),
                source,
            },
            scheduleAt,
            scheduledCount,
        );
    }

    protected async doAction<
        ActionPayloadType extends BaseActionPayload,
        ActionResponseType extends BaseActionResponse,
    >(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        actionName: string,
        payload: ActionPayloadType,
        triggeredAsAsync: boolean = false,
    ): Promise<ActionResponseType> {
        //asyncActions?
        if (!triggeredAsAsync && this.asyncActions.some((a) => a.actionPluginName === actionName)) {
            return this.doAsyncAction(event, engineEventContext, actionName, payload);
        }

        await this.getLogger().info(
            engineEventContext,
            `doAction: ${actionName}${triggeredAsAsync ? ' queued and triggered async' : ''}`,
        );
        if (this.isActionDisabled(actionName)) {
            await this.getLogger().info(engineEventContext, `isActionDisabled on action: ${actionName}`);
            return undefined as ActionResponseType;
        }

        await this.getLogger().debug(engineEventContext, `Fetching action module: ${actionName}`);
        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [actionName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.Action);
        await this.getLogger().debug(engineEventContext, `Fetched action module: ${actionName}`);
        const configAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [actionInstance] = await this.instancesFactory.getModulesInstances<ActionInterface<any, any>>(
            engineEventContext,
            configAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        );
        await this.getLogger().debug(engineEventContext, `Fetched action module instance: ${actionName}`);

        const engineAction = new EngineAction(
            configAccessor,
            engineEventContext,
            `action - ${actionName}`,
            payload,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
            triggeredAsAsync,
        );
        const timer = new PerformanceTimer();
        try {
            engineEventContext.getJournalLogger().startDoAction(actionName, payload);
            timer.resume();
            const response = await actionInstance.trigger(engineAction);
            const duration = timer.end();
            this.metrics?.timeAction(event, actionInstance.getModuleName(), duration, triggeredAsAsync);
            engineEventContext.getJournalLogger().endDoAction(actionName, response, duration);
            return response;
        } catch (e) {
            await this.getLogger().error(engineEventContext, `Error at action trigger: ${fe(e)}`);
            const duration = timer.end();
            this.metrics?.timeAction(event, actionInstance.getModuleName(), duration, triggeredAsAsync);
            engineEventContext.getJournalLogger().endDoAction(actionName, undefined, duration, e as Error);
            throw e;
        }
    }

    protected async pullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        dataObjectName: string,
        request: DataObjectRequestType,
    ) {
        await this.getLogger().info(engineEventContext, `pullDataObject: ${dataObjectName}`);

        if (this.isPullDataObjectHookAttached(dataObjectName)) {
            return (await this.callPullDataObject(dataObjectName, request)) as DataObjectResponseType;
        }

        const eventStoreKey = this.getDataObjectEventStoreKey(dataObjectName, request);
        if (eventStoreKey && engineEventContext.isInEventStore(eventStoreKey)) {
            await this.getLogger().info(
                engineEventContext,
                `pullDataObject: ${dataObjectName} result found in event store.`,
            );
            engineEventContext.getJournalLogger().dataObjectPulledFromEventStore(dataObjectName, request);
            //todo metrics for cache hit on data objects
            return engineEventContext.getFromEventStore(eventStoreKey);
        }

        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [dataObjectName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.DataObject);
        await this.getLogger().debug(engineEventContext, `Fetched data object module: ${dataObjectName}`);
        const configAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [dataObjectInstance] = await this.instancesFactory.getModulesInstances<
            DataObjectInterface<DataObjectRequestType, DataObjectResponseType>
        >(
            engineEventContext,
            configAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        );
        await this.getLogger().debug(engineEventContext, `Fetched data object module instance: ${dataObjectName}`);

        const engineDataObject = new EngineDataObject<DataObjectRequestType>(
            configAccessor,
            engineEventContext,
            `data object - ${dataObjectName}`,
            request,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
            async (value: any) =>
                await this.addResultIntoEventStore(engineEventContext, dataObjectName, request, value),
        );
        const timer = new PerformanceTimer();
        try {
            engineEventContext.getJournalLogger().startPullDataObject(dataObjectName, request);
            timer.resume();
            const response = await dataObjectInstance.get(engineDataObject);
            const duration = timer.end();
            this.metrics?.timeDataObject(event, dataObjectInstance.getModuleName(), duration);
            engineEventContext.getJournalLogger().endPullDataObject(dataObjectName, response, duration);
            return response;
        } catch (e) {
            await this.getLogger().error(engineEventContext, `Error at data object get: ${fe(e)}`);
            const duration = timer.end();
            this.metrics?.timeDataObject(event, dataObjectInstance.getModuleName(), duration);
            engineEventContext.getJournalLogger().endPullDataObject(dataObjectName, undefined, duration, e as Error);
            throw e;
        }
    }

    isInitialized() {
        return this.schemaLoader.isLoaded();
    }

    private async runRule(
        engineEventContext: EngineEventContext,
        event: GallifreyEventTypeInternal<any>,
        ruleInstance: WithModuleNameType<RuleInterface<any>>,
        engineRule: EngineRule,
        source: string,
        pause?: () => () => void,
    ) {
        try {
            engineEventContext.getJournalLogger().startRunRule(ruleInstance.getModuleName());
            engineRule.getTimer().resume();
            await ruleInstance.trigger(engineRule);
            const ruleTimer = engineRule.getTimer().end();
            engineEventContext.getJournalLogger().endRunRule(ruleInstance.getModuleName(), ruleTimer);
            this.metrics?.timeRule(event, ruleInstance.getModuleName(), ruleTimer);
        } catch (e) {
            await this.getLogger().error(engineEventContext, `Error at rule trigger: ${fe(e)}`);
            const ruleTimer = engineRule.getTimer().end();
            this.metrics?.timeRule(event, ruleInstance.getModuleName(), ruleTimer);
            engineEventContext.getJournalLogger().endRunRule(ruleInstance.getModuleName(), ruleTimer, e as Error);

            const { bubble, type } = await this.handleException(e, engineEventContext, pause);
            if (bubble) {
                if (
                    engineEventContext.getEventLevelConfig().getFailEventOnSingleRuleFail() ||
                    type === 'EngineCriticalError'
                ) {
                    // we need to bubble up and fail the whole event, we don't react to rule failure here
                    throw e;
                }
                // false, we turn everything off? no we should only turn off Unhandled
                // we don't bubble, capture failure and logs, count errors here as higher level won't get a chance
                this.metrics?.countErrors(event);
                await this.reactToRuleFailure(
                    new EngineReactToFailure(
                        await AssertNotNull(this.providersContext.configuration).getConfigurationAccessorInterface(
                            engineEventContext,
                            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
                        ),
                        AssertNotNull(engineEventContext),
                        `reactToRuleFailure`,
                        engineEventContext.getJournalLogger(),
                        (measurementName: string) =>
                            AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
                        () => this.getScheduledEventContext(engineEventContext),
                        this.getScheduledEventsDelegate(engineEventContext, source),
                    ),
                    event.payload,
                    e,
                    ruleInstance,
                );
            }
        }
    }

    publishPartitionLag(lag: number, partition: number, topic: string, groupId: string) {
        if (!this.getNamespace()) {
            return;
        }
        this.metrics?.publishPartitionLag(this.getNamespace() as string, lag, partition, topic, groupId);
    }

    @DontThrowJustLog
    private async reactToRuleFailure(
        engine: EngineReactToFailure,
        payload: any,
        error: any,
        ruleInstance: WithModuleNameType<RuleInterface<any>>,
    ) {
        await AssertNotNull(this.providersContext.reactToFailure).reactToRuleFailure(
            engine,
            payload,
            error,
            ruleInstance.getModuleName(),
        );
    }

    @DontThrowJustLog
    private async reactToEventFailure(engine: EngineReactToFailure, payload: any, error: any) {
        await AssertNotNull(this.providersContext.reactToFailure).reactToEventFailure(engine, payload, error);
    }

    private async addResultIntoEventStore(
        engineEventContext: EngineEventContext,
        dataObjectName: string,
        request: any,
        value: any,
    ) {
        if (!request) {
            await this.getLogger().warn(
                engineEventContext,
                `addResultIntoEventStore was called on the data object: ${dataObjectName} that has no request, ignoring`,
            );
            return;
        }
        const key = this.getDataObjectEventStoreKey(dataObjectName, request);
        await engineEventContext.addToEventStore(engineEventContext, key as string, value);
    }

    private getDataObjectEventStoreKey(dataObjectName: string, request: any) {
        if (!request) {
            return undefined;
        }
        return `${dataObjectName}-${hash(request)}`;
    }

    private async processFilters(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
    ): Promise<boolean> {
        const { entityName, eventName } = event;

        await this.getLogger().debug(engineEventContext, `Fetching filters for event: ${eventName}`);
        const filterNames = this.schemaLoader.getFiltersForEvent(entityName, eventName);
        await this.getLogger().debug(
            engineEventContext,
            `Fetched filters for event: ${eventName}: ${filterNames.join(', ')}`,
        );
        if (filterNames.length === 0) {
            await this.getLogger().info(
                engineEventContext,
                `No filters found for entityName: ${entityName}, eventName: ${eventName}`,
            );
            return true; // continue
        }

        const filtersModules = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), filterNames);
        this.modulesLoader.validatePluginType(filtersModules, PluginType.Filter);
        await this.getLogger().debug(engineEventContext, `Fetched filtersModules`);

        await this.getLogger().debug(engineEventContext, `Fetching filtersInstances`);
        const configAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const filtersInstances = await this.instancesFactory.getModulesInstances<FilterInterface<any>>(
            engineEventContext,
            configAccessor,
            filtersModules,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        );
        await this.getLogger().debug(engineEventContext, `Fetched filtersInstances: ${filtersInstances.length}`);
        return await this.runFilters(event, engineEventContext, filtersInstances);
    }

    private async processRules(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        source: string,
        pause: (() => () => void) | undefined,
    ) {
        const { entityName, eventName } = event;

        await this.getLogger().debug(engineEventContext, `Fetching rules for event: ${eventName}`);
        const rulesNames = this.schemaLoader.getRulesForEvent(entityName, eventName);
        await this.getLogger().debug(
            engineEventContext,
            `Fetched rules for event: ${eventName}: ${rulesNames.join(', ')}`,
        );
        await this.getLogger().debug(engineEventContext, `Fetching rulesModules`);
        const rulesModules = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), rulesNames);
        this.modulesLoader.validatePluginType(rulesModules, PluginType.Rule);
        await this.getLogger().debug(engineEventContext, `Fetched rulesModules`);

        if (rulesModules.length === 0) {
            await this.getLogger().warn(
                engineEventContext,
                `No rules found for entityName: ${entityName}, eventName: ${eventName}`,
            );
            return;
        }
        await this.getLogger().debug(engineEventContext, `Fetching rulesInstances`);
        const configAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );
        const rulesInstances = await this.instancesFactory.getModulesInstances<RuleInterface<any>>(
            engineEventContext,
            configAccessor,
            rulesModules,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        );
        await this.getLogger().debug(engineEventContext, `Fetched rulesInstances: ${rulesInstances.length}`);
        //*/ isRuleEnabled?
        await this.runRules(event, engineEventContext, rulesInstances, source, pause);
    }

    private async runFilters(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        filtersInstances: WithModuleNameType<FilterInterface<any>>[],
    ): Promise<boolean> {
        for (const filterInstance of filtersInstances) {
            const configAccessor = await TypeAssertNotNull(
                this.providersContext.configuration,
            ).getConfigurationAccessorInterface(
                engineEventContext,
                this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
            );
            await this.getLogger().debug(
                engineEventContext,
                `Getting configuration accessor from Configuration provider`,
            );

            const engineFilter = new EngineFilter(
                configAccessor,
                engineEventContext,
                `filters - ${filterInstance.getModuleName()}`,
                event.payload,
                engineEventContext.getJournalLogger(),
                (measurementName: string) =>
                    AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
                (dataObjectName: string, request?: any) =>
                    this.pullDataObject(event, engineEventContext, dataObjectName, request),
            );
            await this.getLogger().info(
                engineEventContext,
                `Calling canContinue on filter: ${filterInstance.getModuleName()}`,
            );
            if (!(await this.canContinueFilter(engineEventContext, event, filterInstance, engineFilter))) {
                return false;
            }
        }
        return true;
    }

    private async canContinueFilter(
        engineEventContext: EngineEventContext,
        event: GallifreyEventTypeInternal<any>,
        filterInstance: WithModuleNameType<FilterInterface<any>>,
        engineFilter: EngineFilter,
    ) {
        try {
            engineEventContext.getJournalLogger().startFilter(filterInstance.getModuleName());
            engineFilter.getTimer().resume();
            const canContinue = await filterInstance.canContinue(engineFilter);
            const filterTimer = engineFilter.getTimer().end();
            engineEventContext.getJournalLogger().endFilter(filterInstance.getModuleName(), filterTimer);
            this.metrics?.timeFilter(event, filterInstance.getModuleName(), filterTimer);
            if (!canContinue) {
                engineEventContext.getJournalLogger().filterStoppedEvent(filterInstance.getModuleName(), filterTimer);
            }
            return canContinue;
        } catch (e) {
            await this.getLogger().error(engineEventContext, `Error at filter canContinue: ${fe(e)}`);
            const filterTimer = engineFilter.getTimer().end();
            this.metrics?.timeFilter(event, filterInstance.getModuleName(), filterTimer);
            engineEventContext.getJournalLogger().endFilter(filterInstance.getModuleName(), filterTimer, e as Error);
            throw e;
        }
    }

    @AssertInitialized
    async startConsumers(): Promise<GallifreyRulesEngineConsumerInterface[]> {
        if (this.startedConsumers.length) {
            throw new EngineCriticalError(`Consumers already started`);
        }
        const consumers = this.schemaLoader.getConsumers();
        consumers.length === 0
            ? await this.getLogger().warn(undefined, `Found ${consumers.length} consumers`)
            : await this.getLogger().info(undefined, `Found ${consumers.length} consumers`);
        return (await Promise.all(consumers.map((consumer) => this.startConsumer(consumer)))).filter(
            (a) => a !== undefined,
        );
    }

    async stopConsumers() {
        for (const consumer of this.startedConsumers) {
            await consumer.stopConsumer();
        }
        this.startedConsumers = [];
    }

    async stopConsumersAndWait() {
        for (const consumer of this.startedConsumers) {
            await consumer.stopConsumerAndWait();
        }
        this.startedConsumers = [];
    }

    /**
     * Used for testing in the derived classes
     * @param actionName
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected isActionDisabled(actionName: string) {
        return false;
    }

    /**
     * Used for testing in the derived classes
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected isPullDataObjectHookAttached(name: string) {
        return false;
    }

    /**
     * Used for testing in the derived classes
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async callPullDataObject(dataObjectName: string, request: any) {
        return Promise.resolve(undefined);
    }

    private async startConsumer(
        consumer: NamespaceSchemaConsumer<any>,
    ): Promise<GallifreyRulesEngineConsumerInterface | undefined> {
        await this.getLogger().info(undefined, `Preparing consumer: ${consumer.name} of type: ${consumer.type}`);
        AssertTypeGuard(IsTypeNamespaceSchemaConsumer, consumer);

        if (consumer.envVariable) {
            await this.getLogger().info(
                undefined,
                `Consumer: ${consumer.name} has environment variable: ${consumer.envVariable}`,
            );
            const value = process.env[consumer.envVariable] ?? 'FALSE';
            if (value.toLowerCase() !== 'true') {
                await this.getLogger().warn(undefined, `Consumer: ${consumer.name} is not set to be active, skipping.`);
                return undefined;
            }
            await this.getLogger().info(undefined, `Consumer: ${consumer.name} is set to be active.`);
        }

        const config = new Config();
        await this.getLogger().info(undefined, `Starting consumer: ${consumer.name} of type: ${consumer.type}`);

        const kafkaConsumer = new KafkaConsumer(
            consumer.name,
            (consumer.config as KafkaConsumerConfig).clientId ?? config.getKafkaClientID(),
            (consumer.config as KafkaConsumerConfig).brokers ?? config.getKafkaBrokers(),
            this,
        );
        switch (consumer.type) {
            case 'kafka':
                {
                    if (!consumer.eventDispatcher) {
                        throw new EngineCriticalError(`eventDispatcher is needed for 'kafka' consumer`);
                    }
                    const eventDispatcher = this.instancesFactory.getEventDispatcherProvider(consumer.eventDispatcher);
                    await kafkaConsumer.startConsumer(consumer.config as KafkaConsumerConfig, (message) => {
                        const payload = JSON.parse(String(message.value));
                        return eventDispatcher.getEvent(payload);
                    });
                }
                break;
            case 'kafka:scheduled-events':
                await kafkaConsumer.startScheduleEventConsumer(consumer.config as KafkaConsumerConfig);
                break;
            case 'kafka:async-actions':
                await kafkaConsumer.startAsyncActionsConsumer(consumer.config as KafkaConsumerConfig);
                break;
            default:
                throw new EngineCriticalError(`Unsupported consumer type: ${consumer.type}`);
        }
        this.startedConsumers.push(kafkaConsumer);
        // stopping? let's stop all consumers
        let exitTimeout: undefined | NodeJS.Timeout;
        kafkaConsumer.addOnStopOnce(async () => {
            await this.getLogger().warn(
                undefined,
                `Consumer: ${consumer.name} received on stop, signaling process to stop.`,
            );
            void this.stopConsumers();
            if (config.useExitTimeout()) {
                if (exitTimeout) {
                    clearTimeout(exitTimeout);
                }
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                exitTimeout = setTimeout(async () => {
                    await this.getLogger().warn(undefined, `Exiting process after consumers shutdown.`);
                    process.exit(1);
                }, 5000);
            }
        });
        return new GallifreyRulesEngineKafkaConsumer(kafkaConsumer);
    }

    private async validatePayloadSchema(engineEventContext: EngineEventContext, payload: any) {
        const schemaFile = this.schemaLoader.getEventLevelSchemaFile(
            engineEventContext.getEntityName(),
            engineEventContext.getEventName(),
        );
        if (!schemaFile) {
            if (engineEventContext.getEventLevelConfig().isSchemaFileMandatory()) {
                throw new EngineCriticalError(`Event Payload SchemaFile was not found and is marked as mandatory`);
            }
            return;
        }

        const schemaTester = new JsonSchemaTester();
        try {
            await this.getLogger().debug(engineEventContext, `Testing payload schema against: ${schemaFile}`);
            await schemaTester.loadAndTest(schemaFile, payload);
        } catch (e) {
            await this.getLogger().debug(engineEventContext, `Failed payload schema validation against: ${schemaFile}`);
            throw new EngineCriticalError(`Failed to validatePayloadSchema: ${fe(e)}`);
        }
    }

    private async processAsyncActions() {
        await this.getLogger().debug(undefined, `Starting to process AsyncActions from schema`);
        const asyncActions = this.schemaLoader.getAsyncActions();
        for (const asyncAction of asyncActions) {
            const { actionPluginName, queuerConfig } = asyncAction;
            await this.getLogger().info(undefined, `Processing AsyncAction: ${actionPluginName}`);
            // action exists?
            const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [
                actionPluginName,
            ]);
            this.modulesLoader.validatePluginType(moduleData, PluginType.Action);
            // make sure it has the tags needed
            if (!moduleData.tags.includes(AsyncActionTag)) {
                throw new EngineCriticalError(
                    `AsyncAction: ${actionPluginName} is missing "${AsyncActionTag}" tag. Are you sure you added @AsyncAction decorator?`,
                );
            }
            // action queuer is taken from main schema, perhaps in the future we would want to override from $asyncActions
            const queuerInstance = await this.instancesFactory.getActionQueuerInterfaceProvider(
                AssertNotNull(this.engineContext),
                await AssertNotNull(this.providersContext.configuration).getConfigurationAccessorInterface(
                    undefined,
                    undefined,
                ),
            );
            await this.getLogger().info(undefined, `Validating queuerConfig for: ${queuerInstance.getModuleName()}`);
            try {
                queuerInstance.validateQueuerConfig(queuerConfig);
            } catch (e) {
                throw new EngineCriticalError(
                    `Failed to validate queuer config for queuerProviderName: ${queuerInstance.getModuleName()}: ${fe(e)}`,
                );
            }
            this.asyncActions.push(asyncAction);
        }
    }

    private async doAsyncAction<
        ActionPayloadType extends BaseActionPayload,
        ActionResponseType extends BaseActionResponse,
    >(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        asyncActionName: string,
        payload: ActionPayloadType,
    ) {
        await this.getLogger().info(engineEventContext, `doAsyncAction: ${asyncActionName}`);
        if (this.isActionDisabled(asyncActionName)) {
            await this.getLogger().info(engineEventContext, `isActionDisabled on async action: ${asyncActionName}`);
            return undefined as ActionResponseType;
        }
        const asyncActionConfig = AssertNotNull(this.asyncActions.find((a) => a.actionPluginName === asyncActionName));

        await this.getLogger().debug(engineEventContext, `Fetching async action module: ${asyncActionName}`);
        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [asyncActionName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.Action);
        await this.getLogger().debug(engineEventContext, `Fetched action module: ${asyncActionName}`);
        const configAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [asyncActionInstance] = await this.instancesFactory.getModulesInstances<AsyncActionInterface<any, any>>(
            engineEventContext,
            configAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        );
        await this.getLogger().debug(engineEventContext, `Fetched async action module instance: ${asyncActionName}`);

        const engineAction = new EngineAction(
            configAccessor,
            engineEventContext,
            `async action - ${asyncActionName}`,
            payload,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
            false,
        );

        const queueAsAsync = asyncActionInstance.queueAsAsync
            ? await asyncActionInstance.queueAsAsync(engineAction)
            : true;

        if (queueAsAsync) {
            await this.getLogger().info(engineEventContext, `Preparing to queue Async action: ${asyncActionName}`);
            const queuerInstance = await this.instancesFactory.getActionQueuerInterfaceProvider(
                AssertNotNull(this.engineContext),
                await AssertNotNull(this.providersContext.configuration).getConfigurationAccessorInterface(
                    undefined,
                    undefined,
                ),
            );

            const timer = new PerformanceTimer().resume();
            try {
                engineEventContext.getJournalLogger().startQueueAsyncAction(asyncActionName, payload);
                await queuerInstance.queueAction({
                    actionName: asyncActionName,
                    entityName: event.entityName,
                    eventId: event.eventId,
                    eventName: event.eventName,
                    queuerConfig: asyncActionConfig.queuerConfig,
                    payload,
                    namespace: event.namespace,
                });
                const duration = timer.end();
                engineEventContext.getJournalLogger().endQueueAsyncAction(asyncActionName, duration);
                this.metrics?.queuedAction(event, asyncActionName, duration, true);
                return undefined;
            } catch (e) {
                await this.getLogger().error(engineEventContext, `Error at queueAction: ${fe(e)}`);
                const duration = timer.end();
                this.metrics?.queuedAction(event, asyncActionName, duration, false);
                engineEventContext.getJournalLogger().endQueueAsyncAction(asyncActionName, duration, e as Error);
                throw new EngineCriticalError(`Failed to queue async action: ${fe(e)}`);
            }
        } else {
            await this.getLogger().info(
                engineEventContext,
                `Async action decided to not queue and instead execute immediately: ${asyncActionName}`,
            );
            const timer = new PerformanceTimer();
            try {
                engineEventContext.getJournalLogger().startDoAction(asyncActionName, payload);
                timer.resume();
                const response = await asyncActionInstance.trigger(engineAction);
                const duration = timer.end();
                this.metrics?.timeAction(event, asyncActionInstance.getModuleName(), duration, false);
                engineEventContext.getJournalLogger().endDoAction(asyncActionName, response, duration);
                return response;
            } catch (e) {
                await this.getLogger().error(engineEventContext, `Error at action trigger: ${fe(e)}`);
                const duration = timer.end();
                this.metrics?.timeAction(event, asyncActionInstance.getModuleName(), duration, false);
                engineEventContext.getJournalLogger().endDoAction(asyncActionName, undefined, duration, e as Error);
                throw e;
            }
        }
    }

    private static banner() {
        // banner, once
        console.log(colors.red(ascii));
        console.log(colors.yellow(textSync('Gallifrey Rules', { horizontalLayout: 'full' })), EOL);
    }

    protected async createEngineEventContext(entityName: string, eventName: string, eventId: string, source: string) {
        const engineEventContext = new EngineEventContext(
            AssertNotNull(this.getNamespace()),
            entityName,
            eventName,
            eventId,
            source,
            this.getEventLevelConfig(entityName, eventName),
            this.getLogger(),
        );
        const configAccessor = await this.providersContext?.configuration?.getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(entityName, eventName),
        );
        engineEventContext.setJournalLogger(
            new SafeJournalLoggerWrapper(
                await this.instancesFactory.getJournalLoggerInterfaceProvider(
                    AssertNotNull(this.engineContext),
                    AssertNotNull(configAccessor),
                ),
            ),
        );
        return engineEventContext;
    }

    protected getSchemaLoader() {
        return this.schemaLoader;
    }

    protected getInstancesFactory() {
        return this.instancesFactory;
    }

    private getScheduledEventsDelegate(engineEventContext: EngineEventContext, source: string) {
        return {
            deleteScheduledEvent: (scheduledEventID: string) =>
                AssertNotNull(this.providersContext.scheduledEvents).deleteScheduledEvent(scheduledEventID),
            getScheduledEvent: (scheduledEventID: string) =>
                AssertNotNull(this.providersContext.scheduledEvents).getScheduledEvent(scheduledEventID),
            insertScheduledEvent: (event: ScheduledEventRequest, scheduleAt: Date | undefined) =>
                this.insertScheduledEvent(engineEventContext, event, scheduleAt, source),
            isScheduledEvent: () => engineEventContext.getScheduledEvent() !== undefined,
            queryScheduledEvents: (query: ScheduledEventQuery) => {
                if (!query.namespace) {
                    query.namespace = AssertNotNull(this.getNamespace());
                }
                return AssertNotNull(this.providersContext.scheduledEvents).queryScheduledEvents(query);
            },
        };
    }
}

function AssertInitialized(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    function replacement(this: GallifreyRulesEngine, ...args: any[]) {
        if (!this.isInitialized()) {
            throw new EngineCriticalError(
                `GallifreyRulesEngine:${methodName} method called without engine being initialized.`,
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        return originalMethod.apply(this, args);
    }

    return replacement;
}
