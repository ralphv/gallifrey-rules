import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { LoggerInterface } from '../interfaces/Providers';
import { logger } from '../lib/logger';
import EngineFullEventContextInterface from '../engine-interfaces/EngineFullEventContextInterface';
import { AssertNotNull } from '../lib/Utils';
import { GetPinoLogger } from '../lib/Pino';
import { Logger } from 'pino';

@GallifreyProvider(ProviderType.Logger)
export default class PinoLoggerProvider implements LoggerInterface {
    private pinoLogger: Logger<never, boolean> | undefined;

    async initialize() {
        this.pinoLogger = GetPinoLogger();
    }

    debug(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.debug(message, payload);
        AssertNotNull(this.pinoLogger).debug(message, payload);
    }

    error(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.error(message, payload);
        AssertNotNull(this.pinoLogger).error(message, payload);
    }

    info(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.info(message, payload);
        AssertNotNull(this.pinoLogger).info(message, payload);
    }

    warn(context: EngineFullEventContextInterface, message: string, payload?: any): void {
        logger.warn(message, payload);
        AssertNotNull(this.pinoLogger).warn(message, payload);
    }
}
