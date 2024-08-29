/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { GallifreyEventTypeInternal } from '../../lib/GallifreyEventTypeInternal';

export default interface ScheduledEventsInterface extends ModuleInterface {
    insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date | undefined,
        scheduledCount: number,
    ): Promise<ScheduledEventIDResponse>;

    deleteScheduledEvent(scheduledEventID: string): Promise<boolean>;

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined>;

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]>;
}

export interface ScheduledEventRequest
    extends Omit<GallifreyEventTypeInternal<any>, 'eventLag' | 'namespace' | 'source'> {
    namespace?: string;
    source?: string;
}

export interface ScheduledEventQuery {
    namespace?: string;
    entityName: string;
    eventName: string;
    eventID: string;
}

export interface ScheduledEventResponse {
    scheduledEventID: string;
    namespace: string;
    entityName: string;
    eventName: string;
    eventID: string;
    payload: any;
}

export interface CompleteScheduledEventRequest extends ScheduledEventRequest {
    namespace: string;
    source: string;
}

export interface ScheduledEventIDResponse {
    scheduledEventID: string;
}

export class __ScheduledEventsInterface implements ScheduledEventsInterface {
    getModuleName(): string {
        return '';
    }

    insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventIDResponse> {
        return Promise.reject('un-callable code');
    }

    deleteScheduledEvent(scheduledEventID: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined> {
        return Promise.resolve(undefined);
    }

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]> {
        return Promise.resolve([]);
    }
}

export interface TriggeredByEvent {
    namespace: string;
    entityName: string;
    eventName: string;
    eventID: string;
    source: string;
}
