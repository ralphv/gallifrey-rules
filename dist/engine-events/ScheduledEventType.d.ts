import { ScheduledEventRequest } from '../interfaces/Providers/ScheduledEventsInterface';
import { DBConnectorScheduledEventType } from './DBConnectorScheduledEventType';
/**
 * This is the payload that we use to represent internally
 */
export type ScheduledEventType = {
    event: ScheduledEventRequest;
    meta: {
        /**
         * the date when the scheduled event was requested to be inserted
         */
        createdAt: Date;
        /**
         * The date where the connector pulled the scheduled event from DB and into the topic, this and scheduledAt will produce the lag
         */
        pulledAt: Date;
        /**
         * the date where the scheduled event was requested to be scheduled at
         */
        scheduledAt: Date;
        triggeredBy: {
            namespace: string;
            entityName: string;
            eventName: string;
            eventID: string;
            source: string;
        };
        scheduledCount: number;
    };
};
export declare function IsTypeScheduledEventType(value: any): value is ScheduledEventType;
export declare function getScheduledEventTypeFromDBType(value: DBConnectorScheduledEventType, source: string): {
    event: {
        namespace: string;
        entityName: string;
        eventName: string;
        eventId: string;
        payload: any;
        source: string;
    };
    meta: {
        createdAt: Date;
        pulledAt: Date;
        scheduledAt: Date;
        triggeredBy: {
            namespace: string;
            entityName: string;
            eventName: string;
            eventID: string;
            source: string;
        };
        scheduledCount: number;
    };
};
