"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Milliseconds timer
 */
class PerformanceTimer {
    constructor() {
        this.start = null;
        this.duration = 0;
    }
    pause() {
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
    end() {
        return this.pause();
    }
}
exports.default = PerformanceTimer;
