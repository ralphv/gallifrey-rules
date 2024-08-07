"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretString = void 0;
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
class BaseConfig {
    constructor(prefix = '') {
        this.prefix = prefix;
    }
    getEnvVariable(envName, defaultValue, throwOnEmpty) {
        const envNames = Array.isArray(envName) ? envName : [envName];
        let value;
        let fullEnvName;
        for (const env of envNames) {
            fullEnvName = this.getFullEnvName(env);
            const envNameFile = fullEnvName + '_FILE';
            if (envNameFile in process.env && typeof process.env[envNameFile] === 'string') {
                value = (0, node_fs_1.readFileSync)(process.env[envNameFile]).toString();
            }
            else {
                value = process.env[fullEnvName];
            }
            if (value) {
                // found one
                break;
            }
        }
        if (throwOnEmpty && (!value || value == '')) {
            throw new EngineCriticalError_1.default(`The environment variable ${fullEnvName} is empty or missing and it is marked as required`);
        }
        return value !== null && value !== void 0 ? value : defaultValue;
    }
    getBoolEnvVariable(envName, defaultValue, throwOnEmpty) {
        return this.getEnvVariable(envName, defaultValue ? 'TRUE' : 'FALSE', throwOnEmpty).toLowerCase() === 'true';
    }
    getArrayEnvVariable(envName, defaultValue, throwOnEmpty) {
        const arrayValueAsString = this.getEnvVariable(envName, JSON.stringify(defaultValue), throwOnEmpty);
        try {
            const tryToParseJSON = JSON.parse(arrayValueAsString);
            if (tryToParseJSON && Array.isArray(tryToParseJSON)) {
                return tryToParseJSON;
            }
        }
        catch (_a) {
            // ignore, we try with commas next
        }
        return arrayValueAsString.split(',');
    }
    getNumberEnvVariable(envName, defaultValue, throwOnEmpty) {
        const value = parseInt(this.getEnvVariable(envName, String(defaultValue), throwOnEmpty));
        if (isNaN(value)) {
            throw new EngineCriticalError_1.default(`The environment variable ${this.getFullEnvName(Array.isArray(envName) ? envName[0] : envName)} is marked as numeric but does not seem so: ${value}`);
        }
        return value;
    }
    getSecretEnvVariable(envName, defaultValue, throwOnEmpty) {
        return new SecretString(this.getEnvVariable(envName, defaultValue, throwOnEmpty));
    }
    getAllValues() {
        // @ts-expect-error call methods by name
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return this.getMethodNames(this).map((method) => ({ method, value: this[method]() }));
    }
    describe() {
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
            .join(node_os_1.EOL);
    }
    getMethodNames(obj, includeParents = false) {
        // Get the prototype of the object
        let proto = Object.getPrototypeOf(obj);
        const methods = [];
        while (proto && proto !== Object.prototype) {
            proto = Object.getPrototypeOf(obj);
            const propNames = Object.getOwnPropertyNames(proto);
            methods.push(...propNames.filter((name) => {
                const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                return descriptor && typeof descriptor.value === 'function' && name !== 'constructor';
            }));
            proto = Object.getPrototypeOf(proto);
            if (!includeParents) {
                proto = null;
            }
        }
        return methods;
    }
    getFullEnvName(envName) {
        return this.prefix + envName;
    }
    isProduction() {
        var _a, _b;
        return ((_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) !== null && _b !== void 0 ? _b : '').toLowerCase() === 'production';
    }
}
exports.default = BaseConfig;
class SecretString extends String {
    constructor(secret) {
        super(`****************`);
        this.secret = secret;
        this.secret = secret;
    }
    toString() {
        return `****************`;
    }
    getSecretValue() {
        return this.secret;
    }
}
exports.SecretString = SecretString;
