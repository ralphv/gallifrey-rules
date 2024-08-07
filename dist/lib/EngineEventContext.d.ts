import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import { ScheduledEventType } from '../engine-events/ScheduledEventType';
export declare class EngineEventContext implements EngineEventContextInterface {
    private readonly namespace;
    private readonly entityName;
    private readonly eventName;
    private readonly eventID;
    private readonly source;
    private eventStore;
    private scheduledEvent;
    private journalLogger;
    constructor(namespace: string, entityName: string, eventName: string, eventID: string, source: string);
    getEntityName(): string;
    getEventID(): string;
    getEventName(): string;
    getNamespace(): string;
    getJournalLogger(): JournalLoggerInterface;
    setJournalLogger(journalLogger: JournalLoggerInterface): void;
    addToEventStore(key: string, value: any): void;
    isInEventStore(key: string | undefined): boolean;
    getFromEventStore(key: string): any;
    setScheduledEvent(scheduledEvent: ScheduledEventType): void;
    getScheduledEvent(): ScheduledEventType | undefined;
    getSource(): string;
}
