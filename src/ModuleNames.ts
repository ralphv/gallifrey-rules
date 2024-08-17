import { TestingJournalLoggerProvider } from './index';
import TestingDummyScheduledEventsProvider from './testing-modules/TestingDummyScheduledEventsProvider';

export type ModuleNames = (typeof _ModuleNames)[keyof typeof _ModuleNames];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ModuleNames = {
    ConsoleJournalLogger: 'console-journal-logger',
    DummyDistributedLocks: 'dummy-distributed-locks',
    DummyReactToFailure: 'dummy-react-to-failure',
    DummyScheduledEvents: 'dummy-scheduled-events',
    EnvVariableConfiguration: 'env-variable-configuration',
    InfluxDBMetrics: 'influx-db-metrics',
    KafkaActionQueuer: 'kafka-action-queuer',
    PostgresDistributedLocks: 'postgres-distributed-locks',
    PostgresScheduledEvents: 'postgres-scheduled-events',
    PushToTopicReactToFailure: 'push-to-topic-react-to-failure',
    RescheduleEventReactToFailure: 'reschedule-event-react-to-failure',
} as const;

export type TestingModuleNames = (typeof _TestingModuleNames)[keyof typeof _TestingModuleNames];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _TestingModuleNames = {
    TestingDummyScheduledEventsProvider: TestingDummyScheduledEventsProvider.name,
    TestingJournalLoggerProvider: TestingJournalLoggerProvider.name,
} as const;

const BaseValue = 10;
const prefix = '/data';
const enum Values {
    First = BaseValue, // 10
    Second, // 11
    Third, // 12
}
const enum Routes {
    Parts = `${prefix}/parts`, // "/data/parts"
    Invoices = `${prefix}/invoices`, // "/data/invoices"
}
