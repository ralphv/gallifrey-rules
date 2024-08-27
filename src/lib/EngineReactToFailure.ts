import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineBase from './EngineBase';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import EngineScheduledEventContextInterface from '../engine-interfaces/EngineScheduledEventContextInterface';
import { ScheduledEventRequest, ScheduledEventIDResponse } from '../interfaces/Providers';
import GetScheduledEventContextDelegate from '../delegates-interfaces/GetScheduledEventContextDelegate';
import EngineReactToFailureInterface from '../engine-interfaces/EngineReactToFailureInterface';
import { EngineEventContext } from './EngineEventContext';
import ScheduledEventsDelegates from '../delegates-interfaces/InsertScheduledEventDelegate';
import { ScheduledEventQuery, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';

export default class EngineReactToFailure extends EngineBase implements EngineReactToFailureInterface {
    constructor(
        configurationAccessor: ConfigurationAccessorInterface,
        engineEventContext: EngineEventContext,
        loggerName: string,
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
