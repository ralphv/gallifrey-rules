"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EngineBase_1 = __importDefault(require("./EngineBase"));
class EngineDataObject extends EngineBase_1.default {
    constructor(configurationAccessor, engineEventContext, loggerName, request, journalLogger, getMetricsPointDelegate, addResultsIntoEventStoreDelegate) {
        super(engineEventContext, engineEventContext, configurationAccessor, loggerName, journalLogger, getMetricsPointDelegate);
        this.request = request;
        this.addResultsIntoEventStoreDelegate = addResultsIntoEventStoreDelegate;
    }
    getRequest() {
        return this.request;
    }
    addResultIntoEventStore(value) {
        this.addResultsIntoEventStoreDelegate(value);
    }
}
exports.default = EngineDataObject;
