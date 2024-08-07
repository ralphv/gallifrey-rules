import { BaseEventPayload } from './base-interfaces/BaseTypes';
import { IsNumber, IsObject, IsString } from './BasicTypeGuards';

export type GallifreyEventType<EventPayloadType extends BaseEventPayload> = {
    entityName: string;
    eventName: string;
    eventId: string;
    payload: EventPayloadType;
    source: string;
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
