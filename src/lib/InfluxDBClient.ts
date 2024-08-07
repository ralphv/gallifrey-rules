/**
 * author: Ralph Varjabedian
 */
import Config from './Config';
import { logger } from './logger';
import { BeforeExit, DontThrowJustLog, TimeAndWarn } from './Decorators';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
export interface InfluxDBTag {
    name: string;
    value: string;
}

export default class InfluxDBClient {
    private readonly writeAPI: WriteApi | undefined = undefined;
    constructor(private defaultTags: InfluxDBTag[] = []) {
        const config = new Config();
        if (!config.getInfluxURL()) {
            logger.warn(`InfluxDB Url not found, disabling it`);
            return;
        }
        /* istanbul ignore next */
        const client = new InfluxDB({ url: config.getInfluxURL(), token: config.getInfluxDBToken().getSecretValue() });
        /* istanbul ignore next */
        this.writeAPI = client.getWriteApi(config.getInfluxDBOrg(), config.getInfluxDBBucket());
    }

    @TimeAndWarn(3)
    @DontThrowJustLog
    async writeFloat(measurementName: string, fieldName: string, floatValue: number, tags: InfluxDBTag[] = []) {
        if (!this.writeAPI) {
            return;
        }
        const point = new Point(measurementName);

        for (const tag of [...this.defaultTags, ...tags]) {
            point.tag(tag.name, tag.value);
        }

        point.floatField(fieldName, floatValue);

        this.writeAPI.writePoint(point);
    }

    @DontThrowJustLog
    getPoint(measurementName: string): Point {
        return new Point(measurementName);
    }
    @DontThrowJustLog
    async writePoint(point: Point) {
        if (!this.writeAPI) {
            return;
        }
        return this.writeAPI.writePoint(point);
    }

    @TimeAndWarn(3)
    @DontThrowJustLog
    async writeInt(measurementName: string, fieldName: string, intValue: number, tags: InfluxDBTag[] = []) {
        if (!this.writeAPI) {
            return;
        }
        const point = new Point(measurementName);

        for (const tag of [...this.defaultTags, ...tags]) {
            point.tag(tag.name, tag.value);
        }

        point.intField(fieldName, intValue);

        this.writeAPI.writePoint(point);
    }

    @BeforeExit
    async shutdown() {
        if (this.writeAPI) {
            await this.writeAPI.close();
        }
    }
    async flush() {
        if (this.writeAPI) {
            await this.writeAPI.flush();
        }
    }
}
