/**
 * author: Ralph Varjabedian
 */
import EngineActionInterface from '../../engine-interfaces/EngineActionInterface';
import { BaseActionPayload, BaseActionResponse } from '../../base-interfaces/BaseTypes';
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EnabledInterface from '../../base-interfaces/EnabledInterface';
/**
 * The Actions trigger parameters should be fully encapsulated within the payload.
 * Actions can not have data context outside the payload.
 * Actions should not pull any extra data from external sources.
 */
export default interface ActionInterface<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse> extends ModuleInterface, EnabledInterface {
    trigger(engine: EngineActionInterface<ActionPayloadType>): Promise<ActionResponseType>;
}
export declare class __ActionInterface implements ActionInterface<any, any> {
    getModuleName(): string;
    trigger(engine: EngineActionInterface<any>): Promise<any>;
}
