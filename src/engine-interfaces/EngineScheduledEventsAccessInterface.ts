import {
    ScheduledEventQuery,
    ScheduledEventRequest,
    ScheduledEventIDResponse,
    ScheduledEventResponse,
} from '../interfaces/Providers/ScheduledEventsInterface';
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
    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventIDResponse>;

    /**
     * Inserts an immediate event to the events pipeline to be run as soon as possible
     * @param event The event
     */
    insertEvent(event: ScheduledEventRequest): Promise<ScheduledEventIDResponse>;

    /**
     * Deletes a scheduled event as long as it hasn't been pulled
     * @param scheduledEventID the ID
     */
    deleteScheduledEvent(scheduledEventID: string): Promise<boolean>;

    /**
     * Gets a scheduled event details
     * @param scheduledEventID
     */
    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined>;

    /**
     * Query scheduled events
     * @param query
     */
    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]>;

    /**
     * Was this event currently processing a scheduled event?
     */
    isScheduledEvent(): boolean;

    /**
     * Gets information about the scheduled event
     */
    getScheduledEventContext(): EngineScheduledEventContextInterface | undefined;
}
