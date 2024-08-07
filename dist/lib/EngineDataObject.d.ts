import { BaseDataObjectRequest } from '../base-interfaces/BaseTypes';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import EngineBase from './EngineBase';
import { EngineDataObjectInterface } from '../engine-interfaces';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import AddResultsIntoEventStoreDelegate from '../delegates-interfaces/AddResultsIntoEventStoreDelegate';
export default class EngineDataObject<DataObjectRequestType extends BaseDataObjectRequest> extends EngineBase implements EngineDataObjectInterface<DataObjectRequestType> {
    private request;
    private addResultsIntoEventStoreDelegate;
    constructor(configurationAccessor: ConfigurationAccessorInterface, engineEventContext: EngineEventContextInterface, loggerName: string, request: DataObjectRequestType, journalLogger: JournalLoggerInterface, getMetricsPointDelegate: GetMetricsPointDelegate, addResultsIntoEventStoreDelegate: AddResultsIntoEventStoreDelegate);
    getRequest(): DataObjectRequestType;
    addResultIntoEventStore(value: any): void;
}
