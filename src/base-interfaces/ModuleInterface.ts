/**
 * author: Ralph Varjabedian
 */
import InitializableInterface from './InitializableInterface';
import EngineCriticalError from '../errors/EngineCriticalError';

export default interface ModuleInterface extends InitializableInterface {
    /**
     * Gets the module name, has to be unique across all modules
     */
    getModuleName?(): string;

    /**
     * The optional namespaces that the module is compatible with.
     * If skipped this means this module has no restrictions and can run with any namespace
     */
    getModuleNamespaces?(): Promise<string[]>;
}

export type WithModuleNameType<T extends ModuleInterface> = T & Required<Pick<ModuleInterface, 'getModuleName'>>;

export function IsWithModuleNameType<Type extends ModuleInterface>(obj: Type): obj is WithModuleNameType<Type> {
    return typeof obj.getModuleName === 'function';
}

export function WithModuleName<Type extends ModuleInterface>(obj: Type): WithModuleNameType<Type> {
    if (!IsWithModuleNameType<Type>(obj)) {
        throw new EngineCriticalError(`missing getModuleName`);
    }
    return obj;
}
