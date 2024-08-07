"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InterfaceDecorators_1 = require("../interfaces/InterfaceDecorators");
const logger_1 = require("../lib/logger");
const Config_1 = __importDefault(require("../lib/Config"));
const ModuleNames_1 = require("../ModuleNames");
let ConsoleJournalLoggerProvider = (() => {
    let _classDecorators = [(0, InterfaceDecorators_1.GallifreyProvider)(InterfaceDecorators_1.ProviderType.JournalLogger)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConsoleJournalLoggerProvider = _classThis = class {
        constructor() {
            const config = new Config_1.default();
            this.addExtraToJournalLogs = config.getAddExtraToJournalLogs();
        }
        startEvent(event) {
            var _a;
            this.log = {
                entityName: event.entityName,
                eventName: event.eventName,
                eventId: event.eventId,
                payload: event.payload,
                source: event.source,
                eventLag: event.eventLag,
                logs: [],
            };
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting event '${event.eventName}'` });
        }
        customLog(description, extra) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description, extra: this.getExtra(extra) });
        }
        endDoAction(name, response, duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending action '${name}', error: '${String(error)}'`,
                    extra: this.getExtra(error),
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({
                    description: `ending action '${name}', duration: ${duration}`,
                    extra: this.getExtra(response),
                });
            }
        }
        endEvent(duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending event: '${String(error)}'`,
                    extra: this.getExtra(error),
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({ description: `ending event, duration: ${duration}` });
            }
            logger_1.logger.info(`JournalLog: ${JSON.stringify(this.log, null, 2)}`);
            this.log = undefined;
        }
        endPullDataObject(name, response, duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending data-object '${name}', error: '${String(error)}'`,
                    extra: this.getExtra(error),
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({
                    description: `ending data-object '${name}', duration: ${duration}`,
                    extra: this.getExtra(response),
                });
            }
        }
        endRunRule(name, duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending rule '${name}', error: '${String(error)}'`,
                    extra: this.getExtra(error),
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({ description: `ending rule '${name}', duration: ${duration}` });
            }
        }
        getModuleName() {
            return ModuleNames_1.ModuleNames.ConsoleJournalLogger;
        }
        startDoAction(name, payload) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting action '${name}'`, extra: this.getExtra(payload) });
        }
        startPullDataObject(name, request) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting data-object '${name}'`, extra: this.getExtra(request) });
        }
        startRunRule(name) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting rule '${name}'` });
        }
        getExtra(extra) {
            if (!this.addExtraToJournalLogs) {
                return undefined;
            }
            return extra;
        }
        dataObjectPulledFromEventStore(name, request) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                description: `data-object '${name}' result pulled from event store`,
                extra: this.getExtra(request),
            });
        }
        endFilter(name, duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending filter '${name}', error: '${String(error)}'`,
                    extra: this.getExtra(error),
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({ description: `ending filter '${name}', duration: ${duration}` });
            }
        }
        startFilter(name) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting filter '${name}'` });
        }
        filterStoppedEvent(name, duration) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `filter '${name}' stopped event, duration: ${duration}` });
        }
        endQueueAsyncAction(name, duration, error) {
            var _a, _b;
            if (error) {
                (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({
                    description: `Error ending queue async action '${name}', duration: ${duration}, error: ${String(error)}`,
                });
            }
            else {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.logs.push({ description: `ending queue async action '${name}', duration: ${duration}` });
            }
        }
        startQueueAsyncAction(name, payload) {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.logs.push({ description: `starting queue async action '${name}'`, extra: this.getExtra(payload) });
        }
    };
    __setFunctionName(_classThis, "ConsoleJournalLoggerProvider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConsoleJournalLoggerProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConsoleJournalLoggerProvider = _classThis;
})();
exports.default = ConsoleJournalLoggerProvider;
