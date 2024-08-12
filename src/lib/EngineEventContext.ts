import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import { logger } from './logger';
import { ScheduledEventType } from '../engine-events/ScheduledEventType';
import { AssertNotNull } from './Utils';
import Config from './Config';

export class EngineEventContext implements EngineEventContextInterface {
    private eventStore: { [key: string]: any } = {};
    private scheduledEvent: ScheduledEventType | undefined;
    private journalLogger: JournalLoggerInterface | undefined;

    constructor(
        private readonly namespace: string,
        private readonly entityName: string,
        private readonly eventName: string,
        private readonly eventID: string,
        private readonly source: string,
        private readonly eventLevelConfig: Config,
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

    public getJournalLogger(): JournalLoggerInterface {
        return AssertNotNull(this.journalLogger);
    }

    public setJournalLogger(journalLogger: JournalLoggerInterface) {
        this.journalLogger = journalLogger;
    }

    addToEventStore(key: string, value: any): void {
        if (this.isInEventStore(key)) {
            logger.warn(`Key already exists in eventStore: ${key}`);
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
}
