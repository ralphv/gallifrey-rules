"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeKafkaActionQueuerConfig = IsTypeKafkaActionQueuerConfig;
exports.IsTypeKafkaActionQueuerMessageType = IsTypeKafkaActionQueuerMessageType;
const BasicTypeGuards_1 = require("../BasicTypeGuards");
const Config_1 = __importDefault(require("../lib/Config"));
const Utils_1 = require("../lib/Utils");
const InterfaceDecorators_1 = require("../interfaces/InterfaceDecorators");
const ModuleNames_1 = require("../ModuleNames");
let KafkaActionQueuerProvider = (() => {
    let _classDecorators = [(0, InterfaceDecorators_1.GallifreyProvider)(InterfaceDecorators_1.ProviderType.ActionQueuer)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var KafkaActionQueuerProvider = _classThis = class {
        validateQueuerConfig(queuerConfig) {
            var _a, _b;
            if (!IsTypeKafkaActionQueuerConfig(queuerConfig)) {
                throw new Error(`KafkaActionQueuer queuerConfig is not valid config`);
            }
            const config = new Config_1.default();
            const brokers = (_a = queuerConfig.brokers) !== null && _a !== void 0 ? _a : config.getKafkaBrokers();
            const clientId = (_b = queuerConfig.clientId) !== null && _b !== void 0 ? _b : config.getKafkaClientID();
            if (!brokers || !clientId || brokers.length === 0) {
                throw new Error(`brokers or clientId are missing from both env variables or queuerConfig`);
            }
        }
        queueAction(queueRequest) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const config = new Config_1.default();
                const { queuerConfig } = queueRequest, restOfRequest = __rest(queueRequest, ["queuerConfig"]);
                const brokers = (_a = queuerConfig.brokers) !== null && _a !== void 0 ? _a : config.getKafkaBrokers();
                const clientId = (_b = queuerConfig.clientId) !== null && _b !== void 0 ? _b : config.getKafkaClientID();
                const topic = queuerConfig.topic;
                yield (0, Utils_1.produce)(clientId, brokers, topic, undefined, restOfRequest);
            });
        }
        getModuleName() {
            return ModuleNames_1.ModuleNames.KafkaActionQueuer;
        }
    };
    __setFunctionName(_classThis, "KafkaActionQueuerProvider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KafkaActionQueuerProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KafkaActionQueuerProvider = _classThis;
})();
exports.default = KafkaActionQueuerProvider;
function IsTypeKafkaActionQueuerConfig(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (0, BasicTypeGuards_1.IsString)(value.topic) && (0, BasicTypeGuards_1.IsArray)(value.brokers, true, BasicTypeGuards_1.IsString) && (0, BasicTypeGuards_1.IsString)(value.clientId, true);
}
function IsTypeKafkaActionQueuerMessageType(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (0, BasicTypeGuards_1.IsString)(value.namespace) && (0, BasicTypeGuards_1.IsString)(value.actionName);
}
