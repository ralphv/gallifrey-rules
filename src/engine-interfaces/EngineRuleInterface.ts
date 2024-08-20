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

/**
 * Passed to rules
 */
export default interface EngineRuleInterface<EventPayloadType extends BaseEventPayload>
    extends EngineEventInterface,
        EngineScheduledEventsAccessInterface {
    /**
     * Gets the event payload or data, accessible to rules only
     */
    getEventPayload(): EventPayloadType;

    /**
     * Executes an action
     * @param actionName The action name
     * @param payload The payload of the action
     */
    doAction<ActionPayloadType extends BaseActionPayload, ActionResponseType extends BaseActionResponse>(
        actionName: string,
        payload: ActionPayloadType,
    ): Promise<ActionResponseType>;

    /**
     * Pulls a Data Object
     * @param dataObjectName The data object name
     * @param request The request
     */
    pullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(
        dataObjectName: string,
        request?: DataObjectRequestType,
    ): Promise<DataObjectResponseType>;
}
