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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metrics = void 0;
/**
 * author: Ralph Varjabedian
 */
const Decorators_1 = require("./Decorators");
let Metrics = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _getPoint_decorators;
    let _engineInitialized_decorators;
    let _handleEvent_decorators;
    let _publishPartitionLag_decorators;
    let _timeEvent_decorators;
    let _timeRule_decorators;
    let _timeAction_decorators;
    let _timeDataObject_decorators;
    let _timeFilter_decorators;
    let _timeAcquireLock_decorators;
    let _timeReleaseLock_decorators;
    let _countErrors_decorators;
    let _queuedAction_decorators;
    let _timeIt_decorators;
    return _a = class Metrics {
            constructor(metricsProvider) {
                this.metricsProvider = (__runInitializers(this, _instanceExtraInitializers), metricsProvider);
            }
            getPoint(measurementName, event) {
                const point = this.metricsProvider.getPoint(measurementName);
                return point
                    .tag('namespace', event.namespace)
                    .tag('entity', event.entityName)
                    .tag('event', event.eventName)
                    .tag('source', event.source);
            }
            engineInitialized(namespace) {
                const point = this.metricsProvider.getPoint('engine_initialized');
                point.intField('count', 1);
                point.tag('namespace', namespace);
                void point.submit();
            }
            handleEvent(event) {
                const point = this.getPoint('handle_event', event);
                point.intField('count', 1).floatField('lag', event.eventLag);
                void point.submit();
            }
            flush() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.metricsProvider.flush();
                });
            }
            publishPartitionLag(namespace, lag, partition, topic, group) {
                const point = this.metricsProvider.getPoint('consumer_partition_lags');
                point.uintField('lag', lag);
                point.tag('namespace', namespace);
                point.tag('partition', String(partition));
                point.tag('topic', topic);
                point.tag('group', group);
                void point.submit();
            }
            timeModule(event, name, timerInMs, measurement, moduleTagType) {
                const point = this.getPoint(measurement, event);
                point.floatField('timerMs', timerInMs);
                if (moduleTagType) {
                    point.tag(moduleTagType, name);
                }
                void point.submit();
            }
            timeEvent(event, timerInMs) {
                this.timeModule(event, '', timerInMs, 'event_timer');
            }
            timeRule(event, name, timerInMs) {
                this.timeModule(event, name, timerInMs, 'rule_timer', 'rule');
            }
            timeAction(event, name, timerInMs, triggeredAsAsync) {
                this.timeModule(event, name, timerInMs, triggeredAsAsync ? 'async_action_timer' : 'action_timer', 'action');
            }
            timeDataObject(event, name, timerInMs) {
                this.timeModule(event, name, timerInMs, 'data_object_timer', 'data_object');
            }
            timeFilter(event, name, timerInMs) {
                this.timeModule(event, name, timerInMs, 'filter_timer', 'filter');
            }
            timeAcquireLock(event, timerInMs, acquiredSuccess) {
                const point = this.getPoint('acquire_lock_timer', event);
                point.floatField('timerMs', timerInMs);
                point.uintField('success', acquiredSuccess ? 1 : 0);
                void point.submit();
            }
            timeReleaseLock(event, timerInMs, acquiredSuccess) {
                const point = this.getPoint('release_lock_timer', event);
                point.floatField('timerMs', timerInMs);
                point.uintField('success', acquiredSuccess ? 1 : 0);
                void point.submit();
            }
            countErrors(event) {
                const point = this.getPoint('errors', event);
                point.uintField('count', 1);
                void point.submit();
            }
            queuedAction(event, actionName, timerInMs, queuedSuccess) {
                const point = this.getPoint('queued_actions', event);
                point.tag('action', actionName);
                point.uintField('count', 1);
                point.floatField('timerMs', timerInMs);
                point.uintField('success', queuedSuccess ? 1 : 0);
                void point.submit();
            }
            timeIt(className, methodName, timerInMs) {
                const point = this.metricsProvider.getPoint('time_it');
                point.floatField('timerMs', timerInMs);
                point.tag('class', className);
                point.tag('method', methodName);
                void point.submit();
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getPoint_decorators = [Decorators_1.DontThrowJustLog];
            _engineInitialized_decorators = [Decorators_1.DontThrowJustLog];
            _handleEvent_decorators = [Decorators_1.DontThrowJustLog];
            _publishPartitionLag_decorators = [Decorators_1.DontThrowJustLog];
            _timeEvent_decorators = [Decorators_1.DontThrowJustLog];
            _timeRule_decorators = [Decorators_1.DontThrowJustLog];
            _timeAction_decorators = [Decorators_1.DontThrowJustLog];
            _timeDataObject_decorators = [Decorators_1.DontThrowJustLog];
            _timeFilter_decorators = [Decorators_1.DontThrowJustLog];
            _timeAcquireLock_decorators = [Decorators_1.DontThrowJustLog];
            _timeReleaseLock_decorators = [Decorators_1.DontThrowJustLog];
            _countErrors_decorators = [Decorators_1.DontThrowJustLog];
            _queuedAction_decorators = [Decorators_1.DontThrowJustLog];
            _timeIt_decorators = [Decorators_1.DontThrowJustLog];
            __esDecorate(_a, null, _getPoint_decorators, { kind: "method", name: "getPoint", static: false, private: false, access: { has: obj => "getPoint" in obj, get: obj => obj.getPoint }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _engineInitialized_decorators, { kind: "method", name: "engineInitialized", static: false, private: false, access: { has: obj => "engineInitialized" in obj, get: obj => obj.engineInitialized }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _handleEvent_decorators, { kind: "method", name: "handleEvent", static: false, private: false, access: { has: obj => "handleEvent" in obj, get: obj => obj.handleEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _publishPartitionLag_decorators, { kind: "method", name: "publishPartitionLag", static: false, private: false, access: { has: obj => "publishPartitionLag" in obj, get: obj => obj.publishPartitionLag }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeEvent_decorators, { kind: "method", name: "timeEvent", static: false, private: false, access: { has: obj => "timeEvent" in obj, get: obj => obj.timeEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeRule_decorators, { kind: "method", name: "timeRule", static: false, private: false, access: { has: obj => "timeRule" in obj, get: obj => obj.timeRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeAction_decorators, { kind: "method", name: "timeAction", static: false, private: false, access: { has: obj => "timeAction" in obj, get: obj => obj.timeAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeDataObject_decorators, { kind: "method", name: "timeDataObject", static: false, private: false, access: { has: obj => "timeDataObject" in obj, get: obj => obj.timeDataObject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeFilter_decorators, { kind: "method", name: "timeFilter", static: false, private: false, access: { has: obj => "timeFilter" in obj, get: obj => obj.timeFilter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeAcquireLock_decorators, { kind: "method", name: "timeAcquireLock", static: false, private: false, access: { has: obj => "timeAcquireLock" in obj, get: obj => obj.timeAcquireLock }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeReleaseLock_decorators, { kind: "method", name: "timeReleaseLock", static: false, private: false, access: { has: obj => "timeReleaseLock" in obj, get: obj => obj.timeReleaseLock }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _countErrors_decorators, { kind: "method", name: "countErrors", static: false, private: false, access: { has: obj => "countErrors" in obj, get: obj => obj.countErrors }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _queuedAction_decorators, { kind: "method", name: "queuedAction", static: false, private: false, access: { has: obj => "queuedAction" in obj, get: obj => obj.queuedAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _timeIt_decorators, { kind: "method", name: "timeIt", static: false, private: false, access: { has: obj => "timeIt" in obj, get: obj => obj.timeIt }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.Metrics = Metrics;
