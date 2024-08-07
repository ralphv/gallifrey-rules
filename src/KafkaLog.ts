/* istanbul ignore file */
import { LogEntry, logLevel } from 'kafkajs';
import { logger } from './lib/logger';

export default class KafkaLog {
    public static getLogCreator() {
        return () => {
            return ({ level, log }: LogEntry) => {
                const { message, ...extra } = log;
                switch (level) {
                    case logLevel.DEBUG:
                        logger.debug({ message, extra });
                        break;
                    case logLevel.INFO:
                        logger.info({ message, extra });
                        break;
                    case logLevel.WARN:
                        logger.warn({ message, extra });
                        break;
                    case logLevel.ERROR:
                        logger.error({ message, extra });
                        break;
                    default:
                        logger.trace({ message, extra });
                        break;
                }
            };
        };
    }
}
