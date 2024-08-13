import * as fs from 'fs';
import * as path from 'path';
import {
    AsyncActionTag,
    getGallifreyPluginType,
    getGallifreyProviderType,
    getGallifreyTags,
    PluginType,
    ProviderType,
} from '../interfaces/InterfaceDecorators';
import { logger } from './logger';
import Config from './Config';
import { AnyClass, ClassType } from './BaseTypes';
import ModuleInterface from '../base-interfaces/ModuleInterface';
import EngineCriticalError from '../errors/EngineCriticalError';
import { getInterfaceMethods, getMethodNames, InterfaceNames } from './InterfaceMethodNames';

export class ModuleData {
    constructor(
        public readonly className: string,
        public readonly classRef: ClassType<ModuleInterface>,
        public readonly name: string,
        public readonly file: string,
        public readonly namespaces: string[],
        public readonly pluginType: PluginType | undefined,
        public readonly providerType: ProviderType | undefined,
        public readonly isDefaultProvider: boolean | undefined,
        public readonly tags: string[],
    ) {}

    isNamespaceCompatible(namespace: string) {
        if (this.namespaces.length === 0) {
            return true;
        }
        return this.namespaces.filter((n) => namespace === n).length !== 0;
    }
}

export default class ModulesLoader {
    private modules: ModuleData[] = [];
    private moduleNames: { [key: string]: ModuleData } = {};
    private readonly config: Config;

    constructor() {
        this.config = new Config();
    }

    async loadModulesFromPath(directory: string) {
        logger.info(`Loading modules from path: ${directory}`);
        if (directory === '$') {
            // use internal path
            directory = path.resolve(__dirname, '..', 'modules');
        }
        const files = await this.getListOfFiles(
            directory,
            this.config.getExtensionsOfModules(),
            this.config.skipExtensionsOfModules(),
        );
        await Promise.all(files.map((file) => this.loadModule(file)));
    }

    private async getListOfFiles(directory: string, extensions: string[], skipExtensions: string[]): Promise<string[]> {
        let results: string[] = [];

        const list = await fs.promises.readdir(directory, { withFileTypes: true });

        for (const file of list) {
            const filePath = path.resolve(directory, file.name);

            if (file.isDirectory()) {
                const res = await this.getListOfFiles(filePath, extensions, skipExtensions);
                results = results.concat(res);
            } else {
                if (
                    extensions.some((extension) => filePath.endsWith(extension)) &&
                    !skipExtensions.some((skipExtension) => filePath.endsWith(skipExtension))
                ) {
                    results.push(filePath);
                }
            }
        }

        return results;
    }

    private async loadModule(file: string) {
        const module: { default: any } = await import(file);
        const ModuleClass: AnyClass = module.default;
        const config = new Config();
        if (!ModuleClass) {
            throw new EngineCriticalError(`No default export found in module ${file}`);
        }
        const { pluginType, className: pluginClassName } = getGallifreyPluginType(ModuleClass);
        const { providerType, isDefault, className: providerClassName } = getGallifreyProviderType(ModuleClass);
        const tags = getGallifreyTags(ModuleClass);
        if (pluginType === undefined && providerType === undefined) {
            if (config.throwOnNotModule()) {
                throw new EngineCriticalError(
                    `default export found in module ${file} is not decorated as a plugin/provider. Did you forget to use @GallifreyPlugin or @GallifreyProvider?`,
                );
            }
            logger.warn(
                `default export found in module ${file} is not decorated as a plugin/provider. Did you forget to use @GallifreyPlugin or @GallifreyProvider?`,
            );
            return;
        }
        const instance = new ModuleClass() as ModuleInterface;
        const name = instance.getModuleName();
        if (!name) {
            throw new EngineCriticalError(`Missing module name from: ${file}`);
        }
        if (providerType) {
            logger.info(`Loaded provider "${file}" of type: "${providerType}" with name: "${name}"`);
            this.validateProviderImplemented(providerType, instance);
            this.addModule(
                new ModuleData(
                    providerClassName as string,
                    ModuleClass,
                    name,
                    file,
                    (await instance.getModuleNamespaces?.()) ?? [],
                    pluginType,
                    providerType,
                    isDefault,
                    tags,
                ),
            );
        } else {
            logger.info(`Loaded plugin "${file}" of type: "${pluginType}" with name: "${name}"`);
            this.validateTagsImplemented(tags, instance);
            this.validatePluginClassName(pluginType as PluginType, name, pluginClassName as string);
            this.validatePluginModuleName(pluginType as PluginType, name, pluginClassName as string);
            this.addModule(
                new ModuleData(
                    pluginClassName as string,
                    ModuleClass,
                    name,
                    file,
                    (await instance.getModuleNamespaces?.()) ?? [],
                    pluginType,
                    providerType,
                    isDefault,
                    tags,
                ),
            );
        }
    }

    private addModule(module: ModuleData) {
        if (this.moduleNames[module.name]) {
            // already found, let's compare the path, if different throw error
            if (this.moduleNames[module.name].file !== module.file) {
                throw new EngineCriticalError(`Attempting to load a module with the same name of an already loaded module. Module names should be unique.
Existing: ${JSON.stringify(this.moduleNames[module.name], null, 2)}
New: ${JSON.stringify(module, null, 2)}`);
            }
        }
        // validate naming conventions
        if (!ModulesLoader.isValidModuleName(module.name)) {
            throw new EngineCriticalError(`module name is not following naming conventions: ${module.name}`);
        }
        this.modules.push(module);
        this.moduleNames[module.name] = module;
    }

    static isValidModuleName(name: string): boolean {
        const config = new Config();
        const pattern = config.getModuleNamePattern();
        if (pattern && pattern !== '') {
            const regex = new RegExp(pattern);
            return regex.test(name);
        }
        return true;
    }

    public getModules() {
        return this.modules;
    }

    getModulesByName(namespace: string, moduleNames: string[]): ModuleData[] {
        return moduleNames.reduce((acc: ModuleData[], moduleName) => {
            if (!(moduleName in this.moduleNames)) {
                throw new EngineCriticalError(`Requested module name not found: ${moduleName}`);
            }
            const module = this.moduleNames[moduleName];
            if (!module.isNamespaceCompatible(namespace)) {
                throw new EngineCriticalError(
                    `Requested module name: ${moduleName} not compatible with namespace: ${namespace}`,
                );
            }
            return [...acc, module];
        }, []);
    }

    validatePluginType(modules: ModuleData[] | ModuleData, type: PluginType) {
        if (!Array.isArray(modules)) {
            modules = [modules];
        }
        for (const module of modules) {
            if (module.pluginType !== type) {
                throw new EngineCriticalError(`module name: ${module.name} is not a ${String(type)}`);
            }
        }
    }

    validateProviderType(modules: ModuleData[] | ModuleData, type: ProviderType) {
        if (!Array.isArray(modules)) {
            modules = [modules];
        }
        for (const module of modules) {
            if (module.providerType !== type) {
                throw new EngineCriticalError(`module name: ${module.name} is not a ${String(type)}`);
            }
        }
    }

    private getProviderInterfaceMethodsToTest(providerType: ProviderType): string[] {
        switch (providerType) {
            case ProviderType.ActionQueuer:
                return getInterfaceMethods(InterfaceNames.ActionQueuerInterface);
            case ProviderType.JournalLogger:
                return getInterfaceMethods(InterfaceNames.JournalLoggerInterface);
            case ProviderType.Logger:
                return getInterfaceMethods(InterfaceNames.LoggerInterface);
            case ProviderType.Metrics:
                return getInterfaceMethods(InterfaceNames.MetricsInterface);
            case ProviderType.ActiveEventsReferenceCounter:
                return getInterfaceMethods(InterfaceNames.ActiveEventsReferenceCounterInterface);
            case ProviderType.Configuration:
                return getInterfaceMethods(InterfaceNames.ConfigurationInterface);
            case ProviderType.ReactToFailure:
                return getInterfaceMethods(InterfaceNames.ReactToFailureInterface);
            case ProviderType.ScheduledEvents:
                return getInterfaceMethods(InterfaceNames.ScheduledEventsInterface);
            case ProviderType.EventDispatcher:
                return getInterfaceMethods(InterfaceNames.EventDispatcherInterface);
            case ProviderType.DistributedLocks:
                return getInterfaceMethods(InterfaceNames.DistributedLocksInterface);
            default:
                throw new EngineCriticalError(`Failed to match a provider type to interface: ${String(providerType)}`);
        }
    }

    private validateProviderImplemented(providerType: ProviderType, instance: ModuleInterface) {
        const interfaceMethodNames = this.getProviderInterfaceMethodsToTest(providerType);
        const instanceMethodNames = getMethodNames(instance);
        const implemented = interfaceMethodNames.every((val) => instanceMethodNames.includes(val));
        if (!implemented) {
            throw new EngineCriticalError(
                `It looks like the loaded module does not correctly implement it's expected interface: ${instance.getModuleName()}`,
            );
        }
    }

    private getPluginInterfaceMethodsToTest(pluginType: PluginType): string[] {
        switch (pluginType) {
            case PluginType.Action:
                return getInterfaceMethods(InterfaceNames.ActionInterface);
            case PluginType.DataObject:
                return getInterfaceMethods(InterfaceNames.DataObjectInterface);
            case PluginType.Filter:
                return getInterfaceMethods(InterfaceNames.FilterInterface);
            case PluginType.Rule:
                return getInterfaceMethods(InterfaceNames.RuleInterface);
            default:
                throw new EngineCriticalError(`Failed to match a plugin type to interface: ${String(pluginType)}`);
        }
    }

    private getTagsInterfaceMethodsToTest(tag: string): string[] {
        switch (tag) {
            case AsyncActionTag:
                return getInterfaceMethods(InterfaceNames.AsyncActionInterface);
            default:
                throw new EngineCriticalError(`Failed to match a tag to interface: ${tag}`);
        }
    }

    private validateTagsImplemented(tags: string[], instance: ModuleInterface) {
        for (const tag of tags) {
            const interfaceMethodNames = this.getTagsInterfaceMethodsToTest(tag);
            const instanceMethodNames = getMethodNames(instance);
            const implemented = interfaceMethodNames.every((val) => instanceMethodNames.includes(val));
            if (!implemented) {
                throw new EngineCriticalError(
                    `It looks like the loaded module does not correctly implement it's expected interface for tag: [${tag}]: ${instance.getModuleName()}`,
                );
            }
        }
    }

    private validatePluginClassName(pluginType: PluginType, moduleName: string, className: string) {
        const config = new Config();
        const forcePostfix = config.getPluginClassNamesForcePostfix();
        if (forcePostfix) {
            let postfix = undefined;
            switch (pluginType) {
                case PluginType.Action:
                    postfix = 'Action';
                    break;
                case PluginType.Rule:
                    postfix = 'Rule';
                    break;
                case PluginType.Filter:
                    postfix = 'Filter';
                    break;
                case PluginType.DataObject:
                    postfix = 'DataObject';
                    break;
            }
            if (postfix && !className.endsWith(postfix)) {
                throw new EngineCriticalError(
                    `Module: ${moduleName} class name does not end with the proper postfix: ${postfix}. Class name: ${className}`,
                );
            }
        }
    }

    private validatePluginModuleName(pluginType: PluginType, moduleName: string, className: string) {
        const config = new Config();
        const forcePostfix = config.getPluginModuleNamesForcePostfix();
        if (forcePostfix) {
            let postfix = undefined;
            switch (pluginType) {
                case PluginType.Action:
                    postfix = '-action';
                    break;
                case PluginType.Rule:
                    postfix = '-rule';
                    break;
                case PluginType.Filter:
                    postfix = '-filter';
                    break;
                case PluginType.DataObject:
                    postfix = '-data-object';
                    break;
            }
            if (postfix && !moduleName.endsWith(postfix)) {
                throw new EngineCriticalError(
                    `Module: ${moduleName} does not end with the proper postfix: ${postfix}. Class name: ${className}`,
                );
            }
        }
    }
}
