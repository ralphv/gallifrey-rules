"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeScheduledEventType = IsTypeScheduledEventType;
exports.getScheduledEventTypeFromDBType = getScheduledEventTypeFromDBType;
const BasicTypeGuards_1 = require("../BasicTypeGuards");
function IsTypeScheduledEventType(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value !== null && value !== undefined && (0, BasicTypeGuards_1.IsObject)(value.event) && (0, BasicTypeGuards_1.IsObject)(value.meta);
}
function getScheduledEventTypeFromDBType(value, source) {
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
