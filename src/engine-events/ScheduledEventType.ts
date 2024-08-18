import { CompleteScheduledEventRequest } from '../interfaces/Providers/ScheduledEventsInterface';
import { IsObject } from '../BasicTypeGuards';
import { DBConnectorScheduledEventType } from './DBConnectorScheduledEventType';

/**
 * This is the payload that we use to represent internally
 */
export type ScheduledEventType = {
    event: CompleteScheduledEventRequest;
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

export function IsTypeScheduledEventType(value: any): value is ScheduledEventType {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value !== null && value !== undefined && IsObject(value.event) && IsObject(value.meta);
}

export function getScheduledEventTypeFromDBType(value: DBConnectorScheduledEventType, source: string) {
    return {
        event: {
            namespace: value.payload.event_namespace,
            entityName: value.payload.event_entityname,
            eventName: value.payload.event_eventname,
            eventId: value.payload.event_eventid,
            payload: JSON.parse(value.payload.event_payload),
            source,
        },
        meta: {
            id: value.payload.id,
            scheduled_event_id: value.payload.scheduled_event_id,
            createdAt: new Date(value.payload.createdat),
            pulledAt: new Date(), //todo, add to db new column
            scheduledAt: new Date(value.payload.scheduledat),
            triggeredBy: {
                namespace: value.payload.triggeredby_namespace,
                entityName: value.payload.triggeredby_entityname,
                eventName: value.payload.triggeredby_eventname,
                eventID: value.payload.triggeredby_eventid,
                source: value.payload.triggeredby_source,
            },
            scheduledCount: value.payload.scheduled_count,
        },
    };
}
