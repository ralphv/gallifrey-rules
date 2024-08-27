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
import {
    ScheduledEventRequest,
    ScheduledEventIDResponse,
    ScheduledEventResponse,
    ScheduledEventQuery,
} from '../interfaces/Providers/ScheduledEventsInterface';
import GetScheduledEventContextDelegate from '../delegates-interfaces/GetScheduledEventContextDelegate';
import { EngineEventContext } from './EngineEventContext';
import ScheduledEventsDelegates from '../delegates-interfaces/InsertScheduledEventDelegate';

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
        private scheduledEventsDelegates: ScheduledEventsDelegates,
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

    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventIDResponse> {
        return this.scheduledEventsDelegates.insertScheduledEvent(event, scheduleAt);
    }

    isScheduledEvent(): boolean {
        return this.scheduledEventsDelegates.isScheduledEvent();
    }

    insertEvent(event: ScheduledEventRequest): Promise<ScheduledEventIDResponse> {
        return this.scheduledEventsDelegates.insertScheduledEvent(event, undefined);
    }

    deleteScheduledEvent(scheduledEventID: string): Promise<boolean> {
        return this.scheduledEventsDelegates.deleteScheduledEvent(scheduledEventID);
    }

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined> {
        return this.scheduledEventsDelegates.getScheduledEvent(scheduledEventID);
    }

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]> {
        return this.scheduledEventsDelegates.queryScheduledEvents(query);
    }
}
