/**
 * throwing this error from modules will not stop consumers, however the engine can be setup to stop after X amount of warnings
 */
export default class WarningError extends Error {
}
