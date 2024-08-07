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
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const promises_1 = require("node:fs/promises");
const json_schema_library_1 = require("json-schema-library");
const namespace_schema_json_1 = __importDefault(require("../schemas/namespace-schema.json"));
const logger_1 = require("./logger");
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
let SchemaLoader = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _getModulesPath_decorators;
    let _getNamespace_decorators;
    let _getCompatibleNamespaces_decorators;
    let _getActionQueuerInterfaceProvider_decorators;
    let _getActiveEventsReferenceCounterInterfaceProvider_decorators;
    let _getConfigurationInterfaceProvider_decorators;
    let _getJournalLoggerInterfaceProvider_decorators;
    let _getLoggerInterfaceProvider_decorators;
    let _getMetricsInterfaceProvider_decorators;
    let _getReactToFailureInterfaceProvider_decorators;
    let _getScheduledEventsInterfaceProvider_decorators;
    let _getDistributedLocksInterfaceProvider_decorators;
    let _getRulesForEvent_decorators;
    let _getFiltersForEvent_decorators;
    let _getConsumers_decorators;
    return _a = class SchemaLoader {
            constructor() {
                this.schema = __runInitializers(this, _instanceExtraInitializers);
            }
            loadSchemaFromFile(namespaceSchemaFile) {
                return __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.info(`Loading schema from file: ${namespaceSchemaFile}.`);
                    const buffer = yield (0, promises_1.readFile)(namespaceSchemaFile);
                    return this.loadSchema(String(buffer));
                });
            }
            loadSchema(schema) {
                return __awaiter(this, void 0, void 0, function* () {
                    logger_1.logger.info(`Loading schema.`);
                    this.schema = undefined;
                    if (typeof schema === 'string') {
                        schema = JSON.parse(schema);
                    }
                    // validate schema
                    const jsonSchema = new json_schema_library_1.Draft07(namespace_schema_json_1.default);
                    const errors = jsonSchema.validate(schema);
                    if (errors.length !== 0) {
                        throw new EngineCriticalError_1.default(`Invalid namespace schema: ${JSON.stringify(errors, null, 2)}`);
                    }
                    this.schema = schema;
                    logger_1.logger.info(`Schema is loaded for namespace ${this.schema.$namespace}`);
                });
            }
            unload() {
                this.schema = undefined;
            }
            isLoaded() {
                return this.schema !== undefined;
            }
            getModulesPath() {
                var _b, _c;
                return (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$modulesPaths) !== null && _c !== void 0 ? _c : [];
            }
            getNamespace() {
                var _b;
                return (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$namespace;
            }
            getCompatibleNamespaces() {
                var _b, _c;
                const namespaces = [];
                if (this.getNamespace()) {
                    namespaces.push(this.getNamespace());
                }
                return [...namespaces, ...((_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$namespaceAliases) !== null && _c !== void 0 ? _c : [])];
            }
            getActionQueuerInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.actionQueuer) !== null && _d !== void 0 ? _d : null;
            }
            getActiveEventsReferenceCounterInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.activeEventsReferenceCounter) !== null && _d !== void 0 ? _d : null;
            }
            getConfigurationInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.configuration) !== null && _d !== void 0 ? _d : null;
            }
            getJournalLoggerInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.journalLogger) !== null && _d !== void 0 ? _d : null;
            }
            getLoggerInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.logger) !== null && _d !== void 0 ? _d : null;
            }
            getMetricsInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.metrics) !== null && _d !== void 0 ? _d : null;
            }
            getReactToFailureInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.reactToFailure) !== null && _d !== void 0 ? _d : null;
            }
            getScheduledEventsInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.scheduledEvents) !== null && _d !== void 0 ? _d : null;
            }
            getDistributedLocksInterfaceProvider() {
                var _b, _c, _d;
                return (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$providers) === null || _c === void 0 ? void 0 : _c.distributedLocks) !== null && _d !== void 0 ? _d : null;
            }
            getRulesForEvent(namespace, entityName, eventName) {
                var _b, _c, _d, _e, _f;
                // @ts-expect-error expected
                return (_f = (_e = (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$entities) === null || _c === void 0 ? void 0 : _c[entityName]) === null || _d === void 0 ? void 0 : _d[eventName]) === null || _e === void 0 ? void 0 : _e.$rules) !== null && _f !== void 0 ? _f : [];
            }
            getFiltersForEvent(namespace, entityName, eventName) {
                var _b, _c, _d, _e, _f;
                // @ts-expect-error expected
                return (_f = (_e = (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$entities) === null || _c === void 0 ? void 0 : _c[entityName]) === null || _d === void 0 ? void 0 : _d[eventName]) === null || _e === void 0 ? void 0 : _e.$filters) !== null && _f !== void 0 ? _f : [];
            }
            getConsumers() {
                var _b, _c;
                return (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$consumers) !== null && _c !== void 0 ? _c : [];
            }
            getEventLevelConfig(entityName, eventName) {
                return this.getEventLevelKeyObject(entityName, eventName, '$config');
            }
            getEventLevelSchemaFile(entityName, eventName) {
                return this.getEventLevelKeyValue(entityName, eventName, '$schemaFile');
            }
            getEventLevelKeyObject(entityName, eventName, key) {
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                const objects = []; // lowest level/highest priority first.
                objects.push((_e = (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$entities) === null || _c === void 0 ? void 0 : _c[entityName]) === null || _d === void 0 ? void 0 : _d[eventName]) === null || _e === void 0 ? void 0 : _e[key]);
                objects.push((_h = (_g = (_f = this.schema) === null || _f === void 0 ? void 0 : _f.$entities) === null || _g === void 0 ? void 0 : _g[entityName]) === null || _h === void 0 ? void 0 : _h[key]);
                objects.push((_k = (_j = this.schema) === null || _j === void 0 ? void 0 : _j.$entities) === null || _k === void 0 ? void 0 : _k[key]);
                objects.push((_l = this.schema) === null || _l === void 0 ? void 0 : _l[key]);
                return objects
                    .filter((a) => a !== undefined)
                    .reduce(($current, compiled) => (Object.assign(Object.assign({}, compiled), $current)), {});
            }
            getEventLevelKeyValue(entityName, eventName, key) {
                var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                const values = []; // lowest level/highest priority first.
                values.push((_e = (_d = (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$entities) === null || _c === void 0 ? void 0 : _c[entityName]) === null || _d === void 0 ? void 0 : _d[eventName]) === null || _e === void 0 ? void 0 : _e[key]);
                values.push((_h = (_g = (_f = this.schema) === null || _f === void 0 ? void 0 : _f.$entities) === null || _g === void 0 ? void 0 : _g[entityName]) === null || _h === void 0 ? void 0 : _h[key]);
                values.push((_k = (_j = this.schema) === null || _j === void 0 ? void 0 : _j.$entities) === null || _k === void 0 ? void 0 : _k[key]);
                values.push((_l = this.schema) === null || _l === void 0 ? void 0 : _l[key]);
                // pick the first value in the array, it's the highest priority
                return (_m = values.filter((a) => a !== undefined)[0]) !== null && _m !== void 0 ? _m : undefined;
            }
            getAsyncActions() {
                var _b, _c;
                return (_c = (_b = this.schema) === null || _b === void 0 ? void 0 : _b.$asyncActions) !== null && _c !== void 0 ? _c : [];
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getModulesPath_decorators = [AssertSchemaLoaded];
            _getNamespace_decorators = [AssertSchemaLoaded];
            _getCompatibleNamespaces_decorators = [AssertSchemaLoaded];
            _getActionQueuerInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getActiveEventsReferenceCounterInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getConfigurationInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getJournalLoggerInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getLoggerInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getMetricsInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getReactToFailureInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getScheduledEventsInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getDistributedLocksInterfaceProvider_decorators = [AssertSchemaLoaded];
            _getRulesForEvent_decorators = [AssertSchemaLoaded];
            _getFiltersForEvent_decorators = [AssertSchemaLoaded];
            _getConsumers_decorators = [AssertSchemaLoaded];
            __esDecorate(_a, null, _getModulesPath_decorators, { kind: "method", name: "getModulesPath", static: false, private: false, access: { has: obj => "getModulesPath" in obj, get: obj => obj.getModulesPath }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getNamespace_decorators, { kind: "method", name: "getNamespace", static: false, private: false, access: { has: obj => "getNamespace" in obj, get: obj => obj.getNamespace }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCompatibleNamespaces_decorators, { kind: "method", name: "getCompatibleNamespaces", static: false, private: false, access: { has: obj => "getCompatibleNamespaces" in obj, get: obj => obj.getCompatibleNamespaces }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getActionQueuerInterfaceProvider_decorators, { kind: "method", name: "getActionQueuerInterfaceProvider", static: false, private: false, access: { has: obj => "getActionQueuerInterfaceProvider" in obj, get: obj => obj.getActionQueuerInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getActiveEventsReferenceCounterInterfaceProvider_decorators, { kind: "method", name: "getActiveEventsReferenceCounterInterfaceProvider", static: false, private: false, access: { has: obj => "getActiveEventsReferenceCounterInterfaceProvider" in obj, get: obj => obj.getActiveEventsReferenceCounterInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getConfigurationInterfaceProvider_decorators, { kind: "method", name: "getConfigurationInterfaceProvider", static: false, private: false, access: { has: obj => "getConfigurationInterfaceProvider" in obj, get: obj => obj.getConfigurationInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getJournalLoggerInterfaceProvider_decorators, { kind: "method", name: "getJournalLoggerInterfaceProvider", static: false, private: false, access: { has: obj => "getJournalLoggerInterfaceProvider" in obj, get: obj => obj.getJournalLoggerInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getLoggerInterfaceProvider_decorators, { kind: "method", name: "getLoggerInterfaceProvider", static: false, private: false, access: { has: obj => "getLoggerInterfaceProvider" in obj, get: obj => obj.getLoggerInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getMetricsInterfaceProvider_decorators, { kind: "method", name: "getMetricsInterfaceProvider", static: false, private: false, access: { has: obj => "getMetricsInterfaceProvider" in obj, get: obj => obj.getMetricsInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getReactToFailureInterfaceProvider_decorators, { kind: "method", name: "getReactToFailureInterfaceProvider", static: false, private: false, access: { has: obj => "getReactToFailureInterfaceProvider" in obj, get: obj => obj.getReactToFailureInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getScheduledEventsInterfaceProvider_decorators, { kind: "method", name: "getScheduledEventsInterfaceProvider", static: false, private: false, access: { has: obj => "getScheduledEventsInterfaceProvider" in obj, get: obj => obj.getScheduledEventsInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDistributedLocksInterfaceProvider_decorators, { kind: "method", name: "getDistributedLocksInterfaceProvider", static: false, private: false, access: { has: obj => "getDistributedLocksInterfaceProvider" in obj, get: obj => obj.getDistributedLocksInterfaceProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRulesForEvent_decorators, { kind: "method", name: "getRulesForEvent", static: false, private: false, access: { has: obj => "getRulesForEvent" in obj, get: obj => obj.getRulesForEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getFiltersForEvent_decorators, { kind: "method", name: "getFiltersForEvent", static: false, private: false, access: { has: obj => "getFiltersForEvent" in obj, get: obj => obj.getFiltersForEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getConsumers_decorators, { kind: "method", name: "getConsumers", static: false, private: false, access: { has: obj => "getConsumers" in obj, get: obj => obj.getConsumers }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = SchemaLoader;
function AssertSchemaLoaded(originalMethod, context) {
    const methodName = String(context.name);
    function replacement(...args) {
        if (!this.isLoaded()) {
            throw new EngineCriticalError_1.default(`SchemaLoader${methodName} method called without a loaded schema.`);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return originalMethod.apply(this, args);
    }
    return replacement;
}
