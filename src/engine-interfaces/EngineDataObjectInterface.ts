/**
 * author: Ralph Varjabedian
 */
import { BaseDataObjectRequest } from '../base-interfaces/BaseTypes';
import EngineInterface from './EngineInterface';

export default interface EngineDataObjectInterface<DataObjectRequestType extends BaseDataObjectRequest>
    extends EngineInterface {
    getRequest(): DataObjectRequestType;
    addResultIntoEventStore(value: any): void;
}
