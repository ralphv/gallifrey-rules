/**
 * author: Ralph Varjabedian
 */
import { BaseDataObjectRequest } from '../base-interfaces/BaseTypes';
import EngineInterface from './EngineInterface';

export default interface EngineDataObjectInterface<DataObjectRequestType extends BaseDataObjectRequest>
    extends EngineInterface {
    /**
     * Gets the request payload passed to the data object
     */
    getRequest(): DataObjectRequestType;

    /**
     * Adds the result into the event store, caching its value for the lifetime of the event
     * @param value The value to cache for the current request
     */
    addResultIntoEventStore(value: any): void;
}
