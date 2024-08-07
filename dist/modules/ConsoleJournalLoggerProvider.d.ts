import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import { GallifreyEventTypeInternal } from '../lib/GallifreyEventTypeInternal';
export default class ConsoleJournalLoggerProvider implements JournalLoggerInterface {
    private readonly addExtraToJournalLogs;
    constructor();
    private log;
    startEvent(event: GallifreyEventTypeInternal<any>): void;
    customLog(description: string, extra: any): void;
    endDoAction(name: string, response: any, duration: number, error?: Error): void;
    endEvent(duration: number, error?: Error): void;
    endPullDataObject(name: string, response: any, duration: number, error?: Error): void;
    endRunRule(name: string, duration: number, error?: Error): void;
    getModuleName(): string;
    startDoAction(name: string, payload: any): void;
    startPullDataObject(name: string, request: any): void;
    startRunRule(name: string): void;
    private getExtra;
    dataObjectPulledFromEventStore(name: string, request: any): void;
    endFilter(name: string, duration: number, error?: Error): void;
    startFilter(name: string): void;
    filterStoppedEvent(name: string, duration: number): void;
    endQueueAsyncAction(name: string, duration: number, error?: Error): void;
    startQueueAsyncAction(name: string, payload: any): void;
}
