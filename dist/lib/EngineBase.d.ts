import EngineLogInterface from '../engine-interfaces/EngineLogInterface';
import { EngineContextInterface } from '../engine-interfaces';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import EngineEventInterface from '../engine-interfaces/EngineEventInterface';
export default class EngineBase implements EngineLogInterface, EngineEventInterface {
    private readonly engineContext;
    private readonly engineEventContext;
    private readonly configurationAccessor;
    private readonly journalLogger;
    private readonly getMetricsPointDelegate;
    private l;
    constructor(engineContext: EngineContextInterface, engineEventContext: EngineEventContextInterface | undefined, configurationAccessor: ConfigurationAccessorInterface | undefined, loggerName: string, journalLogger: JournalLoggerInterface | undefined, getMetricsPointDelegate: GetMetricsPointDelegate | undefined);
    getConfigurationAccessor(): ConfigurationAccessorInterface;
    getEventContext(): EngineEventContextInterface;
    debug(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    getContext(): EngineContextInterface;
    journal(message: string, extra?: any): void;
    getMetricsPoint(measurementName: string): MetricsPointInterface;
}
