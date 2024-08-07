import { Point } from '@influxdata/influxdb-client';
export interface InfluxDBTag {
    name: string;
    value: string;
}
export default class InfluxDBClient {
    private defaultTags;
    private readonly writeAPI;
    constructor(defaultTags?: InfluxDBTag[]);
    writeFloat(measurementName: string, fieldName: string, floatValue: number, tags?: InfluxDBTag[]): Promise<void>;
    getPoint(measurementName: string): Point;
    writePoint(point: Point): Promise<void>;
    writeInt(measurementName: string, fieldName: string, intValue: number, tags?: InfluxDBTag[]): Promise<void>;
    shutdown(): Promise<void>;
    flush(): Promise<void>;
}
