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
Object.defineProperty(exports, "__esModule", { value: true });
const InterfaceDecorators_1 = require("../interfaces/InterfaceDecorators");
const index_1 = require("../index");
let RescheduleEventReactToFailureProvider = (() => {
    let _classDecorators = [(0, InterfaceDecorators_1.GallifreyProvider)(InterfaceDecorators_1.ProviderType.ReactToFailure)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RescheduleEventReactToFailureProvider = _classThis = class {
        getModuleName() {
            return index_1.ModuleNames.RescheduleEventReactToFailure;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        reactToEventFailure(engine, payload, error) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const maxRescheduleCount = yield engine.getConfigurationAccessor().getNumericValue('max-reschedule-count', 5);
                const rescheduleDelaySeconds = yield engine
                    .getConfigurationAccessor()
                    .getNumericValue('reschedule-delay', 5 * 60); // 5 minutes into future
                const countSoFar = (_b = (_a = engine.getScheduledEventContext()) === null || _a === void 0 ? void 0 : _a.scheduledCount) !== null && _b !== void 0 ? _b : 0;
                if (countSoFar >= maxRescheduleCount) {
                    engine.warn(`Max reschedule count reached, react to failure will not reschedule this event, it will be ignored`);
                    return;
                }
                // Get the current date and time
                const now = new Date();
                const future = new Date(now.getTime() + rescheduleDelaySeconds * 1000);
                yield engine.insertScheduledEvent({
                    namespace: engine.getEventContext().getNamespace(),
                    entityName: engine.getEventContext().getEntityName(),
                    eventName: engine.getEventContext().getEventName(),
                    eventId: `${engine.getEventContext().getEventID()}`,
                    payload: Object.assign({}, payload),
                    source: engine.getEventContext().getSource(),
                }, future);
            });
        }
        reactToRuleFailure() {
            return __awaiter(this, void 0, void 0, function* () {
                throw new index_1.CriticalError(`RescheduleEventReactToFailureProvider doesn't work with individual react to rule failures. You need to set GF_FAIL_EVENT_ON_SINGLE_RULE_FAIL to false`);
            });
        }
    };
    __setFunctionName(_classThis, "RescheduleEventReactToFailureProvider");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RescheduleEventReactToFailureProvider = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RescheduleEventReactToFailureProvider = _classThis;
})();
exports.default = RescheduleEventReactToFailureProvider;
