import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineBase from './EngineBase';
import PerformanceTimer from './PerformanceTimer';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import { EngineFilterInterface } from '../engine-interfaces';
import { BaseDataObjectRequest, BaseDataObjectResponse } from '../base-interfaces/BaseTypes';
import PullDataObjectDelegate from '../delegates-interfaces/PullDataObjectDelegate';
import { EngineEventContext } from './EngineEventContext';

export default class EngineFilter extends EngineBase implements EngineFilterInterface<any> {
    private readonly timer: PerformanceTimer;
    constructor(
        configurationAccessor: ConfigurationAccessorInterface,
        engineEventContext: EngineEventContext,
        loggerName: string,
        private readonly eventPayload: any,
        journalLogger: JournalLoggerInterface,
        getMetricsPointDelegate: GetMetricsPointDelegate,
        private readonly pullDataObjectDelegate: PullDataObjectDelegate,
    ) {
        super(
            engineEventContext,
            engineEventContext,
            configurationAccessor,
            loggerName,
            journalLogger,
            getMetricsPointDelegate,
        );
        this.timer = new PerformanceTimer();
    }

    getTimer() {
        return this.timer;
    }

    getEventPayload(): any {
        return this.eventPayload;
    }

    async pullDataObject<
        DataObjectRequestType extends BaseDataObjectRequest,
        DataObjectResponseType extends BaseDataObjectResponse,
    >(dataObjectName: string, request: DataObjectRequestType): Promise<DataObjectResponseType> {
        try {
            this.timer.pause();
            return await this.pullDataObjectDelegate(dataObjectName, request);
        } finally {
            this.timer.resume();
        }
    }
}
