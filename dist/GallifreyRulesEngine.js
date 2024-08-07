"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallifreyRulesEngine = void 0;
const CriticalError_1 = __importDefault(require("./errors/CriticalError"));
const WarningError_1 = __importDefault(require("./errors/WarningError"));
const InfoError_1 = __importDefault(require("./errors/InfoError"));
const SchemaLoader_1 = __importDefault(require("./lib/SchemaLoader"));
const ModulesLoader_1 = __importDefault(require("./lib/ModulesLoader"));
const Config_1 = __importDefault(require("./lib/Config"));
const logger_1 = require("./lib/logger");
const ProvidersContext_1 = require("./lib/ProvidersContext");
const InstancesFactory_1 = __importDefault(require("./lib/InstancesFactory"));
const EngineContext_1 = require("./lib/EngineContext");
const Utils_1 = require("./lib/Utils");
const EngineEventContext_1 = require("./lib/EngineEventContext");
const EngineRule_1 = __importDefault(require("./lib/EngineRule"));
const InterfaceDecorators_1 = require("./interfaces/InterfaceDecorators");
const EngineDataObject_1 = __importDefault(require("./lib/EngineDataObject"));
const EngineAction_1 = __importDefault(require("./lib/EngineAction"));
const Metrics_1 = require("./lib/Metrics");
const EngineCriticalError_1 = __importDefault(require("./errors/EngineCriticalError"));
const PauseConsumer_1 = __importDefault(require("./errors/PauseConsumer"));
const PerformanceTimer_1 = __importDefault(require("./lib/PerformanceTimer"));
const SafeJournalLoggerWrapper_1 = __importDefault(require("./SafeJournalLoggerWrapper"));
const Decorators_1 = require("./lib/Decorators");
const object_hash_1 = __importDefault(require("object-hash"));
const EngineFilter_1 = __importDefault(require("./lib/EngineFilter"));
const NamespaceSchema_1 = require("./lib/NamespaceSchema");
const KafkaConsumer_1 = require("./KafkaConsumer");
const BasicTypeGuards_1 = require("./BasicTypeGuards");
const GallifreyEventType_1 = require("./GallifreyEventType");
const GallifreyRulesEngineKafkaConsumer_1 = __importDefault(require("./consumers/GallifreyRulesEngineKafkaConsumer"));
const ScheduledEventType_1 = require("./engine-events/ScheduledEventType");
const DistributedLocksWrapper_1 = __importDefault(require("./DistributedLocksWrapper"));
const EngineReactToFailure_1 = __importDefault(require("./lib/EngineReactToFailure"));
const JsonSchemaTester_1 = __importDefault(require("./lib/JsonSchemaTester"));
const figlet_1 = require("figlet");
const os_1 = require("os");
const colors_1 = __importDefault(require("colors"));
const ascii_1 = require("./ascii");
let GallifreyRulesEngine = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _handleAsyncActionEvent_decorators;
    let _handleScheduledEvent_decorators;
    let _handleEvent_decorators;
    let _getNamespace_decorators;
    let _reactToRuleFailure_decorators;
    let _reactToEventFailure_decorators;
    let _startConsumers_decorators;
    return _a = class GallifreyRulesEngine {
            constructor() {
                this.schemaLoader = __runInitializers(this, _instanceExtraInitializers);
                this.startedConsumers = [];
                this.asyncActions = [];
                this.schemaLoader = new SchemaLoader_1.default();
                this.modulesLoader = new ModulesLoader_1.default();
                this.config = new Config_1.default();
                this.providersContext = new ProvidersContext_1.ProvidersContext();
                this.instancesFactory = new InstancesFactory_1.default(this.schemaLoader, this.modulesLoader);
            }
            describeEnvironment() {
                return this.config.describe();
            }
            initializeFromFile(namespaceSchemaFile) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.schemaLoader.isLoaded()) {
                        throw new EngineCriticalError_1.default(`Engine already initialized`);
                    }
                    try {
                        yield this.schemaLoader.loadSchemaFromFile(namespaceSchemaFile);
                        return this.continueInitialize();
                    }
                    catch (e) {
                        this.schemaLoader.unload();
                        throw e;
                    }
                });
            }
            initialize(namespaceSchema) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.schemaLoader.isLoaded()) {
                        throw new EngineCriticalError_1.default(`Engine already initialized`);
                    }
                    try {
                        yield this.schemaLoader.loadSchema(namespaceSchema);
                        return this.continueInitialize();
                    }
                    catch (e) {
                        this.schemaLoader.unload();
                        throw e;
                    }
                });
            }
            continueInitialize() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    // loading modules
                    if (this.config.getModulesPaths().length !== 0) {
                        logger_1.logger.info(`Found modules path to load from config.`);
                        yield Promise.all(this.config.getModulesPaths().map((path) => this.modulesLoader.loadModulesFromPath(path)));
                    }
                    if (this.schemaLoader.getModulesPath().length !== 0) {
                        logger_1.logger.info(`Found modules path to load from schema.`);
                        yield Promise.all(this.schemaLoader.getModulesPath().map((path) => this.modulesLoader.loadModulesFromPath(path)));
                    }
                    if (this.modulesLoader.getModules().length === 0) {
                        logger_1.logger.warn(`No modules has been loaded.`);
                    }
                    this.prepareEngineContext();
                    yield this.prepareProviders();
                    yield this.processAsyncActions();
                    (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.engineInitialized((0, Utils_1.AssertNotNull)(this.getNamespace()));
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
                });
            }
            shutdown() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.schemaLoader.unload();
                    yield this.stopConsumers();
                });
            }
            handleAsyncActionEvent(asyncActionEvent, source, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    const { namespace, actionName, payload, entityName, eventName, eventId } = asyncActionEvent;
                    //const eventLag = 0; // todo: calculate
                    logger_1.logger.info(`handleAsyncActionEvent [START: ${actionName}]`);
                    logger_1.logger.debug(`handleAsyncActionEvent [START: ${actionName}] Details: ${JSON.stringify(asyncActionEvent, null, 2)}`);
                    if (namespace !== this.getNamespace()) {
                        throw new EngineCriticalError_1.default(`namespace used in async action event: ${namespace} doesn't match engine namespace: ${this.getNamespace()}`);
                    }
                    const engineEventContext = new EngineEventContext_1.EngineEventContext((0, Utils_1.AssertNotNull)(this.getNamespace()), asyncActionEvent.entityName, asyncActionEvent.eventName, asyncActionEvent.eventId, source);
                    const config = yield ((_c = (_b = this.providersContext) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(asyncActionEvent.entityName, asyncActionEvent.eventName)));
                    engineEventContext.setJournalLogger(new SafeJournalLoggerWrapper_1.default(yield this.instancesFactory.getJournalLoggerInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), (0, Utils_1.AssertNotNull)(config))));
                    try {
                        yield this.doAction({
                            namespace,
                            entityName,
                            eventName,
                            eventId,
                            payload: undefined, //todo is this needed for actions?
                            source,
                            eventLag: 0, //todo
                        }, engineEventContext, actionName, payload, true);
                    }
                    catch (e) {
                        logger_1.logger.error(`handleAsyncActionEvent [EXCEPTION: ${actionName}]: ${JSON.stringify(Object.assign(Object.assign({}, asyncActionEvent), { error: e }))}`);
                        if (this.handleException(e, pause)) {
                            throw e;
                        }
                    }
                });
            }
            handleScheduledEvent(scheduledEvent, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    const { entityName, eventName, eventId, source } = scheduledEvent.event;
                    const eventLag = 0; // todo: calculate
                    logger_1.logger.info(`handleScheduledEvent [START: ${eventId}]: ${JSON.stringify({
                        entityName,
                        eventName,
                        eventId,
                        source,
                        eventLag,
                    })}`);
                    logger_1.logger.debug(`handleScheduledEvent [START: ${eventId}] Details: ${JSON.stringify(scheduledEvent, null, 2)}`);
                    if (scheduledEvent.event.namespace !== this.getNamespace()) {
                        throw new EngineCriticalError_1.default(`namespace used in scheduled event: ${scheduledEvent.event.namespace} doesn't match engine namespace: ${this.getNamespace()}`);
                    }
                    const engineEventContext = new EngineEventContext_1.EngineEventContext((0, Utils_1.AssertNotNull)(this.getNamespace()), scheduledEvent.event.entityName, scheduledEvent.event.eventName, scheduledEvent.event.eventId, scheduledEvent.event.source);
                    const config = yield ((_c = (_b = this.providersContext) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(scheduledEvent.event.entityName, scheduledEvent.event.eventName)));
                    engineEventContext.setJournalLogger(new SafeJournalLoggerWrapper_1.default(yield this.instancesFactory.getJournalLoggerInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), (0, Utils_1.AssertNotNull)(config))));
                    engineEventContext.setScheduledEvent(scheduledEvent);
                    return yield this.coreHandleEvent(engineEventContext, {
                        namespace: this.getNamespace(),
                        entityName: scheduledEvent.event.entityName,
                        eventId: scheduledEvent.event.eventId,
                        eventLag,
                        eventName: scheduledEvent.event.eventName,
                        payload: scheduledEvent.event.payload,
                        source: scheduledEvent.event.source,
                    }, pause);
                });
            }
            handleEvent(event, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    const internalEvent = Object.assign(Object.assign({}, event), { namespace: this.getNamespace() });
                    const { entityName, eventName, eventId, eventLag, source } = internalEvent;
                    logger_1.logger.info(`handleEvent [START: ${eventId}]: ${JSON.stringify({
                        entityName,
                        eventName,
                        eventId,
                        source,
                        eventLag,
                    })}`);
                    logger_1.logger.debug(`handleEvent [START: ${eventId}] Details: ${JSON.stringify(event, null, 2)}`);
                    (0, BasicTypeGuards_1.AssertTypeGuard)(GallifreyEventType_1.IsTypeGallifreyEventType, event);
                    yield this.validatePayloadSchema(event);
                    const engineEventContext = new EngineEventContext_1.EngineEventContext((0, Utils_1.AssertNotNull)(this.getNamespace()), entityName, eventName, eventId, source);
                    const config = yield ((_c = (_b = this.providersContext) === null || _b === void 0 ? void 0 : _b.configuration) === null || _c === void 0 ? void 0 : _c.getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName)));
                    engineEventContext.setJournalLogger(new SafeJournalLoggerWrapper_1.default(yield this.instancesFactory.getJournalLoggerInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), (0, Utils_1.AssertNotNull)(config))));
                    return yield this.coreHandleEvent(engineEventContext, internalEvent, pause);
                });
            }
            coreHandleEvent(engineEventContext, internalEvent, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c, _d, _e, _f;
                    (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.handleEvent(internalEvent);
                    const timer = new PerformanceTimer_1.default().resume();
                    const { entityName, eventName, eventId, eventLag, source } = internalEvent;
                    const { release, acquired } = yield (0, Utils_1.AssertNotNull)(this.providersContext.distributedLocks).acquireLock(internalEvent);
                    if (!acquired) {
                        const config = new Config_1.default();
                        if (config.isContinueOnFailedAcquireLock()) {
                            logger_1.logger.warn(`Failed to acquire distributed lock, but set to ignore, continuing with event.`);
                        }
                        else {
                            throw new EngineCriticalError_1.default(`Failed to acquire distributed lock`);
                        }
                    }
                    try {
                        engineEventContext.getJournalLogger().startEvent(internalEvent);
                        const canContinue = yield this.processFilters(internalEvent, engineEventContext);
                        if (canContinue) {
                            yield this.processRules(internalEvent, engineEventContext, source, pause);
                        }
                        else {
                            logger_1.logger.info(`Skipping rules, canContinue is false`);
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
                        (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.timeEvent(internalEvent, duration); //*/ extra tags/fields like canContinue
                        engineEventContext.getJournalLogger().endEvent(duration);
                        yield ((_d = this.metrics) === null || _d === void 0 ? void 0 : _d.flush());
                    }
                    catch (e) {
                        const duration = timer.end();
                        (_e = this.metrics) === null || _e === void 0 ? void 0 : _e.timeEvent(internalEvent, duration);
                        engineEventContext.getJournalLogger().endEvent(duration, e);
                        logger_1.logger.error(`handleEvent [EXCEPTION: ${eventId}]: ${JSON.stringify({
                            entityName,
                            eventName,
                            eventId,
                            source,
                            eventLag,
                            error: String(e),
                        })}`);
                        (_f = this.metrics) === null || _f === void 0 ? void 0 : _f.countErrors(internalEvent);
                        if (this.handleException(e, pause)) {
                            yield this.reactToEventFailure(new EngineReactToFailure_1.default(yield (0, Utils_1.AssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(internalEvent.entityName, internalEvent.eventName)), (0, Utils_1.AssertNotNull)(engineEventContext), `reactToEventFailure`, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), () => this.getScheduledEventContext(engineEventContext), (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source), () => engineEventContext.getScheduledEvent() !== undefined), internalEvent.payload, e);
                            throw e;
                        }
                    }
                    finally {
                        logger_1.logger.info(`handleEvent [END: ${eventId}]: ${JSON.stringify({
                            entityName,
                            eventName,
                            eventId,
                            source,
                            eventLag,
                        })}`);
                        logger_1.logger.debug(`handleEvent [END: ${eventId}] Details: ${JSON.stringify(internalEvent, null, 2)}`);
                        yield release();
                        // cleanups? journal logs?
                        // decrement active events
                    }
                });
            }
            handleException(e, pause) {
                var _b;
                const config = new Config_1.default();
                if (pause && e instanceof PauseConsumer_1.default) {
                    logger_1.logger.info(`Got PauseConsumer exception with seconds: ${e.getSeconds()}`);
                    const resume = pause();
                    setTimeout(() => {
                        logger_1.logger.info(`PauseConsumer timer expired, resuming`);
                        resume();
                    }, e.getSeconds() * 1000);
                    return false;
                }
                if (e instanceof EngineCriticalError_1.default) {
                    logger_1.logger.error(`An engine critical error has occurred while handling event: ${String(e)}`);
                    return true;
                }
                if (e instanceof CriticalError_1.default) {
                    logger_1.logger.error(`A critical error has occurred while handling event: ${String(e)}`);
                    if (!config.dontThrowOnCriticalError()) {
                        logger_1.logger.warn(`throw on critical error exception is off, continuing`);
                        return false;
                    }
                    return true;
                }
                if (e instanceof InfoError_1.default) {
                    logger_1.logger.info(`An info error has occurred while handling event: ${String(e)}`);
                    return false;
                }
                if (e instanceof WarningError_1.default) {
                    logger_1.logger.warn(`A warning error has occurred while handling event: ${String(e)}`);
                    return false; //todo we will figure out whether to stop or not
                }
                if (!config.throwOnEventUnhandledException()) {
                    logger_1.logger.error(`An unhandled error has occurred while handling event: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                    logger_1.logger.warn(`throw on event unhandled exception is off, continuing`);
                    return false;
                }
                return true;
            }
            getNamespace() {
                return this.schemaLoader.getNamespace();
            }
            prepareProviders() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.providersContext.configuration = yield this.instancesFactory.getConfigurationInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext));
                    this.providersContext.metrics = yield this.instancesFactory.getMetricsInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined));
                    this.metrics = new Metrics_1.Metrics(this.providersContext.metrics);
                    this.providersContext.reactToFailure = yield this.instancesFactory.getReactToFailureInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined));
                    this.providersContext.scheduledEvents = yield this.instancesFactory.getScheduledEventsInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined));
                    this.providersContext.distributedLocks = new DistributedLocksWrapper_1.default(yield this.instancesFactory.getDistributedLocksInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield this.providersContext.configuration.getConfigurationAccessorInterface(undefined, undefined)), this.metrics);
                    //todo this.providersContext.logger = await this.instancesFactory.getLoggerInterfaceProvider(AssertNotNull(this.engineContext));
                });
            }
            prepareEngineContext() {
                this.engineContext = new EngineContext_1.EngineContext((0, Utils_1.AssertNotNull)(this.getNamespace()));
            }
            runRules(event, engineEventContext, rulesInstances, source, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    let engineRule;
                    try {
                        for (const ruleInstance of rulesInstances) {
                            //todo pass schema level config
                            const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                            logger_1.logger.debug(`Getting configuration accessor from Configuration provider`);
                            engineRule = new EngineRule_1.default(configurationAccessor, engineEventContext, (actionName, payload) => this.doAction(event, engineEventContext, actionName, payload), (dataObjectName, request) => this.pullDataObject(event, engineEventContext, dataObjectName, request), `rules - ${ruleInstance.getModuleName()}`, event.payload, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), () => this.getScheduledEventContext(engineEventContext), (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source), () => engineEventContext.getScheduledEvent() !== undefined);
                            logger_1.logger.info(`Calling trigger on rule: ${ruleInstance.getModuleName()}`);
                            // do we throw if a single rule fails?
                            yield this.runRule(engineEventContext, event, ruleInstance, engineRule, source, pause);
                        }
                    }
                    catch (e) {
                        if (this.handleException(e, pause)) {
                            throw e;
                        }
                    }
                    // run rules, on errors should we skip over rule or the whole event? also configurable
                    // within rules, run actions and see if we have to queue them or not
                    // check error rates
                });
            }
            getScheduledEventContext(engineEventContext) {
                const scheduledEvent = engineEventContext.getScheduledEvent();
                if ((0, ScheduledEventType_1.IsTypeScheduledEventType)(scheduledEvent)) {
                    return {
                        createdAt: scheduledEvent.meta.createdAt,
                        scheduledAt: scheduledEvent.meta.scheduledAt,
                        scheduledCount: scheduledEvent.meta.scheduledCount,
                        triggeredBy: scheduledEvent.meta.triggeredBy,
                    };
                }
                else {
                    return undefined;
                }
            }
            insertScheduledEvent(engineEventContext, event, scheduleAt, source) {
                return __awaiter(this, void 0, void 0, function* () {
                    const scheduledEvent = engineEventContext.getScheduledEvent();
                    const scheduledCount = scheduledEvent !== undefined ? scheduledEvent.meta.scheduledCount + 1 : 1;
                    return yield (0, Utils_1.AssertNotNull)(this.providersContext.scheduledEvents).insertScheduledEvent(event, {
                        entityName: engineEventContext.getEntityName(),
                        eventID: engineEventContext.getEventID(),
                        eventName: engineEventContext.getEventName(),
                        namespace: (0, Utils_1.AssertNotNull)(this.getNamespace()),
                        source,
                    }, scheduleAt, scheduledCount);
                });
            }
            doAction(event_1, engineEventContext_1, actionName_1, payload_1) {
                return __awaiter(this, arguments, void 0, function* (event, engineEventContext, actionName, payload, triggeredAsAsync = false) {
                    var _b, _c;
                    //asyncActions?
                    if (!triggeredAsAsync && this.asyncActions.some((a) => a.actionPluginName === actionName)) {
                        return this.doAsyncAction(event, engineEventContext, actionName, payload);
                    }
                    logger_1.logger.info(`doAction: ${actionName}${triggeredAsAsync ? ' queued and triggered async' : ''}`);
                    if (this.isActionDisabled(actionName)) {
                        logger_1.logger.info(`isActionDisabled on action: ${actionName}`);
                        return undefined;
                    }
                    logger_1.logger.debug(`Fetching action module: ${actionName}`);
                    const [moduleData] = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), [actionName]);
                    this.modulesLoader.validatePluginType(moduleData, InterfaceDecorators_1.PluginType.Action);
                    logger_1.logger.debug(`Fetched action module: ${actionName}`);
                    const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                    const [actionInstance] = (yield this.instancesFactory.getModulesInstances(engineEventContext, configurationAccessor, [moduleData], engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`)));
                    logger_1.logger.debug(`Fetched action module instance: ${actionName}`);
                    const engineAction = new EngineAction_1.default(configurationAccessor, engineEventContext, `action - ${actionName}`, payload, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), triggeredAsAsync);
                    const timer = new PerformanceTimer_1.default();
                    try {
                        engineEventContext.getJournalLogger().startDoAction(actionName, payload);
                        timer.resume();
                        const response = yield actionInstance.trigger(engineAction);
                        const duration = timer.end();
                        (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.timeAction(event, actionInstance.getModuleName(), duration, triggeredAsAsync);
                        engineEventContext.getJournalLogger().endDoAction(actionName, response, duration);
                        return response;
                    }
                    catch (e) {
                        const duration = timer.end();
                        (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.timeAction(event, actionInstance.getModuleName(), duration, triggeredAsAsync);
                        engineEventContext.getJournalLogger().endDoAction(actionName, undefined, duration, e);
                        throw e;
                    }
                });
            }
            pullDataObject(event, engineEventContext, dataObjectName, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    logger_1.logger.info(`pullDataObject: ${dataObjectName}`);
                    if (this.isPullDataObjectHookAttached()) {
                        return yield this.callPullDataObject(dataObjectName, request);
                    }
                    const eventStoreKey = this.getDataObjectEventStoreKey(dataObjectName, request);
                    if (eventStoreKey && engineEventContext.isInEventStore(eventStoreKey)) {
                        logger_1.logger.info(`pullDataObject: ${dataObjectName} result found in event store.`);
                        engineEventContext.getJournalLogger().dataObjectPulledFromEventStore(dataObjectName, request);
                        //todo metrics for cache hit on data objects
                        return engineEventContext.getFromEventStore(eventStoreKey);
                    }
                    const [moduleData] = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), [dataObjectName]);
                    this.modulesLoader.validatePluginType(moduleData, InterfaceDecorators_1.PluginType.DataObject);
                    logger_1.logger.debug(`Fetched data object module: ${dataObjectName}`);
                    const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                    const [dataObjectInstance] = (yield this.instancesFactory.getModulesInstances(engineEventContext, configurationAccessor, [moduleData], engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`)));
                    logger_1.logger.debug(`Fetched data object module instance: ${dataObjectName}`);
                    const engineDataObject = new EngineDataObject_1.default(configurationAccessor, engineEventContext, `data object - ${dataObjectName}`, request, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), (value) => this.addResultIntoEventStore(engineEventContext, dataObjectName, request, value));
                    const timer = new PerformanceTimer_1.default();
                    try {
                        engineEventContext.getJournalLogger().startPullDataObject(dataObjectName, request);
                        timer.resume();
                        const response = yield dataObjectInstance.get(engineDataObject);
                        const duration = timer.end();
                        (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.timeDataObject(event, dataObjectInstance.getModuleName(), duration);
                        engineEventContext.getJournalLogger().endPullDataObject(dataObjectName, response, duration);
                        return response;
                    }
                    catch (e) {
                        const duration = timer.end();
                        (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.timeDataObject(event, dataObjectInstance.getModuleName(), duration);
                        engineEventContext.getJournalLogger().endPullDataObject(dataObjectName, undefined, duration, e);
                        throw e;
                    }
                });
            }
            isInitialized() {
                return this.schemaLoader.isLoaded();
            }
            runRule(engineEventContext, event, ruleInstance, engineRule, source, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c, _d;
                    try {
                        engineEventContext.getJournalLogger().startRunRule(ruleInstance.getModuleName());
                        engineRule.getTimer().resume();
                        yield ruleInstance.trigger(engineRule);
                        const ruleTimer = engineRule.getTimer().end();
                        engineEventContext.getJournalLogger().endRunRule(ruleInstance.getModuleName(), ruleTimer);
                        (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.timeRule(event, ruleInstance.getModuleName(), ruleTimer);
                    }
                    catch (e) {
                        const ruleTimer = engineRule.getTimer().end();
                        (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.timeRule(event, ruleInstance.getModuleName(), ruleTimer);
                        engineEventContext.getJournalLogger().endRunRule(ruleInstance.getModuleName(), ruleTimer, e);
                        const config = new Config_1.default();
                        if (this.handleException(e, pause)) {
                            if (config.getFailEventOnSingleRuleFail()) {
                                // we need to bubble up and fail the whole event, we don't react to rule failure here
                                throw e;
                            }
                            // we don't bubble, capture failure and logs, count errors here as higher level won't get a chance
                            (_d = this.metrics) === null || _d === void 0 ? void 0 : _d.countErrors(event);
                            yield this.reactToRuleFailure(new EngineReactToFailure_1.default(yield (0, Utils_1.AssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName)), (0, Utils_1.AssertNotNull)(engineEventContext), `reactToRuleFailure`, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), () => this.getScheduledEventContext(engineEventContext), (event, scheduleAt) => this.insertScheduledEvent(engineEventContext, event, scheduleAt, source), () => engineEventContext.getScheduledEvent() !== undefined), event.payload, e, ruleInstance);
                        }
                    }
                });
            }
            publishPartitionLag(lag, partition, topic, groupId) {
                var _b;
                if (!this.getNamespace()) {
                    return;
                }
                (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.publishPartitionLag(this.getNamespace(), lag, partition, topic, groupId);
            }
            reactToRuleFailure(engine, payload, error, ruleInstance) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (0, Utils_1.AssertNotNull)(this.providersContext.reactToFailure).reactToRuleFailure(engine, payload, error, ruleInstance.getModuleName());
                });
            }
            reactToEventFailure(engine, payload, error) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield (0, Utils_1.AssertNotNull)(this.providersContext.reactToFailure).reactToEventFailure(engine, payload, error);
                });
            }
            addResultIntoEventStore(engineEventContext, dataObjectName, request, value) {
                if (!request) {
                    logger_1.logger.warn(`addResultIntoEventStore was called on the data object: ${dataObjectName} that has no request, ignoring`);
                    return;
                }
                const key = this.getDataObjectEventStoreKey(dataObjectName, request);
                engineEventContext.addToEventStore(key, value);
            }
            getDataObjectEventStoreKey(dataObjectName, request) {
                if (!request) {
                    return undefined;
                }
                return `${dataObjectName}-${(0, object_hash_1.default)(request)}`;
            }
            processFilters(event, engineEventContext) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { entityName, eventName } = event;
                    logger_1.logger.debug(`Fetching filters for event: ${eventName}`);
                    const filterNames = this.schemaLoader.getFiltersForEvent((0, Utils_1.AssertNotNull)(this.getNamespace()), entityName, eventName);
                    logger_1.logger.debug(`Fetched filters for event: ${eventName}: ${filterNames.join(', ')}`);
                    if (filterNames.length === 0) {
                        logger_1.logger.info(`No filters found for entityName: ${entityName}, eventName: ${eventName}`);
                        return true; // continue
                    }
                    const filtersModules = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), filterNames);
                    this.modulesLoader.validatePluginType(filtersModules, InterfaceDecorators_1.PluginType.Filter);
                    logger_1.logger.debug(`Fetched filtersModules`);
                    logger_1.logger.debug(`Fetching filtersInstances`);
                    const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                    const filtersInstances = (yield this.instancesFactory.getModulesInstances(engineEventContext, configurationAccessor, filtersModules, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`)));
                    logger_1.logger.debug(`Fetched filtersInstances: ${filtersInstances.length}`);
                    return yield this.runFilters(event, engineEventContext, filtersInstances);
                });
            }
            processRules(event, engineEventContext, source, pause) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { entityName, eventName } = event;
                    logger_1.logger.debug(`Fetching rules for event: ${eventName}`);
                    const rulesNames = this.schemaLoader.getRulesForEvent((0, Utils_1.AssertNotNull)(this.getNamespace()), entityName, eventName);
                    logger_1.logger.debug(`Fetched rules for event: ${eventName}: ${rulesNames.join(', ')}`);
                    logger_1.logger.debug(`Fetching rulesModules`);
                    const rulesModules = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), rulesNames);
                    this.modulesLoader.validatePluginType(rulesModules, InterfaceDecorators_1.PluginType.Rule);
                    logger_1.logger.debug(`Fetched rulesModules`);
                    if (rulesModules.length === 0) {
                        logger_1.logger.warn(`No rules found for entityName: ${entityName}, eventName: ${eventName}`);
                        return;
                    }
                    logger_1.logger.debug(`Fetching rulesInstances`);
                    const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                    const rulesInstances = (yield this.instancesFactory.getModulesInstances(engineEventContext, configurationAccessor, rulesModules, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`)));
                    logger_1.logger.debug(`Fetched rulesInstances: ${rulesInstances.length}`);
                    //*/ isRuleEnabled?
                    yield this.runRules(event, engineEventContext, rulesInstances, source, pause);
                });
            }
            runFilters(event, engineEventContext, filtersInstances) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const filterInstance of filtersInstances) {
                        //todo pass schema level config
                        const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                        logger_1.logger.debug(`Getting configuration accessor from Configuration provider`);
                        const engineFilter = new EngineFilter_1.default(configurationAccessor, engineEventContext, `filters - ${filterInstance.getModuleName()}`, event.payload, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), (dataObjectName, request) => this.pullDataObject(event, engineEventContext, dataObjectName, request));
                        logger_1.logger.info(`Calling canContinue on filter: ${filterInstance.getModuleName()}`);
                        if (!(yield this.canContinueFilter(engineEventContext, event, filterInstance, engineFilter))) {
                            return false;
                        }
                    }
                    return true;
                });
            }
            canContinueFilter(engineEventContext, event, filterInstance, engineFilter) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    try {
                        engineEventContext.getJournalLogger().startFilter(filterInstance.getModuleName());
                        engineFilter.getTimer().resume();
                        const canContinue = yield filterInstance.canContinue(engineFilter);
                        const filterTimer = engineFilter.getTimer().end();
                        engineEventContext.getJournalLogger().endFilter(filterInstance.getModuleName(), filterTimer);
                        (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.timeFilter(event, filterInstance.getModuleName(), filterTimer);
                        if (!canContinue) {
                            engineEventContext.getJournalLogger().filterStoppedEvent(filterInstance.getModuleName(), filterTimer);
                        }
                        return canContinue;
                    }
                    catch (e) {
                        const filterTimer = engineFilter.getTimer().end();
                        (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.timeFilter(event, filterInstance.getModuleName(), filterTimer);
                        engineEventContext.getJournalLogger().endFilter(filterInstance.getModuleName(), filterTimer, e);
                        throw e;
                    }
                });
            }
            startConsumers() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.startedConsumers.length) {
                        throw new EngineCriticalError_1.default(`Consumers already started`);
                    }
                    const consumers = this.schemaLoader.getConsumers();
                    logger_1.logger.info(`Found ${consumers.length} consumers`);
                    return yield Promise.all(consumers.map((consumer) => this.startConsumer(consumer)));
                });
            }
            stopConsumers() {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const consumer of this.startedConsumers) {
                        yield consumer.stopConsumer();
                    }
                    this.startedConsumers = [];
                });
            }
            stopConsumersAndWait() {
                return __awaiter(this, void 0, void 0, function* () {
                    for (const consumer of this.startedConsumers) {
                        yield consumer.stopConsumerAndWait();
                    }
                    this.startedConsumers = [];
                });
            }
            /**
             * Used for testing in the derived classes
             * @param actionName
             * @protected
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            isActionDisabled(actionName) {
                return false;
            }
            /**
             * Used for testing in the derived classes
             * @protected
             */
            isPullDataObjectHookAttached() {
                return false;
            }
            /**
             * Used for testing in the derived classes
             * @protected
             */
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            callPullDataObject(dataObjectName, request) {
                return __awaiter(this, void 0, void 0, function* () {
                    return Promise.resolve(undefined);
                });
            }
            startConsumer(consumer) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    logger_1.logger.info(`Preparing consumer: ${consumer.name} of type: ${consumer.type}`);
                    (0, BasicTypeGuards_1.AssertTypeGuard)(NamespaceSchema_1.IsTypeNamespaceSchemaConsumer, consumer);
                    const config = new Config_1.default();
                    logger_1.logger.info(`Starting consumer: ${consumer.name} of type: ${consumer.type}`);
                    const kafkaConsumer = new KafkaConsumer_1.KafkaConsumer(consumer.name, (_b = consumer.config.clientId) !== null && _b !== void 0 ? _b : config.getKafkaClientID(), (_c = consumer.config.brokers) !== null && _c !== void 0 ? _c : config.getKafkaBrokers(), this);
                    switch (consumer.type) {
                        case 'kafka':
                            {
                                if (!consumer.eventDispatcher) {
                                    throw new EngineCriticalError_1.default(`eventDispatcher is needed for 'kafka' consumer`);
                                }
                                const eventDispatcher = this.instancesFactory.getEventDispatcherProvider(consumer.eventDispatcher);
                                yield kafkaConsumer.startConsumer(consumer.config, (message) => {
                                    const payload = JSON.parse(String(message.value));
                                    return eventDispatcher.getEvent(payload);
                                });
                            }
                            break;
                        case 'kafka:scheduled-events':
                            yield kafkaConsumer.startScheduleEventConsumer(consumer.config);
                            break;
                        case 'kafka:async-actions':
                            yield kafkaConsumer.startAsyncActionsConsumer(consumer.config);
                            break;
                        default:
                            throw new EngineCriticalError_1.default(`Unsupported consumer type: ${consumer.type}`);
                    }
                    this.startedConsumers.push(kafkaConsumer);
                    // stopping? let's stop all consumers
                    //let exitTimeout: undefined | NodeJS.Timeout;
                    kafkaConsumer.addOnStopOnce(() => {
                        logger_1.logger.warn(`Consumer: ${consumer.name} received on stop, signaling process to stop.`);
                        void this.stopConsumers();
                        /*if (exitTimeout) {
                            clearTimeout(exitTimeout);
                        }
                        exitTimeout = setTimeout(() => {
                            logger.warn(`Exiting process after consumers shutdown.`);
                            process.exit(1);
                        }, 5000);*/
                    });
                    return new GallifreyRulesEngineKafkaConsumer_1.default(kafkaConsumer);
                });
            }
            validatePayloadSchema(event) {
                return __awaiter(this, void 0, void 0, function* () {
                    const schemaFile = this.schemaLoader.getEventLevelSchemaFile(event.entityName, event.eventName);
                    if (!schemaFile) {
                        const config = new Config_1.default();
                        if (config.isSchemaFileMandatory()) {
                            throw new EngineCriticalError_1.default(`Event Payload SchemaFile was not found and is marked as mandatory`);
                        }
                        return;
                    }
                    const schemaTester = new JsonSchemaTester_1.default();
                    try {
                        logger_1.logger.debug(`Testing payload schema against: ${schemaFile}`);
                        yield schemaTester.loadAndTest(schemaFile, event.payload);
                    }
                    catch (e) {
                        logger_1.logger.debug(`Failed payload schema validation against: ${schemaFile}`);
                        throw new EngineCriticalError_1.default(`Failed to validatePayloadSchema: ${String(e)}`);
                    }
                });
            }
            processAsyncActions() {
                return __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.debug(`Starting to process AsyncActions from schema`);
                    const asyncActions = this.schemaLoader.getAsyncActions();
                    for (const asyncAction of asyncActions) {
                        const { actionPluginName, queuerConfig } = asyncAction;
                        logger_1.logger.info(`Processing AsyncAction: ${actionPluginName}`);
                        // action exists?
                        const [moduleData] = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), [
                            actionPluginName,
                        ]);
                        this.modulesLoader.validatePluginType(moduleData, InterfaceDecorators_1.PluginType.Action);
                        // make sure it has the tags needed
                        if (!moduleData.tags.includes(InterfaceDecorators_1.AsyncActionTag)) {
                            throw new EngineCriticalError_1.default(`AsyncAction: ${actionPluginName} is missing "${InterfaceDecorators_1.AsyncActionTag}" tag. Are you sure you added @AsyncAction decorator?`);
                        }
                        // action queuer is taken from main schema, perhaps in the future we would want to override from $asyncActions
                        const queuerInstance = yield this.instancesFactory.getActionQueuerInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield (0, Utils_1.AssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(undefined, undefined));
                        logger_1.logger.info(`Validating queuerConfig for: ${queuerInstance.getModuleName()}`);
                        try {
                            queuerInstance.validateQueuerConfig(queuerConfig);
                        }
                        catch (e) {
                            throw new EngineCriticalError_1.default(`Failed to validate queuer config for queuerProviderName: ${queuerInstance.getModuleName()}: ${String(e)}`);
                        }
                        this.asyncActions.push(asyncAction);
                    }
                });
            }
            doAsyncAction(event, engineEventContext, asyncActionName, payload) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b, _c, _d, _e;
                    logger_1.logger.info(`doAsyncAction: ${asyncActionName}`);
                    if (this.isActionDisabled(asyncActionName)) {
                        logger_1.logger.info(`isActionDisabled on async action: ${asyncActionName}`);
                        return undefined;
                    }
                    const asyncActionConfig = (0, Utils_1.AssertNotNull)(this.asyncActions.find((a) => a.actionPluginName === asyncActionName));
                    logger_1.logger.debug(`Fetching async action module: ${asyncActionName}`);
                    const [moduleData] = this.modulesLoader.getModulesByName((0, Utils_1.AssertNotNull)(this.getNamespace()), [asyncActionName]);
                    this.modulesLoader.validatePluginType(moduleData, InterfaceDecorators_1.PluginType.Action);
                    logger_1.logger.debug(`Fetched action module: ${asyncActionName}`);
                    const configurationAccessor = yield (0, Utils_1.TypeAssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(engineEventContext, this.schemaLoader.getEventLevelConfig(event.entityName, event.eventName));
                    const [asyncActionInstance] = (yield this.instancesFactory.getModulesInstances(engineEventContext, configurationAccessor, [moduleData], engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`)));
                    logger_1.logger.debug(`Fetched async action module instance: ${asyncActionName}`);
                    const engineAction = new EngineAction_1.default(configurationAccessor, engineEventContext, `async action - ${asyncActionName}`, payload, engineEventContext.getJournalLogger(), (measurementName) => (0, Utils_1.AssertNotNull)(this.providersContext.metrics).getPoint(`plugins.${measurementName}`), false);
                    const queueAsAsync = asyncActionInstance.queueAsAsync
                        ? yield asyncActionInstance.queueAsAsync(engineAction)
                        : true;
                    if (queueAsAsync) {
                        logger_1.logger.info(`Preparing to queue Async action: ${asyncActionName}`);
                        const queuerInstance = yield this.instancesFactory.getActionQueuerInterfaceProvider((0, Utils_1.AssertNotNull)(this.engineContext), yield (0, Utils_1.AssertNotNull)(this.providersContext.configuration).getConfigurationAccessorInterface(undefined, undefined));
                        const timer = new PerformanceTimer_1.default().resume();
                        try {
                            engineEventContext.getJournalLogger().startQueueAsyncAction(asyncActionName, payload);
                            yield queuerInstance.queueAction({
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
                            (_b = this.metrics) === null || _b === void 0 ? void 0 : _b.queuedAction(event, asyncActionName, duration, true);
                            return undefined;
                        }
                        catch (e) {
                            const duration = timer.end();
                            (_c = this.metrics) === null || _c === void 0 ? void 0 : _c.queuedAction(event, asyncActionName, duration, false);
                            engineEventContext.getJournalLogger().endQueueAsyncAction(asyncActionName, duration, e);
                            throw new EngineCriticalError_1.default(`Failed to queue async action: ${String(e)}`);
                        }
                    }
                    else {
                        logger_1.logger.info(`Async action decided to not queue and instead execute immediately: ${asyncActionName}`);
                        const timer = new PerformanceTimer_1.default();
                        try {
                            engineEventContext.getJournalLogger().startDoAction(asyncActionName, payload);
                            timer.resume();
                            const response = yield asyncActionInstance.trigger(engineAction);
                            const duration = timer.end();
                            (_d = this.metrics) === null || _d === void 0 ? void 0 : _d.timeAction(event, asyncActionInstance.getModuleName(), duration, false);
                            engineEventContext.getJournalLogger().endDoAction(asyncActionName, response, duration);
                            return response;
                        }
                        catch (e) {
                            const duration = timer.end();
                            (_e = this.metrics) === null || _e === void 0 ? void 0 : _e.timeAction(event, asyncActionInstance.getModuleName(), duration, false);
                            engineEventContext.getJournalLogger().endDoAction(asyncActionName, undefined, duration, e);
                            throw e;
                        }
                    }
                });
            }
            static banner() {
                // banner, once
                console.log(colors_1.default.red(ascii_1.ascii));
                console.log(colors_1.default.yellow((0, figlet_1.textSync)('Gallifrey Rules', { horizontalLayout: 'full' })), os_1.EOL);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _handleAsyncActionEvent_decorators = [AssertInitialized];
            _handleScheduledEvent_decorators = [AssertInitialized];
            _handleEvent_decorators = [AssertInitialized];
            _getNamespace_decorators = [AssertInitialized];
            _reactToRuleFailure_decorators = [Decorators_1.DontThrowJustLog];
            _reactToEventFailure_decorators = [Decorators_1.DontThrowJustLog];
            _startConsumers_decorators = [AssertInitialized];
            __esDecorate(_a, null, _handleAsyncActionEvent_decorators, { kind: "method", name: "handleAsyncActionEvent", static: false, private: false, access: { has: obj => "handleAsyncActionEvent" in obj, get: obj => obj.handleAsyncActionEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _handleScheduledEvent_decorators, { kind: "method", name: "handleScheduledEvent", static: false, private: false, access: { has: obj => "handleScheduledEvent" in obj, get: obj => obj.handleScheduledEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _handleEvent_decorators, { kind: "method", name: "handleEvent", static: false, private: false, access: { has: obj => "handleEvent" in obj, get: obj => obj.handleEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getNamespace_decorators, { kind: "method", name: "getNamespace", static: false, private: false, access: { has: obj => "getNamespace" in obj, get: obj => obj.getNamespace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _reactToRuleFailure_decorators, { kind: "method", name: "reactToRuleFailure", static: false, private: false, access: { has: obj => "reactToRuleFailure" in obj, get: obj => obj.reactToRuleFailure }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _reactToEventFailure_decorators, { kind: "method", name: "reactToEventFailure", static: false, private: false, access: { has: obj => "reactToEventFailure" in obj, get: obj => obj.reactToEventFailure }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startConsumers_decorators, { kind: "method", name: "startConsumers", static: false, private: false, access: { has: obj => "startConsumers" in obj, get: obj => obj.startConsumers }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        (() => {
            _a.banner();
        })(),
        _a;
})();
exports.GallifreyRulesEngine = GallifreyRulesEngine;
function AssertInitialized(originalMethod, context) {
    const methodName = String(context.name);
    function replacement(...args) {
        if (!this.isInitialized()) {
            throw new EngineCriticalError_1.default(`GallifreyRulesEngine:${methodName} method called without engine being initialized.`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return originalMethod.apply(this, args);
    }
    return replacement;
}
