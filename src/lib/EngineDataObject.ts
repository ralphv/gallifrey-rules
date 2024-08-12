import { BaseDataObjectRequest } from '../base-interfaces/BaseTypes';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineBase from './EngineBase';
import { EngineDataObjectInterface } from '../engine-interfaces';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import AddResultsIntoEventStoreDelegate from '../delegates-interfaces/AddResultsIntoEventStoreDelegate';
import { EngineEventContext } from './EngineEventContext';

export default class EngineDataObject<DataObjectRequestType extends BaseDataObjectRequest>
    extends EngineBase
    implements EngineDataObjectInterface<DataObjectRequestType>
{
    constructor(
        configurationAccessor: ConfigurationAccessorInterface,
        engineEventContext: EngineEventContext,
        loggerName: string,
        private request: DataObjectRequestType,
        journalLogger: JournalLoggerInterface,
        getMetricsPointDelegate: GetMetricsPointDelegate,
        private addResultsIntoEventStoreDelegate: AddResultsIntoEventStoreDelegate,
    ) {
        super(
            engineEventContext,
            engineEventContext,
            configurationAccessor,
            loggerName,
            journalLogger,
            getMetricsPointDelegate,
        );
    }

    getRequest(): DataObjectRequestType {
        return this.request;
    }

    addResultIntoEventStore(value: any) {
        this.addResultsIntoEventStoreDelegate(value);
    }
}
