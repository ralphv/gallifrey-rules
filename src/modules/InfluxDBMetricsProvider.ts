import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import MetricsInterface from '../interfaces/Providers/MetricsInterface';
import MetricsPointInterface from '../interfaces/Providers/MetricsPointInterface';
import InfluxDBClient from '../lib/InfluxDBClient';
import { Point } from '@influxdata/influxdb-client';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.Metrics)
export default class InfluxDBMetricsProvider implements MetricsInterface {
    private readonly influxDB: InfluxDBClient;

    constructor() {
        this.influxDB = new InfluxDBClient();
    }

    getModuleName(): string {
        return ModuleNames.InfluxDBMetrics;
    }

    getPoint(measurementName: string): MetricsPointInterface {
        return new InfluxDBMetricsProviderPoint(measurementName, this.influxDB);
    }

    async flush() {
        await this.influxDB.flush();
    }
}

class InfluxDBMetricsProviderPoint implements MetricsPointInterface {
    private readonly point: Point;

    constructor(
        measurementName: string,
        private influxDB: InfluxDBClient,
    ) {
        this.point = influxDB.getPoint(measurementName);
    }

    floatField(fieldName: string, floatValue: number): MetricsPointInterface {
        this.point.floatField(fieldName, floatValue);
        return this;
    }

    intField(fieldName: string, intValue: number): MetricsPointInterface {
        this.point.intField(fieldName, intValue);
        return this;
    }

    async submit() {
        await this.influxDB.writePoint(this.point);
    }

    tag(tag: string, value: string): MetricsPointInterface {
        this.point.tag(tag, value);
        return this;
    }

    tags(tags: { tag: string; value: string }[]): MetricsPointInterface {
        for (const tag of tags) {
            this.tag(tag.tag, tag.value);
        }
        return this;
    }

    uintField(fieldName: string, intValue: number): MetricsPointInterface {
        this.point.uintField(fieldName, intValue);
        return this;
    }
}
