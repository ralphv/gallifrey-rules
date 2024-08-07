"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const GallifreyRulesEngine_1 = require("../GallifreyRulesEngine");
const Config_1 = __importDefault(require("../lib/Config"));
const Utils_1 = require("../lib/Utils");
void (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new GallifreyRulesEngine_1.GallifreyRulesEngine();
        if (!(0, commands_1.validateCommand)(`create-kafka-connector-scheduled-events`)) {
            return;
        }
        console.log(`Creating connector`);
        yield (0, Utils_1.deployKafkaConnectConnector)(process.env.KAFKA_CONNECT_URL, getConnector());
        console.log(`Done!`);
    }
    catch (e) {
        // @ts-expect-error ignore
        console.trace(`Error: ${String(e)} ${e.stackTrace}`);
    }
}))();
function getConnector() {
    const config = new Config_1.default();
    return {
        name: 'gallifrey-rules-scheduled-events-connector',
        config: {
            'connector.class': 'io.confluent.connect.jdbc.JdbcSourceConnector',
            'connection.url': `jdbc:postgresql://${config.getDBHost(true)}:${config.getDBPort()}/${config.getDBName(true)}`,
            'connection.user': config.getDBUser(true),
            'connection.password': config.getDBPasswordSecret(true).getSecretValue(),
            mode: 'incrementing',
            'incrementing.column.name': 'id',
            query: 'WITH inserted AS (INSERT INTO scheduled_events (scheduled_event_id, createdAt, scheduledAt, triggeredBy_namespace, triggeredBy_entityName, triggeredBy_eventName, triggeredBy_eventID, triggeredBy_source, event_namespace, event_entityName, event_eventName, event_eventID, event_payload, scheduled_count, pulledAt) SELECT sel.scheduled_event_id, sel.createdAt, sel.scheduledAt, sel.triggeredBy_namespace, sel.triggeredBy_entityName, sel.triggeredBy_eventName, sel.triggeredBy_eventID, sel.triggeredBy_source, sel.event_namespace, sel.event_entityName, sel.event_eventName, sel.event_eventID, sel.event_payload, sel.scheduled_count, NOW() FROM scheduled_events_landing sel LEFT JOIN scheduled_events se ON sel.scheduled_event_id = se.scheduled_event_id WHERE sel.scheduledAt <= NOW() AND se.scheduled_event_id IS NULL RETURNING scheduled_event_id), deleted AS (DELETE FROM scheduled_events_landing WHERE scheduled_event_id IN (SELECT scheduled_event_id FROM inserted)) SELECT * FROM scheduled_events',
            'topic.prefix': 'gallifrey-rules-scheduled-events',
            'poll.interval.ms': '5000',
            'tasks.max': '1',
        },
    };
}
