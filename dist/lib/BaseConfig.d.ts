export default class BaseConfig {
    private prefix;
    constructor(prefix?: string);
    protected getEnvVariable(envName: string | string[], defaultValue: string, throwOnEmpty: boolean): string;
    protected getBoolEnvVariable(envName: string | string[], defaultValue: boolean, throwOnEmpty: boolean): boolean;
    protected getArrayEnvVariable(envName: string | string[], defaultValue: string[], throwOnEmpty: boolean): string[];
    protected getNumberEnvVariable(envName: string | string[], defaultValue: number, throwOnEmpty: boolean): number;
    protected getSecretEnvVariable(envName: string | string[], defaultValue: string, throwOnEmpty: boolean): SecretString;
    getAllValues(): {
        method: string;
        value: any;
    }[];
    describe(): string;
    private getMethodNames;
    private getFullEnvName;
    protected isProduction(): boolean;
}
export declare class SecretString extends String {
    private readonly secret;
    constructor(secret: string);
    toString(): string;
    getSecretValue(): string;
}
