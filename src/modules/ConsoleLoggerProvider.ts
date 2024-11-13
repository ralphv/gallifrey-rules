import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { LoggerInterface } from '../interfaces/Providers';
import { logger } from '../lib/logger';
import EngineFullEventContextInterface from '../engine-interfaces/EngineFullEventContextInterface';

@GallifreyProvider(ProviderType.Logger)
export default class ConsoleLoggerProvider implements LoggerInterface {
    debug(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.debug(message, payload);
    }

    error(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.error(message, payload);
    }

    info(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.info(message, payload);
    }

    warn(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.warn(message, payload);
    }
}
