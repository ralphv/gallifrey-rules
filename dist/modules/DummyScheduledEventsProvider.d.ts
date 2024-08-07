import { ScheduledEventsInterface } from '../interfaces/Providers';
import { ScheduledEventRequest, ScheduledEventResponse, TriggeredByEvent } from '../interfaces/Providers/ScheduledEventsInterface';
export default class DummyScheduledEventsProvider implements ScheduledEventsInterface {
    getModuleName(): string;
    insertScheduledEvent(event: ScheduledEventRequest, triggeredBy: TriggeredByEvent, scheduleAt: Date, scheduledCount: number): Promise<ScheduledEventResponse>;
}
