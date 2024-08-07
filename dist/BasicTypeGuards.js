"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsString = IsString;
exports.IsNumber = IsNumber;
exports.IsBoolean = IsBoolean;
exports.IsArray = IsArray;
exports.IsNotNull = IsNotNull;
exports.IsObject = IsObject;
exports.AssertTypeGuard = AssertTypeGuard;
const EngineCriticalError_1 = __importDefault(require("./errors/EngineCriticalError"));
function IsString(value, optional = false) {
    return typeof value === 'string' || (optional && value === undefined);
}
function IsNumber(value, optional = false) {
    return typeof value === 'number' || (optional && value === undefined);
}
function IsBoolean(value, optional = false) {
    return typeof value === 'boolean' || (optional && value === undefined);
}
function IsArray(value, optional = false, elementFn = undefined) {
    const isArray = Array.isArray(value) || (optional && value === undefined);
    if (!isArray) {
        return false;
    }
    if (elementFn && value) {
        return !value.some((e) => !elementFn(e, optional));
    }
    return true;
}
function IsNotNull(value) {
    return value !== null;
}
function IsObject(value, optional = false) {
    return (typeof value === 'object' && value !== null) || (optional && value === undefined);
}
function AssertTypeGuard(fn, value) {
    if (!fn(value)) {
        throw new EngineCriticalError_1.default(`AssertTypeGuard failed for ${fn.name}`);
    }
}
