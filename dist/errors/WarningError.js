"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * throwing this error from modules will not stop consumers, however the engine can be setup to stop after X amount of warnings
 */
class WarningError extends Error {
}
exports.default = WarningError;
