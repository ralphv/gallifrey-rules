import MetricsInterface from '../interfaces/Providers/MetricsInterface';
import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';
export default class InfluxDBMetricsProvider implements MetricsInterface {
    private readonly influxDB;
    constructor();
    getModuleName(): string;
    getPoint(measurementName: string): MetricsPointInterface;
    flush(): Promise<void>;
}
