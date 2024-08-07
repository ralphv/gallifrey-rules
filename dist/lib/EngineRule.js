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
const EngineBase_1 = __importDefault(require("./EngineBase"));
const PerformanceTimer_1 = __importDefault(require("./PerformanceTimer"));
class EngineRule extends EngineBase_1.default {
    constructor(configurationAccessor, engineEventContext, doActionDelegate, pullDataObjectDelegate, loggerName, eventPayload, journalLogger, getMetricsPointDelegate, getScheduledEventContextDelegate, insertScheduledEventDelegate, isScheduledEventDelegate) {
        super(engineEventContext, engineEventContext, configurationAccessor, loggerName, journalLogger, getMetricsPointDelegate);
        this.doActionDelegate = doActionDelegate;
        this.pullDataObjectDelegate = pullDataObjectDelegate;
        this.eventPayload = eventPayload;
        this.getScheduledEventContextDelegate = getScheduledEventContextDelegate;
        this.insertScheduledEventDelegate = insertScheduledEventDelegate;
        this.isScheduledEventDelegate = isScheduledEventDelegate;
        this.timer = new PerformanceTimer_1.default();
    }
    getTimer() {
        return this.timer;
    }
    doAction(actionName, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.timer.pause(); // running parallel actions (Promise.All) will result in inaccurate rule timers
                return yield this.doActionDelegate(actionName, payload);
            }
            finally {
                this.timer.resume();
            }
        });
    }
    pullDataObject(dataObjectName, request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.timer.pause();
                return yield this.pullDataObjectDelegate(dataObjectName, request);
            }
            finally {
                this.timer.resume();
            }
        });
    }
    getEventPayload() {
        return this.eventPayload;
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
exports.default = EngineRule;
