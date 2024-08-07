-- postgres
WITH inserted AS (
    INSERT INTO scheduled_events (
                                  scheduled_event_id, createdAt, scheduledAt,
                                  triggeredBy_namespace, triggeredBy_entityName, triggeredBy_eventName,
                                  triggeredBy_eventID, triggeredBy_source, event_namespace,
                                  event_entityName, event_eventName, event_eventID, event_payload,
                                  scheduled_count, pulledAt
        )
        SELECT
            sel.scheduled_event_id, sel.createdAt, sel.scheduledAt,
            sel.triggeredBy_namespace, sel.triggeredBy_entityName, sel.triggeredBy_eventName,
            sel.triggeredBy_eventID, sel.triggeredBy_source, sel.event_namespace,
            sel.event_entityName, sel.event_eventName, sel.event_eventID, sel.event_payload,
            sel.scheduled_count, NOW()
        FROM
            scheduled_events_landing sel
                LEFT JOIN
            scheduled_events se ON sel.scheduled_event_id = se.scheduled_event_id
        WHERE
            sel.scheduledAt <= NOW() AND
            se.scheduled_event_id IS NULL
        RETURNING scheduled_event_id
),
     deleted AS (
         DELETE FROM scheduled_events_landing
             WHERE scheduled_event_id IN (SELECT scheduled_event_id FROM inserted)
     )
SELECT * FROM scheduled_events;





-- sample insert
INSERT INTO scheduled_events_landing (
    createdAt, scheduledAt,
    triggeredBy_namespace, triggeredBy_entityName, triggeredBy_eventName,
    triggeredBy_eventID, triggeredBy_source, event_namespace,
    event_entityName, event_eventName, event_eventID, event_payload,
    scheduled_count
) VALUES (
             NOW(),  -- createdAt: current timestamp
             NOW() + INTERVAL '5 minutes',  -- scheduledAt: 5 minutes in the future
             'namespace_example',  -- triggeredBy_namespace
             'entityName_example',  -- triggeredBy_entityName
             'eventName_example',  -- triggeredBy_eventName
             'eventID_example',  -- triggeredBy_eventID
             'source_example',  -- triggeredBy_source
             'event_namespace_example',  -- event_namespace
             'event_entityName_example',  -- event_entityName
             'event_eventName_example',  -- event_eventName
             'event_eventID_example',  -- event_eventID
             '{"key": "value"}',  -- event_payload: JSON data as a string
             1  -- scheduled_count: example integer value
         );
