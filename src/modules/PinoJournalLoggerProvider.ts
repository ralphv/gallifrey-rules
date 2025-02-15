import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import ConsoleJournalLoggerProvider, { ConsoleJournalLoggerProviderType } from './ConsoleJournalLoggerProvider';
import { AssertNotNull } from '../lib/Utils';
import { GetPinoLogger } from '../lib/Pino';
import { Logger } from 'pino';

@GallifreyProvider(ProviderType.JournalLogger)
export default class PinoJournalLoggerProvider extends ConsoleJournalLoggerProvider {
    private pinoLogger: Logger<never, boolean> | undefined;

    async initialize() {
        this.pinoLogger = GetPinoLogger();
    }

    protected onEndEvent(log: ConsoleJournalLoggerProviderType | undefined, errorFlagged: boolean) {
        super.onEndEvent(log, errorFlagged);
        if (log) {
            if (errorFlagged) {
                AssertNotNull(this.pinoLogger).error(
                    `${log.eventId}; JournalLog Error: Entity: ${log.entityName} Event: ${log.eventName} EventID: ${log.eventId}`,
                    {
                        labels: { journal: 'true' },
                        log: log,
                    },
                );
            } else {
                AssertNotNull(this.pinoLogger).info(
                    `${log.eventId}; JournalLog: Entity: ${log.entityName} Event: ${log.eventName} EventID: ${log.eventId}`,
                    {
                        labels: { journal: 'true' },
                        log: log,
                    },
                );
            }
        }
    }
}
