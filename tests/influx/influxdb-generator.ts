import { loadAll } from 'js-yaml';
import { InfluxDB, Point, WriteApi, WritePrecisionType } from '@influxdata/influxdb-client';
import * as casual from 'casual';
import * as fs from 'node:fs';

const yamlFile = process.env.YAML_FILE || 'influxdb-generator.yaml';

void (async () => {
    const documents: unknown[] = loadAll(fs.readFileSync(yamlFile, 'utf8'));
    if (documents.length !== 1) {
        throw new Error('No documents found.');
    }
    const generator = documents[0] as YamlType;
    casual.integer(1, 12);

    const client = new InfluxDB({
        url: generator.influxdb.url,
        token: 'OYcG6rsbNZPDOvR2yfZv76vx_bFRV9Znx45edH8vrqVZRmHHquGRZOkQGZ0CuxOADvMXHfOspI1jR4C9u_4OXQ==',
    });
    const writeApi = client.getWriteApi('tardis', generator.influxdb.database, generator.influxdb.precision);

    for (const metric of generator.metrics) {
        generateMetric(writeApi, metric);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
        await writeApi.flush(true);
        console.log(`exiting`);
        process.exit(0);
    }, generator.periodSeconds * 1000);
})();

function processValue(value: YamlMetricValueFieldTagType) {
    if (typeof value === 'string' && value.startsWith('$casual')) {
        return eval(value.substring(1));
    }
    return value;
}

function generateMetric(writeApi: WriteApi, metric: YamlMetricType) {
    const point = new Point(metric.measurement);

    if (metric.tags) {
        Object.entries(metric.tags).forEach(([name, value]) => {
            point.tag(name, String(processValue(value)));
        });
    }
    if (metric.fields) {
        Object.entries(metric.fields).forEach(([name, value]) => {
            switch (value.type) {
                case 'int':
                    point.intField(name, processValue(value.value));
                    break;
                case 'float':
                    point.floatField(name, processValue(value.value));
                    break;
                case 'uint':
                    point.uintField(name, processValue(value.value));
                    break;
            }
        });
    }

    //console.log(point.toString());
    writeApi.writePoint(point);

    setTimeout(
        () => generateMetric(writeApi, metric),
        Array.isArray(metric.every) ? casual.integer(metric.every[0], metric.every[1]) : metric.every,
    );
}

type YamlType = {
    influxdb: {
        url: string;
        database: string;
        precision: WritePrecisionType;
    };
    periodSeconds: number;
    metrics: YamlMetricType[];
};

type YamlMetricType = {
    measurement: string;
    every: number | [number, number];
    fields: { [field: string]: { type: 'float' | 'int' | 'uint'; value: YamlMetricValueFieldTagType } };
    tags: { [tag: string]: YamlMetricValueFieldTagType };
};

type YamlMetricValueFieldTagType = string | number | boolean;
