import EngineRuleInterface from '../engine-interfaces/EngineRuleInterface';
import { BaseDataObjectRequest, BaseDataObjectResponse } from '../base-interfaces/BaseTypes';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import DoActionDelegate from '../delegates-interfaces/DoActionDelegate';
import PullDataObjectDelegate from '../delegates-interfaces/PullDataObjectDelegate';
import EngineBase from './EngineBase';
import PerformanceTimer from './PerformanceTimer';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import EngineScheduledEventContextInterface from '../engine-interfaces/EngineScheduledEventContextInterface';
import { ScheduledEventRequest, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';
import GetScheduledEventContextDelegate from '../delegates-interfaces/GetScheduledEventContextDelegate';
import InsertScheduledEventDelegate from '../delegates-interfaces/InsertScheduledEventDelegate';
import IsScheduledEventDelegate from '../delegates-interfaces/IsScheduledEventDelegate';
import { EngineEventContext } from './EngineEventContext';

export default class EngineRule extends EngineBase implements EngineRuleInterface<any> {
    private readonly timer: PerformanceTimer;
    constructor(
        configurationAccessor: ConfigurationAccessorInterface,
        engineEventContext: EngineEventContext,
        private readonly doActionDelegate: DoActionDelegate,
        private readonly pullDataObjectDelegate: PullDataObjectDelegate,
        loggerName: string,
        private readonly eventPayload: any,
        journalLogger: JournalLoggerInterface,
        getMetricsPointDelegate: GetMetricsPointDelegate,
        private getScheduledEventContextDelegate: GetScheduledEventContextDelegate,
        private insertScheduledEventDelegate: InsertScheduledEventDelegate,
        private isScheduledEventDelegate: IsScheduledEventDelegate,
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

    async doAction<ActionPayloadType>(actionName: string, payload: ActionPayloadType) {
        try {
            this.timer.pause(); // running parallel actions (Promise.All) will result in inaccurate rule timers
            return await this.doActionDelegate(actionName, payload);
        } finally {
            this.timer.resume();
        }
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

    getEventPayload(): any {
        return this.eventPayload;
    }

    getScheduledEventContext(): EngineScheduledEventContextInterface | undefined {
        return this.getScheduledEventContextDelegate();
    }

    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventResponse> {
        return this.insertScheduledEventDelegate(event, scheduleAt);
    }

    isScheduledEvent(): boolean {
        return this.isScheduledEventDelegate();
    }
}
