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
Object.defineProperty(exports, "__esModule", { value: true });
const Decorators_1 = require("./lib/Decorators");
let SafeJournalLoggerWrapper = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _customLog_decorators;
    let _endDoAction_decorators;
    let _endEvent_decorators;
    let _endPullDataObject_decorators;
    let _endRunRule_decorators;
    let _getModuleName_decorators;
    let _startDoAction_decorators;
    let _startEvent_decorators;
    let _startPullDataObject_decorators;
    let _startRunRule_decorators;
    let _dataObjectPulledFromEventStore_decorators;
    let _endFilter_decorators;
    let _startFilter_decorators;
    let _filterStoppedEvent_decorators;
    let _endQueueAsyncAction_decorators;
    let _startQueueAsyncAction_decorators;
    return _a = class SafeJournalLoggerWrapper {
            constructor(journalLogger) {
                this.journalLogger = (__runInitializers(this, _instanceExtraInitializers), journalLogger);
            }
            customLog(description, extra) {
                this.journalLogger.customLog(description, extra);
            }
            endDoAction(name, response, duration, error) {
                this.journalLogger.endDoAction(name, response, duration, error);
            }
            endEvent(duration, error) {
                this.journalLogger.endEvent(duration, error);
            }
            endPullDataObject(name, response, duration, error) {
                this.journalLogger.endPullDataObject(name, response, duration, error);
            }
            endRunRule(name, duration, error) {
                this.journalLogger.endRunRule(name, duration, error);
            }
            getModuleName() {
                return this.journalLogger.getModuleName();
            }
            startDoAction(name, payload) {
                this.journalLogger.startDoAction(name, payload);
            }
            startEvent(event) {
                this.journalLogger.startEvent(event);
            }
            startPullDataObject(name, request) {
                this.journalLogger.startPullDataObject(name, request);
            }
            startRunRule(name) {
                this.journalLogger.startRunRule(name);
            }
            dataObjectPulledFromEventStore(name, request) {
                this.journalLogger.dataObjectPulledFromEventStore(name, request);
            }
            endFilter(name, duration, error) {
                this.journalLogger.endFilter(name, duration, error);
            }
            startFilter(name) {
                this.journalLogger.startFilter(name);
            }
            filterStoppedEvent(name, duration) {
                return this.journalLogger.filterStoppedEvent(name, duration);
            }
            endQueueAsyncAction(name, duration, error) {
                return this.journalLogger.endQueueAsyncAction(name, duration, error);
            }
            startQueueAsyncAction(name, payload) {
                return this.journalLogger.startQueueAsyncAction(name, payload);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customLog_decorators = [Decorators_1.DontThrowJustLog];
            _endDoAction_decorators = [Decorators_1.DontThrowJustLog];
            _endEvent_decorators = [Decorators_1.DontThrowJustLog];
            _endPullDataObject_decorators = [Decorators_1.DontThrowJustLog];
            _endRunRule_decorators = [Decorators_1.DontThrowJustLog];
            _getModuleName_decorators = [Decorators_1.DontThrowJustLog];
            _startDoAction_decorators = [Decorators_1.DontThrowJustLog];
            _startEvent_decorators = [Decorators_1.DontThrowJustLog];
            _startPullDataObject_decorators = [Decorators_1.DontThrowJustLog];
            _startRunRule_decorators = [Decorators_1.DontThrowJustLog];
            _dataObjectPulledFromEventStore_decorators = [Decorators_1.DontThrowJustLog];
            _endFilter_decorators = [Decorators_1.DontThrowJustLog];
            _startFilter_decorators = [Decorators_1.DontThrowJustLog];
            _filterStoppedEvent_decorators = [Decorators_1.DontThrowJustLog];
            _endQueueAsyncAction_decorators = [Decorators_1.DontThrowJustLog];
            _startQueueAsyncAction_decorators = [Decorators_1.DontThrowJustLog];
            __esDecorate(_a, null, _customLog_decorators, { kind: "method", name: "customLog", static: false, private: false, access: { has: obj => "customLog" in obj, get: obj => obj.customLog }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endDoAction_decorators, { kind: "method", name: "endDoAction", static: false, private: false, access: { has: obj => "endDoAction" in obj, get: obj => obj.endDoAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endEvent_decorators, { kind: "method", name: "endEvent", static: false, private: false, access: { has: obj => "endEvent" in obj, get: obj => obj.endEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endPullDataObject_decorators, { kind: "method", name: "endPullDataObject", static: false, private: false, access: { has: obj => "endPullDataObject" in obj, get: obj => obj.endPullDataObject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endRunRule_decorators, { kind: "method", name: "endRunRule", static: false, private: false, access: { has: obj => "endRunRule" in obj, get: obj => obj.endRunRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getModuleName_decorators, { kind: "method", name: "getModuleName", static: false, private: false, access: { has: obj => "getModuleName" in obj, get: obj => obj.getModuleName }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startDoAction_decorators, { kind: "method", name: "startDoAction", static: false, private: false, access: { has: obj => "startDoAction" in obj, get: obj => obj.startDoAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startEvent_decorators, { kind: "method", name: "startEvent", static: false, private: false, access: { has: obj => "startEvent" in obj, get: obj => obj.startEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startPullDataObject_decorators, { kind: "method", name: "startPullDataObject", static: false, private: false, access: { has: obj => "startPullDataObject" in obj, get: obj => obj.startPullDataObject }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startRunRule_decorators, { kind: "method", name: "startRunRule", static: false, private: false, access: { has: obj => "startRunRule" in obj, get: obj => obj.startRunRule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _dataObjectPulledFromEventStore_decorators, { kind: "method", name: "dataObjectPulledFromEventStore", static: false, private: false, access: { has: obj => "dataObjectPulledFromEventStore" in obj, get: obj => obj.dataObjectPulledFromEventStore }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endFilter_decorators, { kind: "method", name: "endFilter", static: false, private: false, access: { has: obj => "endFilter" in obj, get: obj => obj.endFilter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startFilter_decorators, { kind: "method", name: "startFilter", static: false, private: false, access: { has: obj => "startFilter" in obj, get: obj => obj.startFilter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _filterStoppedEvent_decorators, { kind: "method", name: "filterStoppedEvent", static: false, private: false, access: { has: obj => "filterStoppedEvent" in obj, get: obj => obj.filterStoppedEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _endQueueAsyncAction_decorators, { kind: "method", name: "endQueueAsyncAction", static: false, private: false, access: { has: obj => "endQueueAsyncAction" in obj, get: obj => obj.endQueueAsyncAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _startQueueAsyncAction_decorators, { kind: "method", name: "startQueueAsyncAction", static: false, private: false, access: { has: obj => "startQueueAsyncAction" in obj, get: obj => obj.startQueueAsyncAction }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = SafeJournalLoggerWrapper;
