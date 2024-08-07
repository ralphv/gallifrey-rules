"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = void 0;
exports.schemas = {
    scheduled_events_landing: `
        CREATE TABLE IF NOT EXISTS scheduled_events_landing
        (
            scheduled_event_id     SERIAL PRIMARY KEY,
            createdAt              TIMESTAMP    NOT NULL,
            scheduledAt            TIMESTAMP    NOT NULL,
            triggeredBy_namespace  VARCHAR(100) NOT NULL,
            triggeredBy_entityName VARCHAR(100) NOT NULL,
            triggeredBy_eventName  VARCHAR(100) NOT NULL,
            triggeredBy_eventID    VARCHAR(100) NOT NULL,
            triggeredBy_source     VARCHAR(100) NOT NULL,
            event_namespace        VARCHAR(100) NOT NULL,
            event_entityName       VARCHAR(100) NOT NULL,
            event_eventName        VARCHAR(100) NOT NULL,
            event_eventID          VARCHAR(100) NOT NULL,
            event_payload          VARCHAR      NOT NULL,
            scheduled_count        INT          NOT NULL
        );
        CREATE INDEX idx_scheduledAt ON scheduled_events_landing (scheduledAt ASC);
    `,
    scheduled_events: `
        CREATE TABLE IF NOT EXISTS scheduled_events
        (
            id                     SERIAL PRIMARY KEY,
            scheduled_event_id     INT NOT NULL,
            createdAt              TIMESTAMP    NOT NULL,
            scheduledAt            TIMESTAMP    NOT NULL,
            pulledAt               TIMESTAMP    NOT NULL,
            triggeredBy_namespace  VARCHAR(100) NOT NULL,
            triggeredBy_entityName VARCHAR(100) NOT NULL,
            triggeredBy_eventName  VARCHAR(100) NOT NULL,
            triggeredBy_eventID    VARCHAR(100) NOT NULL,
            triggeredBy_source     VARCHAR(100) NOT NULL,
            event_namespace        VARCHAR(100) NOT NULL,
            event_entityName       VARCHAR(100) NOT NULL,
            event_eventName        VARCHAR(100) NOT NULL,
            event_eventID          VARCHAR(100) NOT NULL,
            event_payload          VARCHAR      NOT NULL,
            scheduled_count        INT          NOT NULL
        );
        CREATE INDEX idx_scheduled_event_id ON scheduled_events(scheduled_event_id);
    `,
};
