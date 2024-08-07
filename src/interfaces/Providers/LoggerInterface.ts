/* eslint-disable @typescript-eslint/no-unused-vars */
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

export class __LoggerInterface implements LoggerInterface {
    debug(message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    error(message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    getModuleName(): string {
        return '';
    }

    info(message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    warn(message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }
}
