/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { BaseEventPayload } from '../../base-interfaces/BaseTypes';
import { GallifreyEventType } from '../../GallifreyEventType';

export default interface EventDispatcherInterface<MessageType, EventPayloadType extends BaseEventPayload>
    extends ModuleInterface {
    /**
     * Take a Kafka Message from the topic and return it as a Gallifrey Event Type
     * @param message Kafka message
     */
    getEvent(message: MessageType): GallifreyEventType<EventPayloadType>;
}

export class __EventDispatcherInterface implements EventDispatcherInterface<any, any> {
    getEvent(message: any): GallifreyEventType<any> {
        throw new Error(`undefined`);
    }

    getModuleName(): string {
        return '';
    }
}
