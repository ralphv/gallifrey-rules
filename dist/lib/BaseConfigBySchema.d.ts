import BaseConfig from './BaseConfig';
export default class BaseConfigBySchema extends BaseConfig {
    private schema;
    constructor(schema: BaseConfigBySchemaType);
    protected getEnvVariableByName(name: string): any;
    private validate;
}
export type BaseConfigBySchemaType = {
    [name: string]: BaseConfigBySchemaElementType;
};
export type BaseConfigBySchemaElementType = {
    environmentVariables: string | string[];
    longDescription: string;
    shortDescription: string;
    type: 'string' | 'boolean' | 'number' | 'array' | 'secret';
    defaultValue: string | boolean | number | string[];
    throwOnEmpty: boolean;
};
