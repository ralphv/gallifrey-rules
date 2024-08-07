"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const kafkajs_1 = require("kafkajs");
const logger_1 = require("./lib/logger");
class KafkaLog {
    static getLogCreator() {
        return () => {
            return ({ level, log }) => {
                const { message } = log, extra = __rest(log, ["message"]);
                switch (level) {
                    case kafkajs_1.logLevel.DEBUG:
                        logger_1.logger.debug({ message, extra });
                        break;
                    case kafkajs_1.logLevel.INFO:
                        logger_1.logger.info({ message, extra });
                        break;
                    case kafkajs_1.logLevel.WARN:
                        logger_1.logger.warn({ message, extra });
                        break;
                    case kafkajs_1.logLevel.ERROR:
                        logger_1.logger.error({ message, extra });
                        break;
                    default:
                        logger_1.logger.trace({ message, extra });
                        break;
                }
            };
        };
    }
}
exports.default = KafkaLog;
