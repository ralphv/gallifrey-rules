import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { LoggerInterface } from '../interfaces/Providers';
import { logger } from '../lib/logger';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';

@GallifreyProvider(ProviderType.Logger)
export default class ConsoleLoggerProvider implements LoggerInterface {
    async debug(context: EngineEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.debug(message, payload);
    }

    async error(context: EngineEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.error(message, payload);
    }

    async info(context: EngineEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.info(message, payload);
    }

    async warn(context: EngineEventContextInterface, message: string, payload?: any): Promise<void> {
        logger.warn(message, payload);
    }
}
