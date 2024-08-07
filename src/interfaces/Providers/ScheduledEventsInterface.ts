/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { GallifreyEventTypeInternal } from '../../lib/GallifreyEventTypeInternal';

export default interface ScheduledEventsInterface extends ModuleInterface {
    insertScheduledEvent(
        event: ScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventResponse>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ScheduledEventRequest extends Omit<GallifreyEventTypeInternal<any>, 'eventLag'> {
    //triggeredBy: EngineEventContextInterface; added by engine
    //triggeredByPayload?: any; // not sure if we want to have it, the end user can include whatever is needed so decisions must not be made on old data
}

export interface ScheduledEventResponse {
    scheduledEventID: string;
}

export class __ScheduledEventsInterface implements ScheduledEventsInterface {
    getModuleName(): string {
        return '';
    }

    insertScheduledEvent(
        event: ScheduledEventRequest,
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
