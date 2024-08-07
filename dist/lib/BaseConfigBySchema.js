"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
const BasicTypeGuards_1 = require("../BasicTypeGuards");
const BaseConfig_1 = __importDefault(require("./BaseConfig"));
class BaseConfigBySchema extends BaseConfig_1.default {
    constructor(schema) {
        super();
        this.schema = schema;
        this.validate(this.schema);
    }
    getEnvVariableByName(name) {
        if (!(name in this.schema)) {
            throw new EngineCriticalError_1.default(`No env variable defined in the schema with the name: ${name}`);
        }
        const item = this.schema[name];
        switch (item.type) {
            case 'boolean':
                return this.getBoolEnvVariable(item.environmentVariables, item.defaultValue, item.throwOnEmpty);
            case 'secret':
                return this.getSecretEnvVariable(item.environmentVariables, item.defaultValue, item.throwOnEmpty);
            case 'string':
                return this.getEnvVariable(item.environmentVariables, item.defaultValue, item.throwOnEmpty);
            case 'array':
                return this.getArrayEnvVariable(item.environmentVariables, item.defaultValue, item.throwOnEmpty);
            case 'number':
                return this.getNumberEnvVariable(item.environmentVariables, item.defaultValue, item.throwOnEmpty);
            default:
                throw new EngineCriticalError_1.default(`Invalid BaseConfigBySchemaType type: ${item.type}`);
        }
    }
    validate(schema) {
        if (!IsBaseConfigBySchemaType(schema)) {
            throw new EngineCriticalError_1.default(`Invalid schema`);
        }
    }
}
exports.default = BaseConfigBySchema;
function IsTypeBaseConfigBySchemaElementType(value) {
    return ((typeof value.environmentVariables === 'string' ||
        (Array.isArray(value.environmentVariables) && value.environmentVariables.length > 0)) &&
        (0, BasicTypeGuards_1.IsString)(value.longDescription) &&
        (0, BasicTypeGuards_1.IsString)(value.shortDescription) &&
        (0, BasicTypeGuards_1.IsString)(value.type) &&
        (0, BasicTypeGuards_1.IsBoolean)(value.throwOnEmpty));
}
function IsBaseConfigBySchemaType(value) {
    return !Object.values(value).some((i) => !IsTypeBaseConfigBySchemaElementType(i));
}
