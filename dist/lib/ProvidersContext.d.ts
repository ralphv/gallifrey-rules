import MetricsInterface from '../interfaces/Providers/MetricsInterface';
import ConfigurationInterface from '../interfaces/Providers/ConfigurationInterface';
import LoggerInterface from '../interfaces/Providers/LoggerInterface';
import ScheduledEventsInterface from '../interfaces/Providers/ScheduledEventsInterface';
import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import DistributedLocksWrapper from '../DistributedLocksWrapper';
export declare class ProvidersContext {
    configuration: ConfigurationInterface | undefined;
    logger: LoggerInterface | undefined;
    metrics: MetricsInterface | undefined;
    reactToFailure: ReactToFailureInterface | undefined;
    scheduledEvents: ScheduledEventsInterface | undefined;
    distributedLocks: DistributedLocksWrapper | undefined;
}
