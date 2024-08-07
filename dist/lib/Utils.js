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
exports.AssertNotNull = AssertNotNull;
exports.TypeAssertNotNull = TypeAssertNotNull;
exports.produce = produce;
exports.deployKafkaConnectConnector = deployKafkaConnectConnector;
exports.deleteKafkaConnectConnector = deleteKafkaConnectConnector;
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
const kafkajs_1 = require("kafkajs");
const axios_1 = __importDefault(require("axios"));
function AssertNotNull(input) {
    if (input === null || input === undefined) {
        console.trace(`AssertNotNull failed`);
        throw new EngineCriticalError_1.default(`AssertNotNull failed`);
    }
    return input;
}
function TypeAssertNotNull(input) {
    return input;
}
function produce(clientId, brokers, topic, key, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const kafka = new kafkajs_1.Kafka({
            clientId,
            brokers,
        });
        const producer = kafka.producer();
        yield producer.connect();
        yield producer.send({
            topic: topic,
            messages: [{ key: key, value: JSON.stringify(payload) }],
        });
        yield producer.disconnect();
    });
}
function deployKafkaConnectConnector(url, connectorConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield axios_1.default.post(`${url}/connectors`, connectorConfig, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Connector deployed successfully.');
            console.debug(response);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('Error deploying connector:', error.message);
                console.error('Response data:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
            }
            else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }
    });
}
function deleteKafkaConnectConnector(url, connectorName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connectRestUrl = `${url}/connectors/${connectorName}`;
        try {
            const response = yield axios_1.default.delete(connectRestUrl);
            console.log(`Connector ${connectorName} deleted successfully`, response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error(`Failed to delete connector ${connectorName}:`, ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            }
            else {
                console.error(`Unexpected error:`, error);
            }
        }
    });
}
