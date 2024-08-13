import JournalLoggerInterface from './interfaces/Providers/JournalLoggerInterface';
import { DontThrowJustLog } from './lib/Decorators';
import { GallifreyEventTypeInternal } from './lib/GallifreyEventTypeInternal';

export default class SafeJournalLoggerWrapper implements JournalLoggerInterface {
    constructor(private readonly journalLogger: JournalLoggerInterface) {}

    @DontThrowJustLog
    customLog(description: string, extra: any): void {
        this.journalLogger.customLog(description, extra);
    }

    @DontThrowJustLog
    endDoAction(name: string, response: any, duration: number, error?: Error): void {
        this.journalLogger.endDoAction(name, response, duration, error);
    }

    @DontThrowJustLog
    endEvent(duration: number, error?: Error): void {
        this.journalLogger.endEvent(duration, error);
    }

    @DontThrowJustLog
    endPullDataObject(name: string, response: any, duration: number, error?: Error): void {
        this.journalLogger.endPullDataObject(name, response, duration, error);
    }

    @DontThrowJustLog
    endRunRule(name: string, duration: number, error?: Error): void {
        this.journalLogger.endRunRule(name, duration, error);
    }

    @DontThrowJustLog
    getModuleName(): string {
        return this.journalLogger.getModuleName();
    }

    @DontThrowJustLog
    startDoAction(name: string, payload: any): void {
        this.journalLogger.startDoAction(name, payload);
    }

    @DontThrowJustLog
    startEvent(event: GallifreyEventTypeInternal<any>): void {
        this.journalLogger.startEvent(event);
    }

    @DontThrowJustLog
    startPullDataObject(name: string, request: any): void {
        this.journalLogger.startPullDataObject(name, request);
    }

    @DontThrowJustLog
    startRunRule(name: string): void {
        this.journalLogger.startRunRule(name);
    }

    @DontThrowJustLog
    dataObjectPulledFromEventStore(name: string, request: any): void {
        this.journalLogger.dataObjectPulledFromEventStore(name, request);
    }

    @DontThrowJustLog
    endFilter(name: string, duration: number, error?: Error): void {
        this.journalLogger.endFilter(name, duration, error);
    }

    @DontThrowJustLog
    startFilter(name: string): void {
        this.journalLogger.startFilter(name);
    }

    @DontThrowJustLog
    filterStoppedEvent(name: string, duration: number) {
        return this.journalLogger.filterStoppedEvent(name, duration);
    }

    @DontThrowJustLog
    endQueueAsyncAction(name: string, duration: number, error?: Error): void {
        return this.journalLogger.endQueueAsyncAction(name, duration, error);
    }

    @DontThrowJustLog
    startQueueAsyncAction(name: string, payload: any): void {
        return this.journalLogger.startQueueAsyncAction(name, payload);
    }
}
