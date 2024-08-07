import { BaseActionPayload, BaseActionResponse, BaseEventPayload } from './base-interfaces/BaseTypes';
import CriticalError from './errors/CriticalError';
import WarningError from './errors/WarningError';
import InfoError from './errors/InfoError';
import SchemaLoader from './lib/SchemaLoader';
import ModulesLoader from './lib/ModulesLoader';
import Config from './lib/Config';
import { logger } from './lib/logger';
import { ProvidersContext } from './lib/ProvidersContext';
import InstancesFactory from './lib/InstancesFactory';
import { EngineContext } from './lib/EngineContext';
import { AssertNotNull, TypeAssertNotNull } from './lib/Utils';
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
import { ScheduledEventRequest, ScheduledEventResponse } from './interfaces/Providers/ScheduledEventsInterface';
import DistributedLocksWrapper from './DistributedLocksWrapper';
import EngineReactToFailure from './lib/EngineReactToFailure';
import JsonSchemaTester from './lib/JsonSchemaTester';
import { AsyncActionEventType } from './engine-events/AsyncActionEventType';
import { textSync } from 'figlet';
import { EOL } from 'os';
import colors from 'colors';
import { ascii } from './ascii';

export class GallifreyRulesEngine {
    private readonly schemaLoader: SchemaLoader;
    private readonly modulesLoader: ModulesLoader;
    private readonly config: Config;
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
        this.config = new Config();
        this.providersContext = new ProvidersContext();
        this.instancesFactory = new InstancesFactory(this.schemaLoader, this.modulesLoader);
    }

    describeEnvironment() {
        return this.config.describe();
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
        // loading modules
        if (this.config.getModulesPaths().length !== 0) {
            logger.info(`Found modules path to load from config.`);
            await Promise.all(
                this.config.getModulesPaths().map((path) => this.modulesLoader.loadModulesFromPath(path)),
            );
        }
        if (this.schemaLoader.getModulesPath().length !== 0) {
            logger.info(`Found modules path to load from schema.`);
            await Promise.all(
                this.schemaLoader.getModulesPath().map((path) => this.modulesLoader.loadModulesFromPath(path)),
            );
        }
        if (this.modulesLoader.getModules().length === 0) {
            logger.warn(`No modules has been loaded.`);
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
        logger.info(`handleAsyncActionEvent [START: ${actionName}]`);
        logger.debug(
            `handleAsyncActionEvent [START: ${actionName}] Details: ${JSON.stringify(asyncActionEvent, null, 2)}`,
        );
        if (namespace !== this.getNamespace()) {
            throw new EngineCriticalError(
                `namespace used in async action event: ${namespace} doesn't match engine namespace: ${this.getNamespace()}`,
            );
        }

        const engineEventContext = new EngineEventContext(
            AssertNotNull(this.getNamespace()),
            asyncActionEvent.entityName,
            asyncActionEvent.eventName,
            asyncActionEvent.eventId,
            source,
        );
        const config = await this.providersContext?.configuration?.getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(asyncActionEvent.entityName, asyncActionEvent.eventName),
        );
        engineEventContext.setJournalLogger(
            new SafeJournalLoggerWrapper(
                await this.instancesFactory.getJournalLoggerInterfaceProvider(
                    AssertNotNull(this.engineContext),
                    AssertNotNull(config),
                ),
            ),
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
            logger.error(
                `handleAsyncActionEvent [EXCEPTION: ${actionName}]: ${JSON.stringify({ ...asyncActionEvent, error: e })}`,
            );
            if (this.handleException(e, pause)) {
                throw e;
            }
        }
    }

    @AssertInitialized
    async handleScheduledEvent(scheduledEvent: ScheduledEventType, pause?: () => () => void): Promise<void> {
        const { entityName, eventName, eventId, source } = scheduledEvent.event;
        const eventLag = 0; // todo: calculate
        logger.info(
            `handleScheduledEvent [START: ${eventId}]: ${JSON.stringify({
                entityName,
                eventName,
                eventId,
                source,
                eventLag,
            })}`,
        );
        logger.debug(`handleScheduledEvent [START: ${eventId}] Details: ${JSON.stringify(scheduledEvent, null, 2)}`);
        if (scheduledEvent.event.namespace !== this.getNamespace()) {
            throw new EngineCriticalError(
                `namespace used in scheduled event: ${scheduledEvent.event.namespace} doesn't match engine namespace: ${this.getNamespace()}`,
            );
        }

        const engineEventContext = new EngineEventContext(
            AssertNotNull(this.getNamespace()),
            scheduledEvent.event.entityName,
            scheduledEvent.event.eventName,
            scheduledEvent.event.eventId,
            scheduledEvent.event.source,
        );
        const config = await this.providersContext?.configuration?.getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(scheduledEvent.event.entityName, scheduledEvent.event.eventName),
        );
        engineEventContext.setJournalLogger(
            new SafeJournalLoggerWrapper(
                await this.instancesFactory.getJournalLoggerInterfaceProvider(
                    AssertNotNull(this.engineContext),
                    AssertNotNull(config),
                ),
            ),
        );

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
        logger.info(
            `handleEvent [START: ${eventId}]: ${JSON.stringify({
                entityName,
                eventName,
                eventId,
                source,
                eventLag,
            })}`,
        );
        logger.debug(`handleEvent [START: ${eventId}] Details: ${JSON.stringify(event, null, 2)}`);
        AssertTypeGuard(IsTypeGallifreyEventType, event);

        await this.validatePayloadSchema(event);

        const engineEventContext = new EngineEventContext(
            AssertNotNull(this.getNamespace()),
            entityName,
            eventName,
            eventId,
            source,
        );
        const config = await this.providersContext?.configuration?.getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );
        engineEventContext.setJournalLogger(
            new SafeJournalLoggerWrapper(
                await this.instancesFactory.getJournalLoggerInterfaceProvider(
                    AssertNotNull(this.engineContext),
                    AssertNotNull(config),
                ),
            ),
        );
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
            internalEvent,
        );
        if (!acquired) {
            const config = new Config();
            if (config.isContinueOnFailedAcquireLock()) {
                logger.warn(`Failed to acquire distributed lock, but set to ignore, continuing with event.`);
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
                logger.info(`Skipping rules, canContinue is false`);
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
            logger.error(
                `handleEvent [EXCEPTION: ${eventId}]: ${JSON.stringify({
                    entityName,
                    eventName,
                    eventId,
                    source,
                    eventLag,
                    error: String(e),
                })}`,
            );
            this.metrics?.countErrors(internalEvent);
            if (this.handleException(e, pause)) {
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
                        (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source),
                        () => engineEventContext.getScheduledEvent() !== undefined,
                    ),
                    internalEvent.payload,
                    e,
                );
                throw e;
            }
        } finally {
            logger.info(
                `handleEvent [END: ${eventId}]: ${JSON.stringify({
                    entityName,
                    eventName,
                    eventId,
                    source,
                    eventLag,
                })}`,
            );
            logger.debug(`handleEvent [END: ${eventId}] Details: ${JSON.stringify(internalEvent, null, 2)}`);
            await release();
            // cleanups? journal logs?
            // decrement active events
        }
    }

    private handleException(e: any, pause: (() => () => void) | undefined) {
        const config = new Config();

        if (pause && e instanceof PauseConsumer) {
            logger.info(`Got PauseConsumer exception with seconds: ${e.getSeconds()}`);
            const resume = pause();
            setTimeout(() => {
                logger.info(`PauseConsumer timer expired, resuming`);
                resume();
            }, e.getSeconds() * 1000);
            return false;
        }

        if (e instanceof EngineCriticalError) {
            logger.error(`An engine critical error has occurred while handling event: ${String(e)}`);
            return true;
        }
        if (e instanceof CriticalError) {
            logger.error(`A critical error has occurred while handling event: ${String(e)}`);
            if (!config.dontThrowOnCriticalError()) {
                logger.warn(`throw on critical error exception is off, continuing`);
                return false;
            }
            return true;
        }
        if (e instanceof InfoError) {
            logger.info(`An info error has occurred while handling event: ${String(e)}`);
            return false;
        }
        if (e instanceof WarningError) {
            logger.warn(`A warning error has occurred while handling event: ${String(e)}`);
            return false; //todo we will figure out whether to stop or not
        }
        if (!config.throwOnEventUnhandledException()) {
            logger.error(
                `An unhandled error has occurred while handling event: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
            logger.warn(`throw on event unhandled exception is off, continuing`);
            return false;
        }
        return true;
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

        this.providersContext.distributedLocks = new DistributedLocksWrapper(
            await this.instancesFactory.getDistributedLocksInterfaceProvider(
                AssertNotNull(this.engineContext),
                await this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined),
            ),
            this.metrics,
        );

        //todo this.providersContext.logger = await this.instancesFactory.getLoggerInterfaceProvider(AssertNotNull(this.engineContext));
    }

    private prepareEngineContext() {
        this.engineContext = new EngineContext(AssertNotNull(this.getNamespace()));
    }

    private async runRules(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        rulesInstances: RuleInterface<any>[],
        source: string,
        pause?: () => () => void,
    ) {
        let engineRule;
        try {
            for (const ruleInstance of rulesInstances) {
                //todo pass schema level config
                const configurationAccessor = await TypeAssertNotNull(
                    this.providersContext.configuration,
                ).getConfigurationAccessorInterface(
                    engineEventContext,
                    this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
                );
                logger.debug(`Getting configuration accessor from Configuration provider`);

                engineRule = new EngineRule(
                    configurationAccessor,
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
                    (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source),
                    () => engineEventContext.getScheduledEvent() !== undefined,
                );
                logger.info(`Calling trigger on rule: ${ruleInstance.getModuleName()}`);
                // do we throw if a single rule fails?
                await this.runRule(engineEventContext, event, ruleInstance, engineRule, source, pause);
            }
        } catch (e) {
            if (this.handleException(e, pause)) {
                throw e;
            }
        }
        // run rules, on errors should we skip over rule or the whole event? also configurable
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
        scheduleAt: Date,
        source: string,
    ): Promise<ScheduledEventResponse> {
        const scheduledEvent = engineEventContext.getScheduledEvent();
        const scheduledCount = scheduledEvent !== undefined ? scheduledEvent.meta.scheduledCount + 1 : 1;

        return await AssertNotNull(this.providersContext.scheduledEvents).insertScheduledEvent(
            event,
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

    private async doAction<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse>(
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

        logger.info(`doAction: ${actionName}${triggeredAsAsync ? ' queued and triggered async' : ''}`);
        if (this.isActionDisabled(actionName)) {
            logger.info(`isActionDisabled on action: ${actionName}`);
            return undefined as ActionResponseType;
        }

        logger.debug(`Fetching action module: ${actionName}`);
        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [actionName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.Action);
        logger.debug(`Fetched action module: ${actionName}`);
        const configurationAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [actionInstance] = (await this.instancesFactory.getModulesInstances(
            engineEventContext,
            configurationAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        )) as ActionInterface<any, any>[];
        logger.debug(`Fetched action module instance: ${actionName}`);

        const engineAction = new EngineAction(
            configurationAccessor,
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
            const duration = timer.end();
            this.metrics?.timeAction(event, actionInstance.getModuleName(), duration, triggeredAsAsync);
            engineEventContext.getJournalLogger().endDoAction(actionName, undefined, duration, e as Error);
            throw e;
        }
    }

    private async pullDataObject(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        dataObjectName: string,
        request?: any,
    ) {
        logger.info(`pullDataObject: ${dataObjectName}`);

        if (this.isPullDataObjectHookAttached()) {
            return await this.callPullDataObject(dataObjectName, request);
        }

        const eventStoreKey = this.getDataObjectEventStoreKey(dataObjectName, request);
        if (eventStoreKey && engineEventContext.isInEventStore(eventStoreKey)) {
            logger.info(`pullDataObject: ${dataObjectName} result found in event store.`);
            engineEventContext.getJournalLogger().dataObjectPulledFromEventStore(dataObjectName, request);
            //todo metrics for cache hit on data objects
            return engineEventContext.getFromEventStore(eventStoreKey);
        }

        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [dataObjectName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.DataObject);
        logger.debug(`Fetched data object module: ${dataObjectName}`);
        const configurationAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [dataObjectInstance] = (await this.instancesFactory.getModulesInstances(
            engineEventContext,
            configurationAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        )) as DataObjectInterface<any, any>[];
        logger.debug(`Fetched data object module instance: ${dataObjectName}`);

        const engineDataObject = new EngineDataObject(
            configurationAccessor,
            engineEventContext,
            `data object - ${dataObjectName}`,
            request,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
            (value: any) => this.addResultIntoEventStore(engineEventContext, dataObjectName, request, value),
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
        ruleInstance: RuleInterface<any>,
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
            const ruleTimer = engineRule.getTimer().end();
            this.metrics?.timeRule(event, ruleInstance.getModuleName(), ruleTimer);
            engineEventContext.getJournalLogger().endRunRule(ruleInstance.getModuleName(), ruleTimer, e as Error);

            const config = new Config();
            if (this.handleException(e, pause)) {
                if (config.getFailEventOnSingleRuleFail()) {
                    // we need to bubble up and fail the whole event, we don't react to rule failure here
                    throw e;
                }
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
                        (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source),
                        () => engineEventContext.getScheduledEvent() !== undefined,
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
        ruleInstance: RuleInterface<any>,
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

    private addResultIntoEventStore(
        engineEventContext: EngineEventContext,
        dataObjectName: string,
        request: any,
        value: any,
    ) {
        if (!request) {
            logger.warn(
                `addResultIntoEventStore was called on the data object: ${dataObjectName} that has no request, ignoring`,
            );
            return;
        }
        const key = this.getDataObjectEventStoreKey(dataObjectName, request);
        engineEventContext.addToEventStore(key as string, value);
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

        logger.debug(`Fetching filters for event: ${eventName}`);
        const filterNames = this.schemaLoader.getFiltersForEvent(
            AssertNotNull(this.getNamespace()),
            entityName,
            eventName,
        );
        logger.debug(`Fetched filters for event: ${eventName}: ${filterNames.join(', ')}`);
        if (filterNames.length === 0) {
            logger.info(`No filters found for entityName: ${entityName}, eventName: ${eventName}`);
            return true; // continue
        }

        const filtersModules = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), filterNames);
        this.modulesLoader.validatePluginType(filtersModules, PluginType.Filter);
        logger.debug(`Fetched filtersModules`);

        logger.debug(`Fetching filtersInstances`);
        const configurationAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const filtersInstances = (await this.instancesFactory.getModulesInstances(
            engineEventContext,
            configurationAccessor,
            filtersModules,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        )) as FilterInterface<any>[];
        logger.debug(`Fetched filtersInstances: ${filtersInstances.length}`);
        return await this.runFilters(event, engineEventContext, filtersInstances);
    }

    private async processRules(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        source: string,
        pause: (() => () => void) | undefined,
    ) {
        const { entityName, eventName } = event;

        logger.debug(`Fetching rules for event: ${eventName}`);
        const rulesNames = this.schemaLoader.getRulesForEvent(
            AssertNotNull(this.getNamespace()),
            entityName,
            eventName,
        );
        logger.debug(`Fetched rules for event: ${eventName}: ${rulesNames.join(', ')}`);
        logger.debug(`Fetching rulesModules`);
        const rulesModules = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), rulesNames);
        this.modulesLoader.validatePluginType(rulesModules, PluginType.Rule);
        logger.debug(`Fetched rulesModules`);

        if (rulesModules.length === 0) {
            logger.warn(`No rules found for entityName: ${entityName}, eventName: ${eventName}`);
            return;
        }
        logger.debug(`Fetching rulesInstances`);
        const configurationAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );
        const rulesInstances = (await this.instancesFactory.getModulesInstances(
            engineEventContext,
            configurationAccessor,
            rulesModules,
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        )) as RuleInterface<any>[];
        logger.debug(`Fetched rulesInstances: ${rulesInstances.length}`);
        //*/ isRuleEnabled?
        await this.runRules(event, engineEventContext, rulesInstances, source, pause);
    }

    private async runFilters(
        event: GallifreyEventTypeInternal<any>,
        engineEventContext: EngineEventContext,
        filtersInstances: FilterInterface<any>[],
    ): Promise<boolean> {
        for (const filterInstance of filtersInstances) {
            //todo pass schema level config
            const configurationAccessor = await TypeAssertNotNull(
                this.providersContext.configuration,
            ).getConfigurationAccessorInterface(
                engineEventContext,
                this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
            );
            logger.debug(`Getting configuration accessor from Configuration provider`);

            const engineFilter = new EngineFilter(
                configurationAccessor,
                engineEventContext,
                `filters - ${filterInstance.getModuleName()}`,
                event.payload,
                engineEventContext.getJournalLogger(),
                (measurementName: string) =>
                    AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
                (dataObjectName: string, request?: any) =>
                    this.pullDataObject(event, engineEventContext, dataObjectName, request),
            );
            logger.info(`Calling canContinue on filter: ${filterInstance.getModuleName()}`);
            if (!(await this.canContinueFilter(engineEventContext, event, filterInstance, engineFilter))) {
                return false;
            }
        }
        return true;
    }

    private async canContinueFilter(
        engineEventContext: EngineEventContext,
        event: GallifreyEventTypeInternal<any>,
        filterInstance: FilterInterface<any>,
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
        logger.info(`Found ${consumers.length} consumers`);
        return await Promise.all(consumers.map((consumer) => this.startConsumer(consumer)));
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
    protected isPullDataObjectHookAttached() {
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

    private async startConsumer(consumer: NamespaceSchemaConsumer): Promise<GallifreyRulesEngineConsumerInterface> {
        logger.info(`Preparing consumer: ${consumer.name} of type: ${consumer.type}`);
        AssertTypeGuard(IsTypeNamespaceSchemaConsumer, consumer);

        const config = new Config();
        logger.info(`Starting consumer: ${consumer.name} of type: ${consumer.type}`);

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
        //let exitTimeout: undefined | NodeJS.Timeout;
        kafkaConsumer.addOnStopOnce(() => {
            logger.warn(`Consumer: ${consumer.name} received on stop, signaling process to stop.`);
            void this.stopConsumers();
            /*if (exitTimeout) {
                clearTimeout(exitTimeout);
            }
            exitTimeout = setTimeout(() => {
                logger.warn(`Exiting process after consumers shutdown.`);
                process.exit(1);
            }, 5000);*/
        });
        return new GallifreyRulesEngineKafkaConsumer(kafkaConsumer);
    }

    private async validatePayloadSchema(event: GallifreyEventType<any>) {
        const schemaFile = this.schemaLoader.getEventLevelSchemaFile(event.entityName, event.eventName);
        if (!schemaFile) {
            const config = new Config();
            if (config.isSchemaFileMandatory()) {
                throw new EngineCriticalError(`Event Payload SchemaFile was not found and is marked as mandatory`);
            }
            return;
        }

        const schemaTester = new JsonSchemaTester();
        try {
            logger.debug(`Testing payload schema against: ${schemaFile}`);
            await schemaTester.loadAndTest(schemaFile, event.payload);
        } catch (e) {
            logger.debug(`Failed payload schema validation against: ${schemaFile}`);
            throw new EngineCriticalError(`Failed to validatePayloadSchema: ${String(e)}`);
        }
    }

    private async processAsyncActions() {
        logger.debug(`Starting to process AsyncActions from schema`);
        const asyncActions = this.schemaLoader.getAsyncActions();
        for (const asyncAction of asyncActions) {
            const { actionPluginName, queuerConfig } = asyncAction;
            logger.info(`Processing AsyncAction: ${actionPluginName}`);
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
            logger.info(`Validating queuerConfig for: ${queuerInstance.getModuleName()}`);
            try {
                queuerInstance.validateQueuerConfig(queuerConfig);
            } catch (e) {
                throw new EngineCriticalError(
                    `Failed to validate queuer config for queuerProviderName: ${queuerInstance.getModuleName()}: ${String(e)}`,
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
        logger.info(`doAsyncAction: ${asyncActionName}`);
        if (this.isActionDisabled(asyncActionName)) {
            logger.info(`isActionDisabled on async action: ${asyncActionName}`);
            return undefined as ActionResponseType;
        }
        const asyncActionConfig = AssertNotNull(this.asyncActions.find((a) => a.actionPluginName === asyncActionName));

        logger.debug(`Fetching async action module: ${asyncActionName}`);
        const [moduleData] = this.modulesLoader.getModulesByName(AssertNotNull(this.getNamespace()), [asyncActionName]);
        this.modulesLoader.validatePluginType(moduleData, PluginType.Action);
        logger.debug(`Fetched action module: ${asyncActionName}`);
        const configurationAccessor = await TypeAssertNotNull(
            this.providersContext.configuration,
        ).getConfigurationAccessorInterface(
            engineEventContext,
            this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName),
        );

        const [asyncActionInstance] = (await this.instancesFactory.getModulesInstances(
            engineEventContext,
            configurationAccessor,
            [moduleData],
            engineEventContext.getJournalLogger(),
            (measurementName: string) =>
                AssertNotNull(this.providersContext.metrics).getPoint(`plugins.${measurementName}`),
        )) as AsyncActionInterface<any, any>[];
        logger.debug(`Fetched async action module instance: ${asyncActionName}`);

        const engineAction = new EngineAction(
            configurationAccessor,
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
            logger.info(`Preparing to queue Async action: ${asyncActionName}`);
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
                const duration = timer.end();
                this.metrics?.queuedAction(event, asyncActionName, duration, false);
                engineEventContext.getJournalLogger().endQueueAsyncAction(asyncActionName, duration, e as Error);
                throw new EngineCriticalError(`Failed to queue async action: ${String(e)}`);
            }
        } else {
            logger.info(`Async action decided to not queue and instead execute immediately: ${asyncActionName}`);
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
}

function AssertInitialized(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);
    function replacement(this: GallifreyRulesEngine, ...args: any[]) {
        if (!this.isInitialized()) {
            throw new EngineCriticalError(
                `GallifreyRulesEngine:${methodName} method called without engine being initialized.`,
            );
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return originalMethod.apply(this, args);
    }
    return replacement;
}
