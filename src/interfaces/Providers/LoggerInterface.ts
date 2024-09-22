/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineEventContextInterface from '../../engine-interfaces/EngineEventContextInterface';

export default interface LoggerInterface extends ModuleInterface {
    debug(context: EngineEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    info(context: EngineEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    warn(context: EngineEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
    error(context: EngineEventContextInterface | undefined, message: string, payload?: any): Promise<void>;
}

export class __LoggerInterface implements LoggerInterface {
    debug(context: EngineEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    error(context: EngineEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    info(context: EngineEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    warn(context: EngineEventContextInterface | undefined, message: string, payload: any): Promise<void> {
        return Promise.reject('un-callable code');
    }
}
