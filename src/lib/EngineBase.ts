import EngineLogInterface from '../engine-interfaces/EngineLogInterface';
import Config from './Config';
import log4js, { Logger } from 'log4js';
import { EngineContextInterface } from '../engine-interfaces';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import { AssertNotNull } from './Utils';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import EngineEventInterface from '../engine-interfaces/EngineEventInterface';
import { EngineEventContext } from './EngineEventContext';

export default class EngineBase implements EngineLogInterface, EngineEventInterface {
    private l: Logger;
    constructor(
        private readonly engineContext: EngineContextInterface,
        private readonly engineEventContext: EngineEventContext | undefined,
        private readonly configurationAccessor: ConfigurationAccessorInterface | undefined,
        loggerName: string,
        private readonly journalLogger: JournalLoggerInterface | undefined,
        private readonly getMetricsPointDelegate: GetMetricsPointDelegate | undefined,
    ) {
        this.l = log4js.getLogger(loggerName);
        this.l.level = engineEventContext
            ? engineEventContext.getEventLevelConfig().getLogLevel()
            : new Config().getLogLevel();
    }

    getConfigurationAccessor(): ConfigurationAccessorInterface {
        return AssertNotNull(this.configurationAccessor); // only for config providers this won't be available, they should not call it.
    }

    getEventContext(): EngineEventContextInterface {
        return AssertNotNull(this.engineEventContext);
    }

    debug(message: string, ...args: any[]): void {
        this.l.debug(message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.l.error(message, ...args);
    }

    info(message: string, ...args: any[]): void {
        this.l.info(message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.l.warn(message, ...args);
    }

    getContext(): EngineContextInterface {
        return this.engineContext;
    }

    journal(message: string, extra?: any): void {
        if (this.journalLogger) {
            this.journalLogger.customLog(message, extra);
        }
    }

    getMetricsPoint(measurementName: string): MetricsPointInterface {
        return AssertNotNull(this.getMetricsPointDelegate)(measurementName);
    }
}
