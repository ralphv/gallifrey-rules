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
const PerformanceTimer_1 = __importDefault(require("./lib/PerformanceTimer"));
const Config_1 = __importDefault(require("./lib/Config"));
const logger_1 = require("./lib/logger");
class DistributedLocksWrapper {
    constructor(inner, metrics) {
        this.inner = inner;
        this.metrics = metrics;
        const config = new Config_1.default();
        this.enabledLocks = config.isDistributedLocksEnabled();
        this.waitTimeInMs = config.getDistributedLocksMaxWaitTimeInSeconds() * 1000;
    }
    acquireLock(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabledLocks) {
                // return dummy lock
                return {
                    acquired: true,
                    release: () => __awaiter(this, void 0, void 0, function* () { }),
                };
            }
            // lock on namespace/entity/entityID
            const lockId = `${event.namespace}-${event.entityName}-${event.eventId}`;
            const timer = new PerformanceTimer_1.default().resume();
            try {
                logger_1.logger.info(`Starting acquireLock: ${lockId}`);
                const { release, acquired } = yield this.inner.acquireLock(lockId, this.waitTimeInMs);
                if (acquired) {
                    logger_1.logger.info(`Acquired Lock successfully: ${lockId}`);
                }
                else {
                    logger_1.logger.error(`Failed to acquire Lock: ${lockId}`);
                }
                const duration = timer.end();
                this.metrics.timeAcquireLock(event, duration, true);
                return {
                    release: () => __awaiter(this, void 0, void 0, function* () {
                        const timer = new PerformanceTimer_1.default().resume();
                        try {
                            yield release();
                            const duration = timer.end();
                            this.metrics.timeReleaseLock(event, duration, true);
                        }
                        catch (e) {
                            const duration = timer.end();
                            this.metrics.timeReleaseLock(event, duration, false);
                            throw e;
                        }
                    }),
                    acquired,
                };
            }
            catch (e) {
                const duration = timer.end();
                this.metrics.timeAcquireLock(event, duration, false);
                logger_1.logger.debug(`Failed to acquire lock exception: ${lockId}: ${String(e)}`);
                throw e;
            }
        });
    }
}
exports.default = DistributedLocksWrapper;
