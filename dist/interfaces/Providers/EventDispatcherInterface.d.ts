/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { BaseEventPayload } from '../../base-interfaces/BaseTypes';
import { GallifreyEventType } from '../../GallifreyEventType';
export default interface EventDispatcherInterface<MessageType, EventPayloadType extends BaseEventPayload> extends ModuleInterface {
    getEvent(message: MessageType): GallifreyEventType<EventPayloadType>;
}
export declare class __EventDispatcherInterface implements EventDispatcherInterface<any, any> {
    getEvent(message: any): GallifreyEventType<any>;
    getModuleName(): string;
}
