/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { GallifreyEventTypeInternal } from '../../lib/GallifreyEventTypeInternal';
export default interface ScheduledEventsInterface extends ModuleInterface {
    insertScheduledEvent(event: ScheduledEventRequest, triggeredBy: TriggeredByEvent, scheduleAt: Date, scheduledCount: number): Promise<ScheduledEventResponse>;
}
export interface ScheduledEventRequest extends Omit<GallifreyEventTypeInternal<any>, 'eventLag'> {
}
export interface ScheduledEventResponse {
    scheduledEventID: string;
}
export declare class __ScheduledEventsInterface implements ScheduledEventsInterface {
    getModuleName(): string;
    insertScheduledEvent(event: ScheduledEventRequest, triggeredBy: TriggeredByEvent, scheduleAt: Date, scheduledCount: number): Promise<ScheduledEventResponse>;
}
export interface TriggeredByEvent {
    namespace: string;
    entityName: string;
    eventName: string;
    eventID: string;
    source: string;
}
