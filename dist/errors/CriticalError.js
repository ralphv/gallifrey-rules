"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * No matter what mode, throwing this error from modules will immediately stop the consumers. Behavior can be modified from environment variables
 */
class CriticalError extends Error {
}
exports.default = CriticalError;
