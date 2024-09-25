import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { LoggerInterface } from '../interfaces/Providers';
import { logger } from '../lib/logger';
import EngineFullEventContextInterface from '../engine-interfaces/EngineFullEventContextInterface';

@GallifreyProvider(ProviderType.Logger)
export default class ConsoleLoggerProvider implements LoggerInterface {
    async debug(context: EngineFullEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.debug(message, payload);
    }

    async error(context: EngineFullEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.error(message, payload);
    }

    async info(context: EngineFullEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.info(message, payload);
    }

    async warn(context: EngineFullEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.warn(message, payload);
    }
}
