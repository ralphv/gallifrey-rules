/**
 * This is the payload that we get from a scheduled event topic
 * This comes from the kafka connect format
 */
export type DBConnectorScheduledEventType = {
    schema: any;
    payload: {
        id: number;
        scheduled_event_id: number;
        createdat: number;
        scheduledat: number;
        triggeredby_namespace: string;
        triggeredby_entityname: string;
        triggeredby_eventname: string;
        triggeredby_eventid: string;
        triggeredby_source: string;
        event_namespace: string;
        event_entityname: string;
        event_eventname: string;
        event_eventid: string;
        event_payload: string;
        scheduled_count: number;
    };
};
export declare function IsTypeDBConnectorScheduledEventType(value: any): value is DBConnectorScheduledEventType;
