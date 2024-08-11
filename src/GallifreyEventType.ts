import { BaseEventPayload } from './base-interfaces/BaseTypes';
import { IsNumber, IsObject, IsString } from './BasicTypeGuards';

export type GallifreyEventType<EventPayloadType extends BaseEventPayload> = {
    /**
     * The entityName, identifies the type or category of data represented by the event.
     * Think of the entityName as analogous to the name of a table in a relational database.
     * Just as a table groups similar records (like orders, customers, or suppliers),
     * the entityName field tells us what kind of data this event pertains to.
     * For example:
     *
     * An event with entityName: "orders" would be related to order data.
     * An event with entityName: "customers" would be related to customer data.
     * An event with entityName: "suppliers" would be related to supplier data.
     */
    entityName: string;
    /**
     * The name given to the event
     */
    eventName: string;
    /**
     * The ID of this event
     */
    eventId: string;
    /**
     * The payload that comes with this event
     */
    payload: EventPayloadType;
    /**
     * The source of the event, usually a container or hostname
     */
    source: string;
    /**
     * The event lag of this event. This is usually calculated by checking the difference between the time
     * the kafka message was added to the topic until the time it made it to the consumer.
     * The eventLag is in milliseconds. But its up to the developer to choose a different unit if appropriate.
     * This value is taken as is and fed to the Metrics.
     */
    eventLag: number;
};

export function IsTypeGallifreyEventType(value: any): value is GallifreyEventType<any> {
    const t = value as GallifreyEventType<any>;
    return (
        IsString(t.entityName) &&
        IsString(t.eventName) &&
        IsString(t.eventId) &&
        IsObject(t.payload) &&
        IsString(t.source) &&
        IsNumber(t.eventLag)
    );
}
