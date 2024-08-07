export default interface MetricsPointInterface {
    tags(tags: {
        tag: string;
        value: string;
    }[]): MetricsPointInterface;
    tag(tag: string, value: string): MetricsPointInterface;
    intField(fieldName: string, intValue: number): MetricsPointInterface;
    uintField(fieldName: string, intValue: number): MetricsPointInterface;
    floatField(fieldName: string, floatValue: number): MetricsPointInterface;
    submit(): Promise<void>;
}
