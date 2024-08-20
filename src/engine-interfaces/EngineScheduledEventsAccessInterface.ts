import { ScheduledEventRequest, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';
import EngineScheduledEventContextInterface from './EngineScheduledEventContextInterface';

/**
 * This sub interface gives access to scheduled events services
 */
export default interface EngineScheduledEventsAccessInterface {
    /**
     * Inserts a future scheduled events to the events pipeline
     * @param event The event
     * @param scheduleAt The date/time to be scheduled at
     */
    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventResponse>;

    /**
     * Inserts an immediate event to the events pipeline to be run as soon as possible
     * @param event The event
     */
    insertEvent(event: ScheduledEventRequest): Promise<ScheduledEventResponse>;

    /**
     * Was this event currently processing a scheduled event?
     */
    isScheduledEvent(): boolean;

    /**
     * Gets information about the scheduled event
     */
    getScheduledEventContext(): EngineScheduledEventContextInterface | undefined;
}
