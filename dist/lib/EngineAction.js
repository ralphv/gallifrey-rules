"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EngineBase_1 = __importDefault(require("./EngineBase"));
class EngineAction extends EngineBase_1.default {
    constructor(configurationAccessor, engineEventContext, loggerName, payload, journalLogger, getMetricsPointDelegate, isAsyncQueuedAction) {
        super(engineEventContext, engineEventContext, configurationAccessor, loggerName, journalLogger, getMetricsPointDelegate);
        this.payload = payload;
        this.isAsyncQueuedAction = isAsyncQueuedAction;
    }
    getPayload() {
        return this.payload;
    }
    isAsyncQueued() {
        return this.isAsyncQueuedAction;
    }
}
exports.default = EngineAction;
