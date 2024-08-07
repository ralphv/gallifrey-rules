import { GallifreyEventTypeInternal } from './GallifreyEventTypeInternal';
import MetricsInterface from '../interfaces/Providers/MetricsInterface';
export declare class Metrics {
    private metricsProvider;
    constructor(metricsProvider: MetricsInterface);
    private getPoint;
    engineInitialized(namespace: string): void;
    handleEvent(event: GallifreyEventTypeInternal<any>): void;
    flush(): Promise<void>;
    publishPartitionLag(namespace: string, lag: number, partition: number, topic: string, group: string): void;
    private timeModule;
    timeEvent(event: GallifreyEventTypeInternal<any>, timerInMs: number): void;
    timeRule(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number): void;
    timeAction(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number, triggeredAsAsync: boolean): void;
    timeDataObject(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number): void;
    timeFilter(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number): void;
    timeAcquireLock(event: GallifreyEventTypeInternal<any>, timerInMs: number, acquiredSuccess: boolean): void;
    timeReleaseLock(event: GallifreyEventTypeInternal<any>, timerInMs: number, acquiredSuccess: boolean): void;
    countErrors(event: GallifreyEventTypeInternal<any>): void;
    queuedAction(event: GallifreyEventTypeInternal<any>, actionName: string, timerInMs: number, queuedSuccess: boolean): void;
    timeIt(className: string, methodName: string, timerInMs: number): void;
}
