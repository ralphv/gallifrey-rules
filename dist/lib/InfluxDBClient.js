"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
/**
 * author: Ralph Varjabedian
 */
const Config_1 = __importDefault(require("./Config"));
const logger_1 = require("./logger");
const Decorators_1 = require("./Decorators");
const influxdb_client_1 = require("@influxdata/influxdb-client");
let InfluxDBClient = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _writeFloat_decorators;
    let _getPoint_decorators;
    let _writePoint_decorators;
    let _writeInt_decorators;
    let _shutdown_decorators;
    return _a = class InfluxDBClient {
            constructor(defaultTags = []) {
                this.defaultTags = (__runInitializers(this, _instanceExtraInitializers), defaultTags);
                this.writeAPI = undefined;
                const config = new Config_1.default();
                if (!config.getInfluxURL()) {
                    logger_1.logger.warn(`InfluxDB Url not found, disabling it`);
                    return;
                }
                /* istanbul ignore next */
                const client = new influxdb_client_1.InfluxDB({ url: config.getInfluxURL(), token: config.getInfluxDBToken().getSecretValue() });
                /* istanbul ignore next */
                this.writeAPI = client.getWriteApi(config.getInfluxDBOrg(), config.getInfluxDBBucket());
            }
            writeFloat(measurementName_1, fieldName_1, floatValue_1) {
                return __awaiter(this, arguments, void 0, function* (measurementName, fieldName, floatValue, tags = []) {
                    if (!this.writeAPI) {
                        return;
                    }
                    const point = new influxdb_client_1.Point(measurementName);
                    for (const tag of [...this.defaultTags, ...tags]) {
                        point.tag(tag.name, tag.value);
                    }
                    point.floatField(fieldName, floatValue);
                    this.writeAPI.writePoint(point);
                });
            }
            getPoint(measurementName) {
                return new influxdb_client_1.Point(measurementName);
            }
            writePoint(point) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!this.writeAPI) {
                        return;
                    }
                    return this.writeAPI.writePoint(point);
                });
            }
            writeInt(measurementName_1, fieldName_1, intValue_1) {
                return __awaiter(this, arguments, void 0, function* (measurementName, fieldName, intValue, tags = []) {
                    if (!this.writeAPI) {
                        return;
                    }
                    const point = new influxdb_client_1.Point(measurementName);
                    for (const tag of [...this.defaultTags, ...tags]) {
                        point.tag(tag.name, tag.value);
                    }
                    point.intField(fieldName, intValue);
                    this.writeAPI.writePoint(point);
                });
            }
            shutdown() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.writeAPI) {
                        yield this.writeAPI.close();
                    }
                });
            }
            flush() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.writeAPI) {
                        yield this.writeAPI.flush();
                    }
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _writeFloat_decorators = [(0, Decorators_1.TimeAndWarn)(3), Decorators_1.DontThrowJustLog];
            _getPoint_decorators = [Decorators_1.DontThrowJustLog];
            _writePoint_decorators = [Decorators_1.DontThrowJustLog];
            _writeInt_decorators = [(0, Decorators_1.TimeAndWarn)(3), Decorators_1.DontThrowJustLog];
            _shutdown_decorators = [Decorators_1.BeforeExit];
            __esDecorate(_a, null, _writeFloat_decorators, { kind: "method", name: "writeFloat", static: false, private: false, access: { has: obj => "writeFloat" in obj, get: obj => obj.writeFloat }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPoint_decorators, { kind: "method", name: "getPoint", static: false, private: false, access: { has: obj => "getPoint" in obj, get: obj => obj.getPoint }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _writePoint_decorators, { kind: "method", name: "writePoint", static: false, private: false, access: { has: obj => "writePoint" in obj, get: obj => obj.writePoint }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _writeInt_decorators, { kind: "method", name: "writeInt", static: false, private: false, access: { has: obj => "writeInt" in obj, get: obj => obj.writeInt }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _shutdown_decorators, { kind: "method", name: "shutdown", static: false, private: false, access: { has: obj => "shutdown" in obj, get: obj => obj.shutdown }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = InfluxDBClient;
