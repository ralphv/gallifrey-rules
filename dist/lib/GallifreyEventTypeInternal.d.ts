import { BaseEventPayload } from '../base-interfaces/BaseTypes';
import { GallifreyEventType } from '../GallifreyEventType';
export type GallifreyEventTypeInternal<EventPayloadType extends BaseEventPayload> = GallifreyEventType<EventPayloadType> & {
    namespace: string;
};
