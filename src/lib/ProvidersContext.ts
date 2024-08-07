import MetricsInterface from '../interfaces/Providers/MetricsInterface';
import ConfigurationInterface from '../interfaces/Providers/ConfigurationInterface';
import LoggerInterface from '../interfaces/Providers/LoggerInterface';
import ScheduledEventsInterface from '../interfaces/Providers/ScheduledEventsInterface';
import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import DistributedLocksWrapper from '../DistributedLocksWrapper';

export class ProvidersContext {
    public configuration: ConfigurationInterface | undefined;
    public logger: LoggerInterface | undefined;
    public metrics: MetricsInterface | undefined;
    public reactToFailure: ReactToFailureInterface | undefined;
    public scheduledEvents: ScheduledEventsInterface | undefined;
    public distributedLocks: DistributedLocksWrapper | undefined;
}
