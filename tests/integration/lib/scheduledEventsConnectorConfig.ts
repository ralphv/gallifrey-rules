// connectorConfig.ts
export const scheduledEventsConnectorConfig = {
    name: 'gallifrey-rules-scheduled-events-connector',
    config: {
        'connector.class': 'io.confluent.connect.jdbc.JdbcSourceConnector',
        'connection.url': 'jdbc:postgresql://postgres:5432/postgres',
        'connection.user': 'postgres',
        'connection.password': '1q2w3e4r5t6y',
        mode: 'incrementing',
        'incrementing.column.name': 'id',
        query: 'WITH inserted AS (INSERT INTO scheduled_events (scheduled_event_id, createdAt, scheduledAt, triggeredBy_namespace, triggeredBy_entityName, triggeredBy_eventName, triggeredBy_eventID, triggeredBy_source, event_namespace, event_entityName, event_eventName, event_eventID, event_payload, scheduled_count, pulledAt) SELECT sel.scheduled_event_id, sel.createdAt, sel.scheduledAt, sel.triggeredBy_namespace, sel.triggeredBy_entityName, sel.triggeredBy_eventName, sel.triggeredBy_eventID, sel.triggeredBy_source, sel.event_namespace, sel.event_entityName, sel.event_eventName, sel.event_eventID, sel.event_payload, sel.scheduled_count, NOW() FROM scheduled_events_landing sel LEFT JOIN scheduled_events se ON sel.scheduled_event_id = se.scheduled_event_id WHERE sel.scheduledAt <= NOW() AND se.scheduled_event_id IS NULL RETURNING scheduled_event_id), deleted AS (DELETE FROM scheduled_events_landing WHERE scheduled_event_id IN (SELECT scheduled_event_id FROM inserted)) SELECT * FROM scheduled_events',
        'topic.prefix': 'gallifrey-rules-scheduled-events',
        'poll.interval.ms': '5000',
        'tasks.max': '1',
    },
};
