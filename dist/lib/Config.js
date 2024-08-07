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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConfig_1 = __importDefault(require("./BaseConfig"));
const CoreDecorators_1 = require("./CoreDecorators");
let Config = (() => {
    var _a;
    let _classSuper = BaseConfig_1.default;
    let _instanceExtraInitializers = [];
    let _getModuleNamePattern_decorators;
    return _a = class Config extends _classSuper {
            getLogLevel() {
                return this.getEnvVariable(`GF_LOG_LEVEL`, 'info', false);
            }
            throwOnNotModule() {
                return this.getBoolEnvVariable('GF_THROW_ON_NOT_MODULE', false, false);
            }
            getExtensionsOfModules() {
                return this.getArrayEnvVariable('GF_EXTENSIONS_OF_MODULES', ['.ts', '.js'], false);
            }
            skipExtensionsOfModules() {
                return this.getArrayEnvVariable('GF_SKIP_EXTENSIONS_OF_MODULES', ['.d.ts'], false);
            }
            getModulesPaths() {
                return this.getArrayEnvVariable('GF_MODULES_PATHS', [], false);
            }
            getModuleNamePattern() {
                return this.getEnvVariable('GF_MODULE_NAME_PATTERN', '^[a-z]+(-[a-z0-9]+)*$', false);
            }
            getInfluxDBToken() {
                return this.getSecretEnvVariable('GF_INFLUXDB_TOKEN', '', false);
            }
            getInfluxDBOrg() {
                return this.getEnvVariable('GF_INFLUXDB_ORG', 'sample_organization', false);
            }
            getInfluxDBBucket() {
                return this.getEnvVariable('GF_INFLUXDB_BUCKET', 'sample_bucket', false);
            }
            getInfluxURL() {
                return this.getEnvVariable('GF_INFLUXDB_URL', '', false);
            }
            throwOnEventUnhandledException() {
                return this.getBoolEnvVariable('GF_THROW_ON_EVENT_UNHANDLED_EXCEPTION', true, false);
            }
            dontThrowOnCriticalError() {
                return this.getBoolEnvVariable('GF_THROW_ON_CRITICAL_ERROR', true, false);
            }
            getConsumerPushMetrics() {
                return this.getBoolEnvVariable('GF_ENABLE_CONSUMER_METRICS', true, false);
            }
            getAutoCommitThreshold() {
                return this.getNumberEnvVariable(`GF_AUTO_COMMIT_THRESHOLD`, 1, false);
            }
            getAutoCommitInterval() {
                return this.getNumberEnvVariable(`GF_AUTO_COMMIT_INTERVAL`, 5000, false);
            }
            getAddExtraToJournalLogs() {
                return this.getBoolEnvVariable(`GF_ADD_EXTRA_TO_CONSOLE_JOURNAL_LOGS`, false, false);
            }
            getFailEventOnSingleRuleFail() {
                return this.getBoolEnvVariable(`GF_FAIL_EVENT_ON_SINGLE_RULE_FAIL`, true, false);
            }
            getPluginClassNamesForcePostfix() {
                return this.getBoolEnvVariable(`GF_PLUGIN_CLASS_NAMES_FORCE_POSTFIX`, true, false);
            }
            getPluginModuleNamesForcePostfix() {
                return this.getBoolEnvVariable(`GF_PLUGIN_MODULE_NAMES_FORCE_POSTFIX`, true, false);
            }
            getKafkaClientID() {
                return this.getEnvVariable('GF_KAFKA_CLIENT_ID', 'gallifrey-rules', false);
            }
            getKafkaBrokers() {
                return this.getArrayEnvVariable('GF_KAFKA_BROKERS', [], false);
            }
            getDBUser(throwOnEmpty = false) {
                return this.getEnvVariable([`GF_DB_USERNAME`, 'POSTGRES_USERNAME'], '', throwOnEmpty);
            }
            getDBHost(throwOnEmpty = false) {
                return this.getEnvVariable([`GF_DB_HOSTNAME`, 'POSTGRES_HOST'], '', throwOnEmpty);
            }
            getDBName(throwOnEmpty = false) {
                return this.getEnvVariable([`GF_DB_NAME`, 'POSTGRES_DB'], '', throwOnEmpty);
            }
            getDBPasswordSecret(throwOnEmpty = false) {
                return this.getSecretEnvVariable([`GF_DB_PASSWORD`, 'POSTGRES_PASSWORD'], '', throwOnEmpty);
            }
            getDBPort() {
                return this.getNumberEnvVariable([`GF_DB_PORT`, 'POSTGRES_PORT'], 5432, false);
            }
            isDistributedLocksEnabled() {
                return this.getBoolEnvVariable(`GF_IS_DISTRIBUTED_LOCKS_ENABLED`, false, false);
            }
            getDistributedLocksMaxWaitTimeInSeconds() {
                // for kafka: 1 minutes, should be > max.poll.interval.ms which is typically 5 minutes
                return this.getNumberEnvVariable(`GF_DISTRIBUTED_LOCKS_MAX_WAIT_TIME_SECONDS`, 60, false);
            }
            isContinueOnFailedAcquireLock() {
                return this.getBoolEnvVariable(`GF_IS_CONTINUE_ON_FAILED_ACQUIRE_LOCK`, false, false);
            }
            isSchemaFileMandatory() {
                // mandatory only when production
                return this.getBoolEnvVariable(`GF_IS_SCHEMA_FILE_MANDATORY`, this.isProduction(), false);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _getModuleNamePattern_decorators = [CoreDecorators_1.Cache];
            __esDecorate(_a, null, _getModuleNamePattern_decorators, { kind: "method", name: "getModuleNamePattern", static: false, private: false, access: { has: obj => "getModuleNamePattern" in obj, get: obj => obj.getModuleNamePattern }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = Config;
