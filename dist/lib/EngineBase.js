"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./Config"));
const log4js_1 = __importDefault(require("log4js"));
const Utils_1 = require("./Utils");
class EngineBase {
    constructor(engineContext, engineEventContext, configurationAccessor, loggerName, journalLogger, getMetricsPointDelegate) {
        this.engineContext = engineContext;
        this.engineEventContext = engineEventContext;
        this.configurationAccessor = configurationAccessor;
        this.journalLogger = journalLogger;
        this.getMetricsPointDelegate = getMetricsPointDelegate;
        //todo getLogger from interface
        const config = new Config_1.default();
        this.l = log4js_1.default.getLogger(loggerName);
        this.l.level = config.getLogLevel();
    }
    getConfigurationAccessor() {
        return (0, Utils_1.AssertNotNull)(this.configurationAccessor); // only for config providers this won't be available, they should not call it.
    }
    getEventContext() {
        return (0, Utils_1.AssertNotNull)(this.engineEventContext);
    }
    debug(message, ...args) {
        this.l.debug(message, ...args);
    }
    error(message, ...args) {
        this.l.error(message, ...args);
    }
    info(message, ...args) {
        this.l.info(message, ...args);
    }
    warn(message, ...args) {
        this.l.warn(message, ...args);
    }
    getContext() {
        return this.engineContext;
    }
    journal(message, extra) {
        if (this.journalLogger) {
            this.journalLogger.customLog(message, extra);
        }
    }
    getMetricsPoint(measurementName) {
        return (0, Utils_1.AssertNotNull)(this.getMetricsPointDelegate)(measurementName);
    }
}
exports.default = EngineBase;
