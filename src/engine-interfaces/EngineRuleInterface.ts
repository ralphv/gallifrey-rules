/**
 * author: Ralph Varjabedian
 */
import EngineEventInterface from './EngineEventInterface';
import {
    BaseActionPayload,
    BaseActionResponse,
    BaseDataObjectRequest,
    BaseDataObjectResponse,
    BaseEventPayload,
} from '../base-interfaces/BaseTypes';
import EngineScheduledEventsAccessInterface from './EngineScheduledEventsAccessInterface';
import EngineRule from '../lib/EngineRule';

/**
 * Passed to rules
 */
export default interface EngineRuleInterface<EventPayloadType extends BaseEventPayload>
    extends EngineEventInterface, ExtendEngineRuleInterface,
        EngineScheduledEventsAccessInterface {
    /**
     * Gets the event payload or data, accessible to rules only
     */
    getEventPayload(): EventPayloadType;

    doAction<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse>(
        actionName: string,
        payload: ActionPayloadType,
    ): Promise<ActionResponseType>;

    pullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(
        dataObjectName: string,
        request?: DataObjectRequestType,
    ): Promise<DataObjectResponseType>;
}

export interface ExtendEngineRuleInterface {
    doAction<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse>(
        actionName: string,
        payload: ActionPayloadType,
    ): Promise<ActionResponseType>;
}

export function ExtendEngineRuleInterfaceHelper(methods: {[key:string]: (...args: any[]) => any}) {
    Object.entries(methods).forEach(([methodName, method]) => {
        // @ts-ignore
        EngineRule.prototype[methodName] = method;
    });
}