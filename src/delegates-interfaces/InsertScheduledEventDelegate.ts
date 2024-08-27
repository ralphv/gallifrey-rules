import { ScheduledEventRequest, ScheduledEventIDResponse } from '../interfaces/Providers';
import { ScheduledEventQuery, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';

export default interface ScheduledEventsDelegates {
    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date | undefined): Promise<ScheduledEventIDResponse>;
    isScheduledEvent(): boolean;

    deleteScheduledEvent(scheduledEventID: string): Promise<boolean>;

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined>;

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]>;
}
