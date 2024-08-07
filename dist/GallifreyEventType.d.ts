import { BaseEventPayload } from './base-interfaces/BaseTypes';
export type GallifreyEventType<EventPayloadType extends BaseEventPayload> = {
    entityName: string;
    eventName: string;
    eventId: string;
    payload: EventPayloadType;
    source: string;
    eventLag: number;
};
export declare function IsTypeGallifreyEventType(value: any): value is GallifreyEventType<any>;
