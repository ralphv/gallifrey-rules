"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EngineBase_1 = __importDefault(require("./EngineBase"));
class EngineReactToFailure extends EngineBase_1.default {
    constructor(configurationAccessor, engineEventContext, loggerName, journalLogger, getMetricsPointDelegate, getScheduledEventContextDelegate, insertScheduledEventDelegate, isScheduledEventDelegate) {
        super(engineEventContext, engineEventContext, configurationAccessor, loggerName, journalLogger, getMetricsPointDelegate);
        this.getScheduledEventContextDelegate = getScheduledEventContextDelegate;
        this.insertScheduledEventDelegate = insertScheduledEventDelegate;
        this.isScheduledEventDelegate = isScheduledEventDelegate;
    }
    getScheduledEventContext() {
        return this.getScheduledEventContextDelegate();
    }
    insertScheduledEvent(event, scheduleAt) {
        return this.insertScheduledEventDelegate(event, scheduleAt);
    }
    isScheduledEvent() {
        return this.isScheduledEventDelegate();
    }
}
exports.default = EngineReactToFailure;
