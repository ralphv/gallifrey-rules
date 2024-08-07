/**
 * Milliseconds timer
 */
export default class PerformanceTimer {
    private start: DOMHighResTimeStamp | null = null;
    private duration: number = 0;

    pause(): number {
        if (this.start) {
            const end = performance.now();
            this.duration += end - this.start;
            this.start = null;
        }
        return this.duration;
    }

    resume() {
        if (!this.start) {
            this.start = performance.now();
        }
        return this;
    }

    end(): number {
        return this.pause();
    }
}
