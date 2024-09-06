import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { LoggerInterface } from '../interfaces/Providers';
import { logger } from '../lib/logger';

@GallifreyProvider(ProviderType.Logger)
export default class ConsoleLoggerProvider implements LoggerInterface {
    async debug(message: string, payload?: any): Promise<void> {
        logger.debug(message, payload);
    }

    async error(message: string, payload?: any): Promise<void> {
        logger.error(message, payload);
    }

    async info(message: string, payload?: any): Promise<void> {
        logger.info(message, payload);
    }

    async warn(message: string, payload?: any): Promise<void> {
        logger.warn(message, payload);
    }
}
