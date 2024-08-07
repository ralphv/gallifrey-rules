/* eslint-disable @typescript-eslint/no-unused-vars */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { GallifreyEventTypeInternal } from '../../lib/GallifreyEventTypeInternal';

/**
 * author: Ralph Varjabedian
 */
export default interface JournalLoggerInterface extends ModuleInterface {
    startEvent(event: GallifreyEventTypeInternal<any>): void;
    endEvent(duration: number, error?: Error): void;

    startFilter(name: string): void;
    filterStoppedEvent(name: string, duration: number): void;
    endFilter(name: string, duration: number, error?: Error): void;

    startRunRule(name: string): void;
    endRunRule(name: string, duration: number, error?: Error): void;

    startDoAction(name: string, payload: any): void;
    endDoAction(name: string, response: any, duration: number, error?: Error): void;

    startQueueAsyncAction(name: string, payload: any): void;
    endQueueAsyncAction(name: string, duration: number, error?: Error): void;

    startPullDataObject(name: string, request: any): void;
    dataObjectPulledFromEventStore(name: string, request: any): void;
    endPullDataObject(name: string, response: any, duration: number, error?: Error): void;

    customLog(description: string, extra: any): void;
}

export class __JournalLoggerInterface implements JournalLoggerInterface {
    customLog(description: string, extra: any): void {}

    dataObjectPulledFromEventStore(name: string, request: any): void {}

    endDoAction(name: string, response: any, duration: number, error?: Error): void {}

    endEvent(duration: number, error?: Error): void {}

    endPullDataObject(name: string, response: any, duration: number, error?: Error): void {}

    endRunRule(name: string, duration: number, error?: Error): void {}

    getModuleName(): string {
        return '';
    }

    startDoAction(name: string, payload: any): void {}

    startEvent(event: GallifreyEventTypeInternal<any>): void {}

    startPullDataObject(name: string, request: any): void {}

    startRunRule(name: string): void {}

    endFilter(name: string, duration: number, error?: Error): void {}

    startFilter(name: string): void {}

    filterStoppedEvent(name: string, duration: number): void {}

    endQueueAsyncAction(name: string, duration: number, error?: Error): void {}

    startQueueAsyncAction(name: string, payload: any): void {}
}
