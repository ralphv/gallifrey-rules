"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * No matter what mode, throwing this error from will immediately stop the consumers, only the engine throws this
 */
class EngineCriticalError extends Error {
}
exports.default = EngineCriticalError;
