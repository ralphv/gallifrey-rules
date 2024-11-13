import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';

export default interface EngineLogInterface {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;

    /**
     * Adds a custom log to the journal logger
     * @param message The custom message/text
     * @param extra extra meta-data to associate with the journal log
     */
    journal(message: string, extra?: any): void;

    /**
     * Gets the custom metrics point using the measurement name
     * @param measurementName
     */
    getMetricsPoint(measurementName: string): MetricsPointInterface;
}
