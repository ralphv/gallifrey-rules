"use strict";
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
const InterfaceDecorators_1 = require("../interfaces/InterfaceDecorators");
const logger_1 = require("./logger");
const EngineBase_1 = __importDefault(require("./EngineBase"));
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
class InstancesFactory {
    constructor(schemaLoader, modulesLoader) {
        this.schemaLoader = schemaLoader;
        this.modulesLoader = modulesLoader;
    }
    getProvider(engineContext, configurationAccessor, providerName, providerType, providerDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = this.getProviderInstance(providerName, providerType, providerDescription);
            logger_1.logger.info(`Initializing provider: ${providerDescription}`);
            if (instance.initialize) {
                const engineBase = new EngineBase_1.default(engineContext, undefined, configurationAccessor, `provider - ${instance.getModuleName()}`, undefined, undefined);
                yield instance.initialize(engineBase);
            }
            return instance;
        });
    }
    getProviderInstance(providerName, providerType, providerDescription) {
        logger_1.logger.info(`Requesting provider instance: ${providerDescription}`);
        // check if we have specs inside the schema first, if not we will check if they have
        if (!providerName) {
            const providers = this.modulesLoader.getModules().filter((a) => a.providerType === providerType);
            if (providers.length === 1) {
                logger_1.logger.info(`Provider ${providerDescription} has a single module: ${providers[0].name}, using that.`);
                return new providers[0].classRef();
            }
            const defaultProviders = this.modulesLoader
                .getModules()
                .filter((a) => a.providerType === providerType && a.isDefaultProvider);
            if (defaultProviders.length === 1) {
                logger_1.logger.info(`Provider ${providerDescription} has a default module: ${providers[0].name}, using that.`);
                return new providers[0].classRef();
            }
            throw new EngineCriticalError_1.default(`${providerDescription} provider is missing from schema, doesn't have a single provider loaded, nor a default provider`);
        }
        else {
            const providers = this.modulesLoader
                .getModules()
                .filter((a) => a.providerType === providerType && a.name === providerName);
            if (providers.length === 1) {
                logger_1.logger.info(`Create provider ${providerDescription} instance: ${providers[0].name}`);
                return new providers[0].classRef();
            }
            throw new EngineCriticalError_1.default(`${providerDescription} provider specified "${providerName}" is not found.`);
        }
    }
    getConfigurationInterfaceProvider(context) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, undefined, this.schemaLoader.getConfigurationInterfaceProvider(), InterfaceDecorators_1.ProviderType.Configuration, `Configuration`));
        });
    }
    getJournalLoggerInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getJournalLoggerInterfaceProvider(), InterfaceDecorators_1.ProviderType.JournalLogger, `JournalLogger`));
        });
    }
    getLoggerInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getLoggerInterfaceProvider(), InterfaceDecorators_1.ProviderType.Logger, `Logger`));
        });
    }
    getReactToFailureInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getReactToFailureInterfaceProvider(), InterfaceDecorators_1.ProviderType.ReactToFailure, `ReactToFailure`));
        });
    }
    getMetricsInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getMetricsInterfaceProvider(), InterfaceDecorators_1.ProviderType.Metrics, `Metrics`));
        });
    }
    getModulesInstances(engineContext, configurationAccessor, modules, journalLogger, getMetricsPointDelegate) {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = modules.map((module) => {
                return new module.classRef();
            });
            yield Promise.all(instances.map((instance) => {
                const engineBase = new EngineBase_1.default(engineContext, undefined, configurationAccessor, `initialize - ${instance.getModuleName()}`, journalLogger, getMetricsPointDelegate);
                return instance.initialize ? instance.initialize(engineBase) : Promise.resolve();
            }));
            return instances;
        });
    }
    getEventDispatcherProvider(eventDispatcher) {
        return this.getProviderInstance(eventDispatcher, InterfaceDecorators_1.ProviderType.EventDispatcher, 'EventDispatcher');
    }
    getScheduledEventsInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getScheduledEventsInterfaceProvider(), InterfaceDecorators_1.ProviderType.ScheduledEvents, `ScheduledEvents`));
        });
    }
    getDistributedLocksInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getDistributedLocksInterfaceProvider(), InterfaceDecorators_1.ProviderType.DistributedLocks, `DistributedLocks`));
        });
    }
    getActionQueuerInterfaceProvider(context, configurationAccessor) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getProvider(context, configurationAccessor, this.schemaLoader.getActionQueuerInterfaceProvider(), InterfaceDecorators_1.ProviderType.ActionQueuer, `ActionQueuer`));
        });
    }
}
exports.default = InstancesFactory;
