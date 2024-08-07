"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleNames = void 0;
var ModuleNames;
(function (ModuleNames) {
    ModuleNames["ConsoleJournalLogger"] = "console-journal-logger";
    ModuleNames["DummyDistributedLocks"] = "dummy-distributed-locks";
    ModuleNames["DummyReactToFailure"] = "dummy-react-to-failure";
    ModuleNames["DummyScheduledEvents"] = "dummy-scheduled-events";
    ModuleNames["EnvVariableConfiguration"] = "env-variable-configuration";
    ModuleNames["InfluxDBMetrics"] = "influx-db-metrics";
    ModuleNames["KafkaActionQueuer"] = "kafka-action-queuer";
    ModuleNames["PostgresDistributedLocks"] = "postgres-distributed-locks";
    ModuleNames["PostgresScheduledEvents"] = "postgres-scheduled-events";
    ModuleNames["PushToTopicReactToFailure"] = "push-to-topic-react-to-failure";
    ModuleNames["RescheduleEventReactToFailure"] = "reschedule-event-react-to-failure";
})(ModuleNames || (exports.ModuleNames = ModuleNames = {}));
