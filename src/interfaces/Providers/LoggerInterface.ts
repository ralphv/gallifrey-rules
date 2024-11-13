/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineFullEventContextInterface from '../../engine-interfaces/EngineFullEventContextInterface';

export default interface LoggerInterface extends ModuleInterface {
    debug(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): void;
    info(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): void;
    warn(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): void;
    error(context: EngineFullEventContextInterface | undefined, message: string, payload?: any): void;
}

export class __LoggerInterface implements LoggerInterface {
    debug(context: EngineFullEventContextInterface | undefined, message: string, payload: any): void {}

    error(context: EngineFullEventContextInterface | undefined, message: string, payload: any): void {}

    info(context: EngineFullEventContextInterface | undefined, message: string, payload: any): void {}

    warn(context: EngineFullEventContextInterface | undefined, message: string, payload: any): void {}
}
