import JournalLoggerInterface from './interfaces/Providers/JournalLoggerInterface';
import { GallifreyEventTypeInternal } from './lib/GallifreyEventTypeInternal';
export default class SafeJournalLoggerWrapper implements JournalLoggerInterface {
    private readonly journalLogger;
    constructor(journalLogger: JournalLoggerInterface);
    customLog(description: string, extra: any): void;
    endDoAction(name: string, response: any, duration: number, error?: Error): void;
    endEvent(duration: number, error?: Error): void;
    endPullDataObject(name: string, response: any, duration: number, error?: Error): void;
    endRunRule(name: string, duration: number, error?: Error): void;
    getModuleName(): string;
    startDoAction(name: string, payload: any): void;
    startEvent(event: GallifreyEventTypeInternal<any>): void;
    startPullDataObject(name: string, request: any): void;
    startRunRule(name: string): void;
    dataObjectPulledFromEventStore(name: string, request: any): void;
    endFilter(name: string, duration: number, error?: Error): void;
    startFilter(name: string): void;
    filterStoppedEvent(name: string, duration: number): void;
    endQueueAsyncAction(name: string, duration: number, error?: Error): void;
    startQueueAsyncAction(name: string, payload: any): void;
}
