import { ScheduledEventType } from '../engine-events/ScheduledEventType';
import { AssertNotNull } from './Utils';
import Config from './Config';
import SafeJournalLoggerWrapper from '../SafeJournalLoggerWrapper';
import { LoggerInterface } from '../interfaces/Providers';
import EngineFullEventContextInterface from '../engine-interfaces/EngineFullEventContextInterface';

export class EngineEventContext implements EngineFullEventContextInterface {
    private eventStore: { [key: string]: any } = {};
    private scheduledEvent: ScheduledEventType | undefined;
    private journalLogger: SafeJournalLoggerWrapper | undefined;

    constructor(
        private readonly namespace: string,
        private readonly entityName: string,
        private readonly eventName: string,
        private readonly eventID: string,
        private readonly source: string,
        private readonly eventLevelConfig: Config,
        private readonly logger: LoggerInterface,
        private readonly payload: any,
    ) {}

    getEntityName(): string {
        return this.entityName;
    }

    getEventID(): string {
        return this.eventID;
    }

    getEventName(): string {
        return this.eventName;
    }

    getNamespace(): string {
        return this.namespace;
    }

    public getJournalLogger(): SafeJournalLoggerWrapper {
        return AssertNotNull(this.journalLogger);
    }

    public getLogger(): LoggerInterface {
        return this.logger;
    }

    public setJournalLogger(journalLogger: SafeJournalLoggerWrapper) {
        this.journalLogger = journalLogger;
    }

    async addToEventStore(context: EngineFullEventContextInterface, key: string, value: any) {
        if (this.isInEventStore(key)) {
            this.logger.warn(context, `Key already exists in eventStore: ${key}`);
        }
        this.eventStore[key] = value;
    }

    isInEventStore(key: string | undefined): boolean {
        if (!key) {
            return false;
        }
        return key in this.eventStore;
    }

    getFromEventStore(key: string): any {
        return this.eventStore[key];
    }

    setScheduledEvent(scheduledEvent: ScheduledEventType) {
        this.scheduledEvent = scheduledEvent;
    }

    getScheduledEvent() {
        return this.scheduledEvent;
    }

    getSource(): string {
        return this.source;
    }

    getEventLevelConfig(): Config {
        return this.eventLevelConfig;
    }

    getPayload(): string {
        return this.payload;
    }
}
