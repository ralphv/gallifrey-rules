"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = Cache;
exports.ClearCache = ClearCache;
/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
/**
 * author: Ralph Varjabedian
 */
const object_hash_1 = __importDefault(require("object-hash"));
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
//const AsyncFunction = (async () => {}).constructor;
let cache = {};
function Cache(originalMethod, context) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError_1.default(`Decorator Cache is being used wrong on the method: ${methodName}`);
    }
    function replacement(...args) {
        var _a;
        const key = (0, object_hash_1.default)({
            className: ((_a = this === null || this === void 0 ? void 0 : this.constructor) === null || _a === void 0 ? void 0 : _a.name) || '',
            methodName,
            args,
        }).toString();
        if (key in cache) {
            return cache[key];
        }
        const result = originalMethod.apply(this, args);
        cache[key] = result;
        return result;
    }
    function asyncReplacement(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const key = (0, object_hash_1.default)({
                className: ((_a = this === null || this === void 0 ? void 0 : this.constructor) === null || _a === void 0 ? void 0 : _a.name) || '',
                methodName,
                args,
            }).toString();
            if (key in cache) {
                return cache[key];
            }
            const result = yield originalMethod.apply(this, args);
            cache[key] = result;
            return result;
        });
    }
    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
}
function ClearCache() {
    cache = {};
}
