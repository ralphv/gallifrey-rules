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
exports.KafkaConsumer = void 0;
exports.IsTypeKafkaConsumerConfig = IsTypeKafkaConsumerConfig;
const kafkajs_1 = require("kafkajs");
const logger_1 = require("./lib/logger");
const Decorators_1 = require("./lib/Decorators");
const KafkaConsumerLagCalculator_1 = require("./KafkaConsumerLagCalculator");
const EngineCriticalError_1 = __importDefault(require("./errors/EngineCriticalError"));
const Config_1 = __importDefault(require("./lib/Config"));
const node_events_1 = __importDefault(require("node:events"));
const KafkaLog_1 = __importDefault(require("./KafkaLog"));
const BasicTypeGuards_1 = require("./BasicTypeGuards");
const DBConnectorScheduledEventType_1 = require("./engine-events/DBConnectorScheduledEventType");
const ScheduledEventType_1 = require("./engine-events/ScheduledEventType");
const os_1 = __importDefault(require("os"));
const KafkaActionQueuerProvider_1 = require("./modules/KafkaActionQueuerProvider");
let KafkaConsumer = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _stopConsumer_decorators;
    let _calculateLag_decorators;
    let _afterHandleEvent_decorators;
    return _a = class KafkaConsumer {
            constructor(name, clientId, brokers, engine) {
                this.name = (__runInitializers(this, _instanceExtraInitializers), name);
                this.clientId = clientId;
                this.brokers = brokers;
                this.engine = engine;
                this.emitter = new node_events_1.default();
                if (!brokers || !brokers.length) {
                    throw new EngineCriticalError_1.default(`Kafka brokers are missing`);
                }
                this.kafka = new kafkajs_1.Kafka({
                    clientId,
                    brokers,
                    logCreator: KafkaLog_1.default.getLogCreator(),
                });
                if (!engine.isInitialized()) {
                    throw new EngineCriticalError_1.default(`Engine passed to KafkaConsumer should be initialized`);
                }
                this.setupEmitter();
            }
            setAfterHandleEventDelegate(ref) {
                this.afterHandleEventDelegate = ref;
            }
            startConsumer(consumerConfig, consumerTransformer) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    if (this.consumer) {
                        throw new EngineCriticalError_1.default(`startConsumer is already called`);
                    }
                    (0, BasicTypeGuards_1.AssertTypeGuard)(IsTypeKafkaConsumerConfig, consumerConfig);
                    const { groupId, topics, fromBeginning } = consumerConfig;
                    const config = new Config_1.default();
                    const pushMetrics = config.getConsumerPushMetrics();
                    this.consumer = this.kafka.consumer({ groupId });
                    try {
                        logger_1.logger.debug(`consumer connect: ${this.name}`);
                        yield this.consumer.connect();
                        logger_1.logger.debug(`consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
                        yield this.consumer.subscribe({
                            topics: Array.isArray(topics) ? topics : [topics],
                            fromBeginning,
                        });
                        logger_1.logger.debug(`consumer: ${this.name} run`);
                        // consumer run will not block
                        yield this.consumer.run({
                            autoCommit: true,
                            autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                            autoCommitInterval: config.getAutoCommitInterval(),
                            eachMessage: (messagePayload) => __awaiter(this, void 0, void 0, function* () {
                                var _b;
                                try {
                                    // eslint-disable-next-line @typescript-eslint/unbound-method
                                    const { topic, partition, message, pause } = messagePayload;
                                    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    logger_1.logger.debug(`consumer ${this.name}: - ${prefix} ${message.key}#${message.value}`);
                                    if (pushMetrics) {
                                        void this.calculateLag(topic, partition, message.offset, groupId);
                                    }
                                    const event = consumerTransformer(message);
                                    yield this.engine.handleEvent(event, pause);
                                    this.afterHandleEvent(messagePayload, event);
                                }
                                catch (e) {
                                    logger_1.logger.error(`Unhandled Exception from HandleEvent: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                                    yield this.stopConsumer();
                                    throw e;
                                }
                            }),
                        });
                        logger_1.logger.info(`consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`);
                    }
                    catch (e) {
                        logger_1.logger.error(`An error has occurred while starting the consumer: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                        yield this.stopConsumer();
                        throw e;
                    }
                });
            }
            startScheduleEventConsumer(consumerConfig) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    if (this.consumer) {
                        throw new EngineCriticalError_1.default(`startConsumer is already called`);
                    }
                    (0, BasicTypeGuards_1.AssertTypeGuard)(IsTypeKafkaConsumerConfig, consumerConfig);
                    const { groupId, topics, fromBeginning } = consumerConfig;
                    const config = new Config_1.default();
                    const pushMetrics = config.getConsumerPushMetrics();
                    this.consumer = this.kafka.consumer({ groupId });
                    try {
                        logger_1.logger.debug(`consumer: ${this.name} connect`);
                        yield this.consumer.connect();
                        logger_1.logger.debug(`consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
                        yield this.consumer.subscribe({
                            topics: Array.isArray(topics) ? topics : [topics],
                            fromBeginning,
                        });
                        logger_1.logger.debug(`consumer: ${this.name} run`);
                        // consumer run will not block
                        yield this.consumer.run({
                            autoCommit: true,
                            autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                            autoCommitInterval: config.getAutoCommitInterval(),
                            eachMessage: (messagePayload) => __awaiter(this, void 0, void 0, function* () {
                                var _b;
                                try {
                                    // eslint-disable-next-line @typescript-eslint/unbound-method
                                    const { topic, partition, message, pause } = messagePayload;
                                    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    logger_1.logger.debug(`consumer: ${this.name} - ${prefix} ${message.key}#${message.value}`);
                                    if (pushMetrics) {
                                        void this.calculateLag(topic, partition, message.offset, groupId);
                                    }
                                    // message payload
                                    const payload = JSON.parse(String(message.value));
                                    (0, BasicTypeGuards_1.AssertTypeGuard)(DBConnectorScheduledEventType_1.IsTypeDBConnectorScheduledEventType, payload);
                                    const dbScheduledEvent = payload;
                                    const event = (0, ScheduledEventType_1.getScheduledEventTypeFromDBType)(dbScheduledEvent, os_1.default.hostname());
                                    yield this.engine.handleScheduledEvent(event, pause);
                                    this.afterHandleEvent(messagePayload, event);
                                }
                                catch (e) {
                                    logger_1.logger.error(`Unhandled Exception from HandleEvent: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                                    yield this.stopConsumer();
                                    throw e;
                                }
                            }),
                        });
                        logger_1.logger.info(`consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`);
                    }
                    catch (e) {
                        logger_1.logger.error(`An error has occurred while starting the consumer: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                        yield this.stopConsumer();
                        throw e;
                    }
                });
            }
            startAsyncActionsConsumer(consumerConfig) {
                return __awaiter(this, void 0, void 0, function* () {
                    var _b;
                    if (this.consumer) {
                        throw new EngineCriticalError_1.default(`startAsyncActionsConsumer is already called`);
                    }
                    (0, BasicTypeGuards_1.AssertTypeGuard)(IsTypeKafkaConsumerConfig, consumerConfig);
                    const { groupId, topics, fromBeginning } = consumerConfig;
                    const config = new Config_1.default();
                    const pushMetrics = config.getConsumerPushMetrics();
                    this.consumer = this.kafka.consumer({ groupId });
                    try {
                        logger_1.logger.debug(`async action consumer: ${this.name} connect`);
                        yield this.consumer.connect();
                        logger_1.logger.debug(`async action consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
                        yield this.consumer.subscribe({
                            topics: Array.isArray(topics) ? topics : [topics],
                            fromBeginning,
                        });
                        logger_1.logger.debug(`async action consumer: ${this.name} run`);
                        // consumer run will not block
                        yield this.consumer.run({
                            autoCommit: true,
                            autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                            autoCommitInterval: config.getAutoCommitInterval(),
                            eachMessage: (messagePayload) => __awaiter(this, void 0, void 0, function* () {
                                var _b;
                                try {
                                    // eslint-disable-next-line @typescript-eslint/unbound-method
                                    const { topic, partition, message, pause } = messagePayload;
                                    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    logger_1.logger.debug(`consumer: : ${this.name} - ${prefix} ${message.key}#${message.value}`);
                                    if (pushMetrics) {
                                        void this.calculateLag(topic, partition, message.offset, groupId);
                                    }
                                    // message payload
                                    const payload = JSON.parse(String(message.value));
                                    (0, BasicTypeGuards_1.AssertTypeGuard)(KafkaActionQueuerProvider_1.IsTypeKafkaActionQueuerMessageType, payload);
                                    const asyncActionEvent = payload;
                                    yield this.engine.handleAsyncActionEvent(asyncActionEvent, os_1.default.hostname(), pause);
                                }
                                catch (e) {
                                    logger_1.logger.error(`Unhandled Exception from HandleEvent: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                                    yield this.stopConsumer();
                                    throw e;
                                }
                            }),
                        });
                        logger_1.logger.info(`consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`);
                    }
                    catch (e) {
                        logger_1.logger.error(`An error has occurred while starting the consumer: ${String(e)} @${String((_b = e.stack) !== null && _b !== void 0 ? _b : '')}`);
                        yield this.stopConsumer();
                        throw e;
                    }
                });
            }
            stopConsumer() {
                return __awaiter(this, void 0, void 0, function* () {
                    this.emitter.emit(EMITTER_STOP, this);
                });
            }
            calculateLag(topic, partition, offset, groupId) {
                return __awaiter(this, void 0, void 0, function* () {
                    const offsets = yield KafkaConsumerLagCalculator_1.KafkaConsumerLagCalculator.fetchTopicOffsets(this.clientId, this.brokers, topic);
                    if (!offsets) {
                        return;
                    }
                    const offsetForPartition = offsets.find((offset) => offset.partition === partition);
                    if (!offsetForPartition) {
                        return;
                    }
                    const lag = parseInt(offsetForPartition.high) - parseInt(offset);
                    this.engine.publishPartitionLag(lag, partition, topic, groupId);
                });
            }
            afterHandleEvent(messagePayload, event) {
                this.emitter.emit(EMITTER_AFTER_HANDLE_EVENT, messagePayload, event);
            }
            setupEmitter() {
                this.emitter.on(EMITTER_AFTER_HANDLE_EVENT, (messagePayload, event) => {
                    if (this.afterHandleEventDelegate) {
                        void this.afterHandleEventDelegate(messagePayload, event);
                    }
                });
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                this.emitter.on(EMITTER_STOP, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.stopConsumerAndWait();
                }));
            }
            addOnStopOnce(fn) {
                this.emitter.once(EMITTER_STOP, fn);
            }
            stopConsumerAndWait() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.consumer) {
                        try {
                            logger_1.logger.info(`Disconnecting consumer: ${this.name}`);
                            const consumer = this.consumer;
                            this.consumer = undefined;
                            yield consumer.disconnect();
                            logger_1.logger.info(`Consumer disconnected: ${this.name}`);
                        }
                        catch (e) {
                            logger_1.logger.error(`Unhandled Exception stopping consumer: ${String(e)}`);
                        }
                    }
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _stopConsumer_decorators = [Decorators_1.DontThrowJustLog];
            _calculateLag_decorators = [Decorators_1.DontThrowJustLog];
            _afterHandleEvent_decorators = [Decorators_1.DontThrowJustLog];
            __esDecorate(_a, null, _stopConsumer_decorators, { kind: "method", name: "stopConsumer", static: false, private: false, access: { has: obj => "stopConsumer" in obj, get: obj => obj.stopConsumer }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _calculateLag_decorators, { kind: "method", name: "calculateLag", static: false, private: false, access: { has: obj => "calculateLag" in obj, get: obj => obj.calculateLag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _afterHandleEvent_decorators, { kind: "method", name: "afterHandleEvent", static: false, private: false, access: { has: obj => "afterHandleEvent" in obj, get: obj => obj.afterHandleEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.KafkaConsumer = KafkaConsumer;
const EMITTER_STOP = 'stop';
const EMITTER_AFTER_HANDLE_EVENT = 'afterHandleEvent';
function IsTypeKafkaConsumerConfig(value) {
    return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (0, BasicTypeGuards_1.IsString)(value.groupId) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ((0, BasicTypeGuards_1.IsString)(value.topics) || (0, BasicTypeGuards_1.IsArray)(value.topics, false, BasicTypeGuards_1.IsString)) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsBoolean)(value.fromBeginning) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsArray)(value.brokers, true, BasicTypeGuards_1.IsString) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsString)(value.clientId, true));
}
