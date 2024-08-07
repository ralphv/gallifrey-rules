import { ScheduledEventRequest, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';

export default interface InsertScheduledEventDelegate {
    (event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventResponse>;
}
