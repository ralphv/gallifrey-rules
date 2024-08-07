/**
 * author: Ralph Varjabedian
 */
import InitializableInterface from './InitializableInterface';
export default interface ModuleInterface extends InitializableInterface {
    /**
     * Gets the module name, has to be unique across all modules
     */
    getModuleName(): string;
    /**
     * The optional namespaces that the module is compatible with.
     * If skipped this means this module has no restrictions and can run with any namespace
     */
    getModuleNamespaces?(): Promise<string[]>;
}
