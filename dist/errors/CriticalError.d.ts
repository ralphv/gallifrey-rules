/**
 * No matter what mode, throwing this error from modules will immediately stop the consumers. Behavior can be modified from environment variables
 */
export default class CriticalError extends Error {
}
