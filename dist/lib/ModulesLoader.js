"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.ModuleData = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const InterfaceDecorators_1 = require("../interfaces/InterfaceDecorators");
const logger_1 = require("./logger");
const Config_1 = __importDefault(require("./Config"));
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
const InterfaceMethodNames_1 = require("./InterfaceMethodNames");
class ModuleData {
    constructor(className, classRef, name, file, namespaces, pluginType, providerType, isDefaultProvider, tags) {
        this.className = className;
        this.classRef = classRef;
        this.name = name;
        this.file = file;
        this.namespaces = namespaces;
        this.pluginType = pluginType;
        this.providerType = providerType;
        this.isDefaultProvider = isDefaultProvider;
        this.tags = tags;
    }
    isNamespaceCompatible(namespace) {
        if (this.namespaces.length === 0) {
            return true;
        }
        return this.namespaces.filter((n) => namespace === n).length !== 0;
    }
}
exports.ModuleData = ModuleData;
class ModulesLoader {
    constructor() {
        this.modules = [];
        this.moduleNames = {};
        this.config = new Config_1.default();
    }
    loadModulesFromPath(directory) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info(`Loading modules from path: ${directory}`);
            if (directory === '$') {
                // use internal path
                directory = path.resolve(__dirname, '..', 'modules');
            }
            const files = yield this.getListOfFiles(directory, this.config.getExtensionsOfModules(), this.config.skipExtensionsOfModules());
            yield Promise.all(files.map((file) => this.loadModule(file)));
        });
    }
    getListOfFiles(directory, extensions, skipExtensions) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            const list = yield fs.promises.readdir(directory, { withFileTypes: true });
            for (const file of list) {
                const filePath = path.resolve(directory, file.name);
                if (file.isDirectory()) {
                    const res = yield this.getListOfFiles(filePath, extensions, skipExtensions);
                    results = results.concat(res);
                }
                else {
                    if (extensions.some((extension) => filePath.endsWith(extension)) &&
                        !skipExtensions.some((skipExtension) => filePath.endsWith(skipExtension))) {
                        results.push(filePath);
                    }
                }
            }
            return results;
        });
    }
    loadModule(file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const module = yield Promise.resolve(`${file}`).then(s => __importStar(require(s)));
            const ModuleClass = module.default;
            const config = new Config_1.default();
            if (!ModuleClass) {
                throw new EngineCriticalError_1.default(`No default export found in module ${file}`);
            }
            const { pluginType, className: pluginClassName } = (0, InterfaceDecorators_1.getGallifreyPluginType)(ModuleClass);
            const { providerType, isDefault, className: providerClassName } = (0, InterfaceDecorators_1.getGallifreyProviderType)(ModuleClass);
            const tags = (0, InterfaceDecorators_1.getGallifreyTags)(ModuleClass);
            if (pluginType === undefined && providerType === undefined) {
                if (config.throwOnNotModule()) {
                    throw new EngineCriticalError_1.default(`default export found in module ${file} is not decorated as a plugin/provider. Did you forget to use @GallifreyPlugin or @GallifreyProvider?`);
                }
                logger_1.logger.warn(`default export found in module ${file} is not decorated as a plugin/provider. Did you forget to use @GallifreyPlugin or @GallifreyProvider?`);
                return;
            }
            const instance = new ModuleClass();
            const name = instance.getModuleName();
            if (!name) {
                throw new EngineCriticalError_1.default(`Missing module name from: ${file}`);
            }
            if (providerType) {
                logger_1.logger.info(`Loaded provider "${file}" of type: "${providerType}" with name: "${name}"`);
                this.validateProviderImplemented(providerType, instance);
                this.addModule(new ModuleData(providerClassName, ModuleClass, name, file, (_b = (yield ((_a = instance.getModuleNamespaces) === null || _a === void 0 ? void 0 : _a.call(instance)))) !== null && _b !== void 0 ? _b : [], pluginType, providerType, isDefault, tags));
            }
            else {
                logger_1.logger.info(`Loaded plugin "${file}" of type: "${pluginType}" with name: "${name}"`);
                this.validateTagsImplemented(tags, instance);
                this.validatePluginClassName(pluginType, name, pluginClassName);
                this.validatePluginModuleName(pluginType, name, pluginClassName);
                this.addModule(new ModuleData(pluginClassName, ModuleClass, name, file, (_d = (yield ((_c = instance.getModuleNamespaces) === null || _c === void 0 ? void 0 : _c.call(instance)))) !== null && _d !== void 0 ? _d : [], pluginType, providerType, isDefault, tags));
            }
        });
    }
    addModule(module) {
        if (this.moduleNames[module.name]) {
            // already found, let's compare the path, if different throw error
            if (this.moduleNames[module.name].file !== module.file) {
                throw new EngineCriticalError_1.default(`Attempting to load a module with the same name of an already loaded module. Module names should be unique.
Existing: ${JSON.stringify(this.moduleNames[module.name], null, 2)}
New: ${JSON.stringify(module, null, 2)}`);
            }
        }
        // validate naming conventions
        if (!ModulesLoader.isValidModuleName(module.name)) {
            throw new EngineCriticalError_1.default(`module name is not following naming conventions: ${module.name}`);
        }
        this.modules.push(module);
        this.moduleNames[module.name] = module;
    }
    static isValidModuleName(name) {
        const config = new Config_1.default();
        const pattern = config.getModuleNamePattern();
        if (pattern && pattern !== '') {
            const regex = new RegExp(pattern);
            return regex.test(name);
        }
        return true;
    }
    getModules() {
        return this.modules;
    }
    getModulesByName(namespace, moduleNames) {
        return moduleNames.reduce((acc, moduleName) => {
            if (!(moduleName in this.moduleNames)) {
                throw new EngineCriticalError_1.default(`Requested module name not found: ${moduleName}`);
            }
            const module = this.moduleNames[moduleName];
            if (!module.isNamespaceCompatible(namespace)) {
                throw new EngineCriticalError_1.default(`Requested module name: ${moduleName} not compatible with namespace: ${namespace}`);
            }
            return [...acc, module];
        }, []);
    }
    validatePluginType(modules, type) {
        if (!Array.isArray(modules)) {
            modules = [modules];
        }
        for (const module of modules) {
            if (module.pluginType !== type) {
                throw new EngineCriticalError_1.default(`module name: ${module.name} is not a ${String(type)}`);
            }
        }
    }
    validateProviderType(modules, type) {
        if (!Array.isArray(modules)) {
            modules = [modules];
        }
        for (const module of modules) {
            if (module.providerType !== type) {
                throw new EngineCriticalError_1.default(`module name: ${module.name} is not a ${String(type)}`);
            }
        }
    }
    getProviderInterfaceMethodsToTest(providerType) {
        switch (providerType) {
            case InterfaceDecorators_1.ProviderType.ActionQueuer:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ActionQueuerInterface);
            case InterfaceDecorators_1.ProviderType.JournalLogger:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.JournalLoggerInterface);
            case InterfaceDecorators_1.ProviderType.Logger:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.LoggerInterface);
            case InterfaceDecorators_1.ProviderType.Metrics:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.MetricsInterface);
            case InterfaceDecorators_1.ProviderType.ActiveEventsReferenceCounter:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ActiveEventsReferenceCounterInterface);
            case InterfaceDecorators_1.ProviderType.Configuration:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ConfigurationInterface);
            case InterfaceDecorators_1.ProviderType.ReactToFailure:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ReactToFailureInterface);
            case InterfaceDecorators_1.ProviderType.ScheduledEvents:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ScheduledEventsInterface);
            case InterfaceDecorators_1.ProviderType.EventDispatcher:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.EventDispatcherInterface);
            case InterfaceDecorators_1.ProviderType.DistributedLocks:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.DistributedLocksInterface);
            default:
                throw new EngineCriticalError_1.default(`Failed to match a provider type to interface: ${String(providerType)}`);
        }
    }
    validateProviderImplemented(providerType, instance) {
        const interfaceMethodNames = this.getProviderInterfaceMethodsToTest(providerType);
        const instanceMethodNames = (0, InterfaceMethodNames_1.getMethodNames)(instance);
        const implemented = interfaceMethodNames.every((val) => instanceMethodNames.includes(val));
        if (!implemented) {
            throw new EngineCriticalError_1.default(`It looks like the loaded module does not correctly implement it's expected interface: ${instance.getModuleName()}`);
        }
    }
    getPluginInterfaceMethodsToTest(pluginType) {
        switch (pluginType) {
            case InterfaceDecorators_1.PluginType.Action:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.ActionInterface);
            case InterfaceDecorators_1.PluginType.DataObject:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.DataObjectInterface);
            case InterfaceDecorators_1.PluginType.Filter:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.FilterInterface);
            case InterfaceDecorators_1.PluginType.Rule:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.RuleInterface);
            default:
                throw new EngineCriticalError_1.default(`Failed to match a plugin type to interface: ${String(pluginType)}`);
        }
    }
    getTagsInterfaceMethodsToTest(tag) {
        switch (tag) {
            case InterfaceDecorators_1.AsyncActionTag:
                return (0, InterfaceMethodNames_1.getInterfaceMethods)(InterfaceMethodNames_1.InterfaceNames.AsyncActionInterface);
            default:
                throw new EngineCriticalError_1.default(`Failed to match a tag to interface: ${tag}`);
        }
    }
    validateTagsImplemented(tags, instance) {
        for (const tag of tags) {
            const interfaceMethodNames = this.getTagsInterfaceMethodsToTest(tag);
            const instanceMethodNames = (0, InterfaceMethodNames_1.getMethodNames)(instance);
            const implemented = interfaceMethodNames.every((val) => instanceMethodNames.includes(val));
            if (!implemented) {
                throw new EngineCriticalError_1.default(`It looks like the loaded module does not correctly implement it's expected interface for tag: [${tag}]: ${instance.getModuleName()}`);
            }
        }
    }
    validatePluginClassName(pluginType, moduleName, className) {
        const config = new Config_1.default();
        const forcePostfix = config.getPluginClassNamesForcePostfix();
        if (forcePostfix) {
            let postfix = undefined;
            switch (pluginType) {
                case InterfaceDecorators_1.PluginType.Action:
                    postfix = 'Action';
                    break;
                case InterfaceDecorators_1.PluginType.Rule:
                    postfix = 'Rule';
                    break;
                case InterfaceDecorators_1.PluginType.Filter:
                    postfix = 'Filter';
                    break;
                case InterfaceDecorators_1.PluginType.DataObject:
                    postfix = 'DataObject';
                    break;
            }
            if (postfix && !className.endsWith(postfix)) {
                throw new EngineCriticalError_1.default(`Module: ${moduleName} class name does not end with the proper postfix: ${postfix}. Class name: ${className}`);
            }
        }
    }
    validatePluginModuleName(pluginType, moduleName, className) {
        const config = new Config_1.default();
        const forcePostfix = config.getPluginModuleNamesForcePostfix();
        if (forcePostfix) {
            let postfix = undefined;
            switch (pluginType) {
                case InterfaceDecorators_1.PluginType.Action:
                    postfix = '-action';
                    break;
                case InterfaceDecorators_1.PluginType.Rule:
                    postfix = '-rule';
                    break;
                case InterfaceDecorators_1.PluginType.Filter:
                    postfix = '-filter';
                    break;
                case InterfaceDecorators_1.PluginType.DataObject:
                    postfix = '-data-object';
                    break;
            }
            if (postfix && !moduleName.endsWith(postfix)) {
                throw new EngineCriticalError_1.default(`Module: ${moduleName} does not end with the proper postfix: ${postfix}. Class name: ${className}`);
            }
        }
    }
}
exports.default = ModulesLoader;
