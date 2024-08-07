/**
 * Milliseconds timer
 */
export default class PerformanceTimer {
    private start;
    private duration;
    pause(): number;
    resume(): this;
    end(): number;
}
