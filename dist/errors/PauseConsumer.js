"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * throwing this error from modules will stop processing current event but never stop the consumers
 */
class PauseConsumer extends Error {
    constructor(seconds) {
        super();
        this.seconds = seconds;
    }
    getSeconds() {
        return this.seconds;
    }
}
exports.default = PauseConsumer;
