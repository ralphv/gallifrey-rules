import { BaseEventPayload } from '../base-interfaces/BaseTypes';
import { EachMessagePayload } from 'kafkajs';
import { GallifreyEventType } from '../GallifreyEventType';
import { ScheduledEventType } from '../engine-events/ScheduledEventType';
export default interface AfterHandleEventDelegate<EventPayloadType extends BaseEventPayload> {
    (messagePayload: EachMessagePayload, event: GallifreyEventType<EventPayloadType> | ScheduledEventType): Promise<void>;
}
