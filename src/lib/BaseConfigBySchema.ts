import EngineCriticalError from '../errors/EngineCriticalError';
import { IsBoolean, IsString } from '../BasicTypeGuards';
import BaseConfig from './BaseConfig';

export default class BaseConfigBySchema extends BaseConfig {
    constructor(private schema: BaseConfigBySchemaType) {
        super();
        this.validate(this.schema);
    }

    protected getEnvVariableByName(name: string): any {
        if (!(name in this.schema)) {
            throw new EngineCriticalError(`No env variable defined in the schema with the name: ${name}`);
        }

        const item: BaseConfigBySchemaElementType = this.schema[name];

        switch (item.type) {
            case 'boolean':
                return this.getBoolEnvVariable(
                    item.environmentVariables,
                    item.defaultValue as boolean,
                    item.throwOnEmpty,
                );
            case 'secret':
                return this.getSecretEnvVariable(
                    item.environmentVariables,
                    item.defaultValue as string,
                    item.throwOnEmpty,
                );
            case 'string':
                return this.getEnvVariable(item.environmentVariables, item.defaultValue as string, item.throwOnEmpty);
            case 'array':
                return this.getArrayEnvVariable(
                    item.environmentVariables,
                    item.defaultValue as string[],
                    item.throwOnEmpty,
                );
            case 'number':
                return this.getNumberEnvVariable(
                    item.environmentVariables,
                    item.defaultValue as number,
                    item.throwOnEmpty,
                );
            default:
                throw new EngineCriticalError(`Invalid BaseConfigBySchemaType type: ${item.type as string}`);
        }
    }

    private validate(schema: BaseConfigBySchemaType) {
        if (!IsBaseConfigBySchemaType(schema)) {
            throw new EngineCriticalError(`Invalid schema`);
        }
    }
}

export type BaseConfigBySchemaType = { [name: string]: BaseConfigBySchemaElementType };

export type BaseConfigBySchemaElementType = {
    environmentVariables: string | string[];
    longDescription: string;
    shortDescription: string;
    type: 'string' | 'boolean' | 'number' | 'array' | 'secret';
    defaultValue: string | boolean | number | string[];
    throwOnEmpty: boolean;
};

function IsTypeBaseConfigBySchemaElementType(value: { [key: string]: any }): value is BaseConfigBySchemaElementType {
    return (
        (typeof value.environmentVariables === 'string' ||
            (Array.isArray(value.environmentVariables) && value.environmentVariables.length > 0)) &&
        IsString(value.longDescription) &&
        IsString(value.shortDescription) &&
        IsString(value.type) &&
        IsBoolean(value.throwOnEmpty)
    );
}

function IsBaseConfigBySchemaType(value: any): value is BaseConfigBySchemaType {
    return !Object.values(value).some((i) => !IsTypeBaseConfigBySchemaElementType(i as any));
}
