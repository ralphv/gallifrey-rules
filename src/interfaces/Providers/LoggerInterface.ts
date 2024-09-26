/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineFullEventContextInterface from '../../engine-interfaces/EngineFullEventContextInterface';

export default interface LoggerInterface extends ModuleInterface {
    debug(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    info(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    warn(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    error(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
}

export class __LoggerInterface implements LoggerInterface {
    debug(context: EngineFullEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    error(context: EngineFullEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    info(context: EngineFullEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    warn(context: EngineFullEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }
}
