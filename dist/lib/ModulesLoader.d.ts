import { PluginType, ProviderType } from '../interfaces/InterfaceDecorators';
import { ClassType } from './BaseTypes';
import ModuleInterface from '../base-interfaces/ModuleInterface';
export declare class ModuleData {
    readonly className: string;
    readonly classRef: ClassType<ModuleInterface>;
    readonly name: string;
    readonly file: string;
    readonly namespaces: string[];
    readonly pluginType: PluginType | undefined;
    readonly providerType: ProviderType | undefined;
    readonly isDefaultProvider: boolean | undefined;
    readonly tags: string[];
    constructor(className: string, classRef: ClassType<ModuleInterface>, name: string, file: string, namespaces: string[], pluginType: PluginType | undefined, providerType: ProviderType | undefined, isDefaultProvider: boolean | undefined, tags: string[]);
    isNamespaceCompatible(namespace: string): boolean;
}
export default class ModulesLoader {
    private modules;
    private moduleNames;
    private readonly config;
    constructor();
    loadModulesFromPath(directory: string): Promise<void>;
    private getListOfFiles;
    private loadModule;
    private addModule;
    static isValidModuleName(name: string): boolean;
    getModules(): ModuleData[];
    getModulesByName(namespace: string, moduleNames: string[]): ModuleData[];
    validatePluginType(modules: ModuleData[] | ModuleData, type: PluginType): void;
    validateProviderType(modules: ModuleData[] | ModuleData, type: ProviderType): void;
    private getProviderInterfaceMethodsToTest;
    private validateProviderImplemented;
    private getPluginInterfaceMethodsToTest;
    private getTagsInterfaceMethodsToTest;
    private validateTagsImplemented;
    private validatePluginClassName;
    private validatePluginModuleName;
}
