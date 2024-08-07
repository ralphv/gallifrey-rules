/**
 * author: Ralph Varjabedian
 */
import EngineActionInterface from '../../engine-interfaces/EngineActionInterface';
import { BaseActionPayload, BaseActionResponse } from '../../base-interfaces/BaseTypes';
import ActionInterface from './ActionInterface';
/**
 * To support async actions
 */
export default interface AsyncActionInterface<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse> extends ActionInterface<ActionPayloadType, ActionResponseType> {
    /**
     * Asks the action if it wants to defer this current trigger to be async, this is called
     * right before the trigger method
     * @param engine
     */
    queueAsAsync?(engine: EngineActionInterface<ActionPayloadType>): Promise<boolean>;
}
export declare class __AsyncActionInterface implements AsyncActionInterface<any, any> {
    getModuleName(): string;
    trigger(engine: EngineActionInterface<any>): Promise<any>;
}
