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
exports.KafkaConsumerLagCalculator = void 0;
const kafkajs_1 = require("kafkajs");
const logger_1 = require("./lib/logger");
const KafkaLog_1 = __importDefault(require("./KafkaLog"));
class KafkaConsumerLagCalculator {
    static fetchTopicOffsets(clientId, brokers, topic) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const kafka = new kafkajs_1.Kafka({
                clientId,
                brokers,
                logCreator: KafkaLog_1.default.getLogCreator(),
            });
            const admin = kafka.admin();
            try {
                yield admin.connect();
                return yield admin.fetchTopicOffsets(topic);
            }
            catch (e) {
                logger_1.logger.error(`Exception from calculateLags: ${String(e)} @${String((_a = e.stack) !== null && _a !== void 0 ? _a : '')}`);
                return null;
            }
            finally {
                yield admin.disconnect();
            }
        });
    }
}
exports.KafkaConsumerLagCalculator = KafkaConsumerLagCalculator;
