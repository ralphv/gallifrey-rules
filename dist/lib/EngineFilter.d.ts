import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import EngineBase from './EngineBase';
import PerformanceTimer from './PerformanceTimer';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import { EngineFilterInterface } from '../engine-interfaces';
import { BaseDataObjectRequest, BaseDataObjectResponse } from '../base-interfaces/BaseTypes';
import PullDataObjectDelegate from '../delegates-interfaces/PullDataObjectDelegate';
export default class EngineFilter extends EngineBase implements EngineFilterInterface<any> {
    private readonly eventPayload;
    private readonly pullDataObjectDelegate;
    private readonly timer;
    constructor(configurationAccessor: ConfigurationAccessorInterface, engineEventContext: EngineEventContextInterface, loggerName: string, eventPayload: any, journalLogger: JournalLoggerInterface, getMetricsPointDelegate: GetMetricsPointDelegate, pullDataObjectDelegate: PullDataObjectDelegate);
    getTimer(): PerformanceTimer;
    getEventPayload(): any;
    pullDataObject<DataObjectRequestType extends BaseDataObjectRequest, DataObjectResponseType extends BaseDataObjectResponse>(dataObjectName: string, request: DataObjectRequestType): Promise<DataObjectResponseType>;
}
