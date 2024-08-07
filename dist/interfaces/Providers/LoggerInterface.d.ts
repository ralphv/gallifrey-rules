/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
export default interface LoggerInterface extends ModuleInterface {
    debug(message: string, payload: any): Promise<void>;
    info(message: string, payload: any): Promise<void>;
    warn(message: string, payload: any): Promise<void>;
    error(message: string, payload: any): Promise<void>;
}
export declare class __LoggerInterface implements LoggerInterface {
    debug(message: string, payload: any): Promise<void>;
    error(message: string, payload: any): Promise<void>;
    getModuleName(): string;
    info(message: string, payload: any): Promise<void>;
    warn(message: string, payload: any): Promise<void>;
}
