/**
 * author: Ralph Varjabedian
 */
import EngineEventInterface from './EngineEventInterface';
import { BaseDataObjectRequest, BaseDataObjectResponse, BaseEventPayload } from '../base-interfaces/BaseTypes';

/**
 * Passed to rules
 */
export default interface EngineFilterInterface<EventPayloadType extends BaseEventPayload> extends EngineEventInterface {
    /**
     * Gets the event payload or data, accessible to rules only
     */
    getEventPayload(): EventPayloadType;

    pullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(
        dataObjectName: string,
        request?: DataObjectRequestType,
    ): Promise<DataObjectResponseType>;
}
