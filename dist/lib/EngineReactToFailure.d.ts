import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import EngineBase from './EngineBase';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import EngineScheduledEventContextInterface from '../engine-interfaces/EngineScheduledEventContextInterface';
import { ScheduledEventRequest, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';
import GetScheduledEventContextDelegate from '../delegates-interfaces/GetScheduledEventContextDelegate';
import InsertScheduledEventDelegate from '../delegates-interfaces/InsertScheduledEventDelegate';
import IsScheduledEventDelegate from '../delegates-interfaces/IsScheduledEventDelegate';
import EngineReactToFailureInterface from '../engine-interfaces/EngineReactToFailureInterface';
export default class EngineReactToFailure extends EngineBase implements EngineReactToFailureInterface {
    private getScheduledEventContextDelegate;
    private insertScheduledEventDelegate;
    private isScheduledEventDelegate;
    constructor(configurationAccessor: ConfigurationAccessorInterface, engineEventContext: EngineEventContextInterface, loggerName: string, journalLogger: JournalLoggerInterface, getMetricsPointDelegate: GetMetricsPointDelegate, getScheduledEventContextDelegate: GetScheduledEventContextDelegate, insertScheduledEventDelegate: InsertScheduledEventDelegate, isScheduledEventDelegate: IsScheduledEventDelegate);
    getScheduledEventContext(): EngineScheduledEventContextInterface | undefined;
    insertScheduledEvent(event: ScheduledEventRequest, scheduleAt: Date): Promise<ScheduledEventResponse>;
    isScheduledEvent(): boolean;
}
