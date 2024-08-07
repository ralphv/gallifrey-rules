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
exports.DontThrowJustLog = DontThrowJustLog;
exports.TimeAndWarn = TimeAndWarn;
exports.BeforeExit = BeforeExit;
exports.TimeIt = TimeIt;
/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
/**
 * author: Ralph Varjabedian
 */
const logger_1 = require("./logger");
const CriticalError_1 = __importDefault(require("../errors/CriticalError"));
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
const Metrics_1 = require("./Metrics");
const InfluxDBMetricsProvider_1 = __importDefault(require("../modules/InfluxDBMetricsProvider"));
//const AsyncFunction = (async () => {}).constructor;
function DontThrowJustLog(originalMethod, context) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError_1.default(`Decorator DontThrowJustLog is being used wrong on the method: ${methodName}`);
    }
    function replacement(...args) {
        var _a;
        try {
            // in static, this is the class reference
            return originalMethod.apply(this, args);
        }
        catch (e) {
            if (e instanceof CriticalError_1.default) {
                throw e;
            }
            logger_1.logger.error(`method "${methodName}" threw an exception but is marked to not throw: ${String(e)} @${String((_a = e.stack) !== null && _a !== void 0 ? _a : '')}`);
        }
    }
    function asyncReplacement(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield originalMethod.apply(this, args);
            }
            catch (e) {
                if (e instanceof CriticalError_1.default) {
                    throw e;
                }
                logger_1.logger.error(`async method "${methodName}" threw an exception but is marked to not throw: ${String(e)} @${String((_a = e.stack) !== null && _a !== void 0 ? _a : '')}`);
            }
        });
    }
    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
    //return originalMethod instanceof AsyncFunction ? asyncReplacement : replacement; // this was failing when transpiled to node js!
}
function TimeAndWarn(thresholdMS = 10) {
    return (originalMethod, context) => {
        const methodName = String(context.name);
        if (context.kind !== 'method') {
            throw new EngineCriticalError_1.default(`Decorator TimeAndWarn is being used wrong on the method: ${methodName}`);
        }
        function replacement(...args) {
            const start = performance.now();
            try {
                return originalMethod.apply(this, args);
            }
            finally {
                const end = performance.now();
                const duration = end - start;
                if (duration >= thresholdMS) {
                    logger_1.logger.warn(`Warning: Function "${methodName}" execution time ${duration.toFixed(2)}ms exceeded the threshold of ${thresholdMS}ms. @${new Error().stack}`);
                }
            }
        }
        function asyncReplacement(...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const start = performance.now();
                try {
                    return yield originalMethod.apply(this, args);
                }
                finally {
                    const end = performance.now();
                    const duration = end - start;
                    if (duration > thresholdMS) {
                        logger_1.logger.warn(`Warning: Function "${methodName}" execution time ${duration.toFixed(2)}ms exceeded the threshold of ${thresholdMS}ms. @${new Error().stack}`);
                    }
                }
            });
        }
        return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
    };
}
const cleanupFunctions = [];
function BeforeExit(originalMethod, context) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError_1.default(`Decorator BeforeExit is being used wrong on the method: ${methodName}`);
    }
    if (context.kind === 'method' && typeof originalMethod === 'function' && originalMethod.length > 0) {
        throw new EngineCriticalError_1.default(`Decorator BeforeExit can only be used on methods without parameters.`);
    }
    context.addInitializer(function () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const instance = this;
        cleanupFunctions.push(() => __awaiter(this, void 0, void 0, function* () {
            try {
                return instance[methodName]();
            }
            catch (e) {
                console.trace(`Cleanup method "${methodName}" from BeforeExit decorator threw an exception: ${String(e)}`);
            }
        }));
    });
}
let beforeExitCalled = false;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
    /* istanbul ignore if */
    if (beforeExitCalled || cleanupFunctions.length === 0) {
        return;
    }
    beforeExitCalled = true;
    console.log('Process beforeExit, starting cleanup.');
    yield Promise.allSettled(cleanupFunctions.map((a) => a()));
    console.log('Cleanup done. Exiting now.');
}));
function TimeIt(originalMethod, context) {
    const methodName = String(context.name);
    if (context.kind !== 'method') {
        throw new EngineCriticalError_1.default(`Decorator TimeIt is being used wrong on the method: ${methodName}`);
    }
    function replacement(...args) {
        const start = performance.now();
        try {
            return originalMethod.apply(this, args);
        }
        finally {
            _timeIt(this.constructor.name, methodName, performance.now() - start);
        }
    }
    function asyncReplacement(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = performance.now();
            try {
                return yield originalMethod.apply(this, args);
            }
            finally {
                _timeIt(this.constructor.name, methodName, performance.now() - start);
            }
        });
    }
    return originalMethod.constructor.name === 'AsyncFunction' ? asyncReplacement : replacement;
}
let metrics;
function _timeIt(className, methodName, timerInMs) {
    if (!metrics) {
        metrics = new Metrics_1.Metrics(new InfluxDBMetricsProvider_1.default()); //todo hardcoded for now as this needs to run outside the engine
    }
    void metrics.timeIt(className, methodName, timerInMs);
}
