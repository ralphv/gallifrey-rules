import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';

export default interface EngineLogInterface {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    journal(message: string, extra?: any): void;
    getMetricsPoint(measurementName: string): MetricsPointInterface;
}
