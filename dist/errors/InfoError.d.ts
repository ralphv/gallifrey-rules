/**
 * throwing this error from modules will stop processing current event but never stop the consumers
 */
export default class InfoError extends Error {
}
