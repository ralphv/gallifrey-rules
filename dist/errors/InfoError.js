"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * throwing this error from modules will stop processing current event but never stop the consumers
 */
class InfoError extends Error {
}
exports.default = InfoError;
