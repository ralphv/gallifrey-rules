import { readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import EngineCriticalError from '../errors/EngineCriticalError';

export default class BaseConfig {
    constructor(private prefix: string = '') {}
    protected getEnvVariable(envName: string | string[], defaultValue: string, throwOnEmpty: boolean): string {
        const envNames = Array.isArray(envName) ? envName : [envName];
        let value;
        let fullEnvName;
        for (const env of envNames) {
            fullEnvName = this.getFullEnvName(env);
            const envNameFile = fullEnvName + '_FILE';
            if (envNameFile in process.env && typeof process.env[envNameFile] === 'string') {
                value = readFileSync(process.env[envNameFile]).toString();
            } else {
                value = process.env[fullEnvName];
            }
            if (value) {
                // found one
                break;
            }
        }
        if (throwOnEmpty && (!value || value == '')) {
            throw new EngineCriticalError(
                `The environment variable ${fullEnvName} is empty or missing and it is marked as required`,
            );
        }
        return value ?? defaultValue;
    }

    protected getBoolEnvVariable(envName: string | string[], defaultValue: boolean, throwOnEmpty: boolean): boolean {
        return this.getEnvVariable(envName, defaultValue ? 'TRUE' : 'FALSE', throwOnEmpty).toLowerCase() === 'true';
    }

    protected getArrayEnvVariable(envName: string | string[], defaultValue: string[], throwOnEmpty: boolean): string[] {
        const arrayValueAsString = this.getEnvVariable(envName, JSON.stringify(defaultValue), throwOnEmpty);
        try {
            const tryToParseJSON = JSON.parse(arrayValueAsString);
            if (tryToParseJSON && Array.isArray(tryToParseJSON)) {
                return tryToParseJSON as string[];
            }
        } catch {
            // ignore, we try with commas next
        }
        return arrayValueAsString.split(',');
    }

    protected getNumberEnvVariable(envName: string | string[], defaultValue: number, throwOnEmpty: boolean): number {
        const value = parseInt(this.getEnvVariable(envName, String(defaultValue), throwOnEmpty));
        if (isNaN(value)) {
            throw new EngineCriticalError(
                `The environment variable ${this.getFullEnvName(Array.isArray(envName) ? envName[0] : envName)} is marked as numeric but does not seem so: ${value}`,
            );
        }
        return value;
    }

    protected getSecretEnvVariable(
        envName: string | string[],
        defaultValue: string,
        throwOnEmpty: boolean,
    ): SecretString {
        return new SecretString(this.getEnvVariable(envName, defaultValue, throwOnEmpty));
    }

    getAllValues(): { method: string; value: any }[] {
        // @ts-expect-error call methods by name
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return this.getMethodNames(this).map((method) => ({ method, value: this[method]() }));
    }

    describe(): string {
        return this.getAllValues()
            .map(({ method, value }) => {
                ['is', 'get'].forEach((prefix) => {
                    if (method.startsWith(prefix)) {
                        method = method.slice(prefix.length);
                    }
                });
                return { method, value };
            })
            .map(({ method, value }) => `${method} = ${JSON.stringify(value)}`)
            .join(EOL);
    }

    private getMethodNames(obj: any, includeParents: boolean = false): string[] {
        // Get the prototype of the object
        let proto = Object.getPrototypeOf(obj);
        const methods = [];
        while (proto && proto !== Object.prototype) {
            proto = Object.getPrototypeOf(obj);
            const propNames = Object.getOwnPropertyNames(proto);
            methods.push(
                ...propNames.filter((name) => {
                    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                    return descriptor && typeof descriptor.value === 'function' && name !== 'constructor';
                }),
            );
            proto = Object.getPrototypeOf(proto);
            if (!includeParents) {
                proto = null;
            }
        }
        return methods;
    }

    private getFullEnvName(envName: string) {
        return this.prefix + envName;
    }

    protected isProduction() {
        return (process.env?.NODE_ENV ?? '').toLowerCase() === 'production';
    }
}

export class SecretString extends String {
    constructor(private readonly secret: string) {
        super(`****************`);
        this.secret = secret;
    }

    toString(): string {
        return `****************`;
    }

    getSecretValue() {
        return this.secret;
    }
}
