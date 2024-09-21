import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { JournalLoggerInterface, TriggeredByEvent } from '../interfaces/Providers';
import { GallifreyEventTypeInternal } from '../lib/GallifreyEventTypeInternal';
import { CompleteScheduledEventRequest } from '../interfaces/Providers/ScheduledEventsInterface';

export type TestingJournalLoggerProviderMethods =
    | 'customLog'
    | 'dataObjectPulledFromEventStore'
    | 'endDoAction'
    | 'endEvent'
    | 'endFilter'
    | 'endPullDataObject'
    | 'endQueueAsyncAction'
    | 'endRunRule'
    | 'filterStoppedEvent'
    | 'startDoAction'
    | 'startFilter'
    | 'startEvent'
    | 'startPullDataObject'
    | 'startQueueAsyncAction'
    | 'startRunRule'
    | 'insertScheduledEvent';

export type TestingJournalLoggerProviderRecordType = {
    method: TestingJournalLoggerProviderMethods;
    description?: string;
    name?: string;
    extra?: any;
    request?: any;
    response?: any;
    duration?: number;
    error?: Error;
    payload?: any;
    event?: any;
    triggeredBy?: any;
    scheduleAt?: Date;
    scheduledCount?: number;
};

export interface TestingJournalLoggerProviderTestingMethods {
    getRecords(): TestingJournalLoggerProviderRecordType[];
    getRecordsCount(): number;
    getRecordsOf(method: TestingJournalLoggerProviderMethods | undefined): TestingJournalLoggerProviderRecordType[];
    getEventsCount(): number;
    getRulesCount(): number;
    getActionsCount(): number;
    hasError(error: string, method?: TestingJournalLoggerProviderMethods): boolean;
    hasCustomLog(description: string): boolean;
    hasScheduledEvent(entityName: string, eventName: string): boolean;
    getErrorsCount(): number;
    isActionRun(name: string): boolean;
    isActionFailed(name: string): boolean;
    isRuleRun(name: string): boolean;
    isRuleFailed(name: string): boolean;
    isEventRun(name: string): boolean;
    isEventFailed(name: string): boolean;
    isDataObjectPulled(name: string): boolean;
    isDataObjectFailed(name: string): boolean;
}

@GallifreyProvider(ProviderType.JournalLogger, true)
export default class TestingJournalLoggerProvider
    implements JournalLoggerInterface, TestingJournalLoggerProviderTestingMethods
{
    private records: TestingJournalLoggerProviderRecordType[] = [];

    // Testing Helper Methods Start
    public getRecords() {
        return this.records;
    }

    public getRecordsCount() {
        return this.records.length;
    }

    public getRecordsOf(method: TestingJournalLoggerProviderMethods | undefined) {
        return this.records.filter(({ method: a }) => method === undefined || a === method);
    }

    public getEventsCount() {
        return this.getRecordsOf('endEvent').length;
    }

    public getRulesCount() {
        return this.getRecordsOf('endRunRule').length;
    }

    public getActionsCount() {
        return this.getRecordsOf('endDoAction').length;
    }

    public hasError(error: string, method: TestingJournalLoggerProviderMethods | undefined = undefined) {
        return this.getRecordsOf(method).filter((a) => a.error !== undefined && String(a.error) === error).length > 0;
    }

    public hasCustomLog(description: string) {
        return this.getRecordsOf('customLog').filter((a) => a.description === description).length > 0;
    }

    public getErrorsCount() {
        return this.getRecords().filter((a) => a.error !== undefined).length;
    }

    public isActionRun(name: string) {
        return this.getRecordsOf('endDoAction').filter((a) => a.name === name).length !== 0;
    }

    public isActionFailed(name: string) {
        return this.getRecordsOf('endDoAction').filter((a) => a.name === name && a.error !== undefined).length !== 0;
    }

    public isRuleRun(name: string) {
        return this.getRecordsOf('endRunRule').filter((a) => a.name === name).length !== 0;
    }

    public isRuleFailed(name: string) {
        return this.getRecordsOf('endRunRule').filter((a) => a.name === name && a.error !== undefined).length !== 0;
    }

    public isEventRun(name: string) {
        return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.getRecordsOf('startEvent').filter((a) => a?.event?.eventName === name).length !== 0 &&
            this.getRecordsOf('endEvent').length !== 0
        );
    }

    public isEventFailed(name: string) {
        return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.getRecordsOf('startEvent').filter((a) => a?.event?.eventName === name).length !== 0 &&
            this.getRecordsOf('endEvent').filter((a) => a.error !== undefined).length !== 0
        );
    }

    public isDataObjectPulled(name: string) {
        return this.getRecordsOf('endPullDataObject').filter((a) => a.name === name).length !== 0;
    }

    public isDataObjectFailed(name: string) {
        return (
            this.getRecordsOf('endPullDataObject').filter((a) => a.name === name && a.error !== undefined).length !== 0
        );
    }
    // Testing Helper Methods End

    customLog(description: string, extra: any): void {
        this.records.push({ method: 'customLog', description, extra });
    }

    dataObjectPulledFromEventStore(name: string, request: any): void {
        this.records.push({ method: 'dataObjectPulledFromEventStore', name, request });
    }

    endDoAction(name: string, response: any, duration: number, error?: Error): void {
        this.records.push({ method: 'endDoAction', name, response, duration, error });
    }

    endEvent(duration: number, error?: Error): void {
        this.records.push({ method: 'endEvent', duration, error });
    }

    endFilter(name: string, duration: number, error?: Error): void {
        this.records.push({ method: 'endFilter', name, duration, error });
    }

    endPullDataObject(name: string, response: any, duration: number, error?: Error): void {
        this.records.push({ method: 'endPullDataObject', name, response, duration, error });
    }

    endQueueAsyncAction(name: string, duration: number, error?: Error): void {
        this.records.push({ method: 'endQueueAsyncAction', name, duration, error });
    }

    endRunRule(name: string, duration: number, error?: Error): void {
        this.records.push({ method: 'endRunRule', name, duration, error });
    }

    filterStoppedEvent(name: string, duration: number): void {
        this.records.push({ method: 'filterStoppedEvent', name, duration });
    }

    startDoAction(name: string, payload: any): void {
        this.records.push({ method: 'startDoAction', name, payload });
    }

    startEvent(event: GallifreyEventTypeInternal<any>): void {
        this.records.push({ method: 'startEvent', event });
    }

    startFilter(name: string): void {
        this.records.push({ method: 'startFilter', name });
    }

    startPullDataObject(name: string, request: any): void {
        this.records.push({ method: 'startPullDataObject', name, request });
    }

    startQueueAsyncAction(name: string, payload: any): void {
        this.records.push({ method: 'startQueueAsyncAction', name, payload });
    }

    startRunRule(name: string): void {
        this.records.push({ method: 'startRunRule', name });
    }

    insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): void {
        this.records.push({
            method: 'insertScheduledEvent',
            event,
            triggeredBy,
            scheduleAt,
            scheduledCount,
        });
    }

    hasScheduledEvent(entityName: string, eventName: string): boolean {
        return (
            this.getRecordsOf('insertScheduledEvent').filter(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                (a) => a.event?.entityName === entityName && a.event?.eventName === eventName,
            ).length > 0
        );
    }
}
