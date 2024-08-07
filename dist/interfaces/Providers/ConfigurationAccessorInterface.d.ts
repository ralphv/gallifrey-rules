export default interface ConfigurationAccessorInterface {
    getStringValue(key: string, defaultValue: string): Promise<string>;
    getNumericValue(key: string, defaultValue: number): Promise<number>;
    getBooleanValue(key: string, defaultValue: boolean): Promise<boolean>;
}
