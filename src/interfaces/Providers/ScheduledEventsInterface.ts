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
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventResponse>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScheduledEventRequest
    extends Omit<GallifreyEventTypeInternal<any>, 'eventLag' | 'namespace' | 'source'> {
    namespace?: string;
    source?: string;
}

export interface CompleteScheduledEventRequest extends ScheduledEventRequest {
    namespace: string;
    source: string;
}

export interface ScheduledEventResponse {
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
    ): Promise<ScheduledEventResponse> {
        return Promise.reject('un-callable code');
    }
}

export interface TriggeredByEvent {
    namespace: string;
    entityName: string;
    eventName: string;
    eventID: string;
    source: string;
}
