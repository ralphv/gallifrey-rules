/**
 * No matter what mode, throwing this error from will immediately stop the consumers, only the engine throws this
 */
export default class EngineCriticalError extends Error {
}
