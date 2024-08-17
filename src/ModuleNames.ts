import TestingDummyScheduledEventsProvider from './testing-modules/TestingDummyScheduledEventsProvider';
import { TestingJournalLoggerProvider } from './index';

export const ModuleNames = {
    ConsoleJournalLogger: `console-journal-logger`,
    DummyDistributedLocks: `dummy-distributed-locks`,
    DummyReactToFailure: `dummy-react-to-failure`,
    DummyScheduledEvents: `dummy-scheduled-events`,
    EnvVariableConfiguration: `env-variable-configuration`,
    InfluxDBMetrics: `influx-db-metrics`,
    KafkaActionQueuer: `kafka-action-queuer`,
    PostgresDistributedLocks: `postgres-distributed-locks`,
    PostgresScheduledEvents: `postgres-scheduled-events`,
    PushToTopicReactToFailure: `push-to-topic-react-to-failure`,
    RescheduleEventReactToFailure: `reschedule-event-react-to-failure`,
};

export const TestingModuleNames = {
    TestingDummyScheduledEventsProvider: TestingDummyScheduledEventsProvider.name,
    TestingJournalLoggerProvider: TestingJournalLoggerProvider.name,
};
