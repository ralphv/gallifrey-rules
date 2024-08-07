import { ScheduledEventRequest, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';
import EngineScheduledEventContextInterface from './EngineScheduledEventContextInterface';

/**
 * This sub interface gives access to scheduled events services
 */
export default interface EngineScheduledEventsAccessInterface {
    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventResponse>;
    isScheduledEvent(): boolean; // was this triggered by a scheduled event?
    getScheduledEventContext(): EngineScheduledEventContextInterface | undefined;
}
