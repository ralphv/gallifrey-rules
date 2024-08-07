"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__MetricsInterface = void 0;
class __MetricsInterface {
    flush() {
        return Promise.reject('un-callable code');
    }
    getModuleName() {
        return '';
    }
    getPoint(measurementName) {
        throw new Error('un-callable code');
    }
}
exports.__MetricsInterface = __MetricsInterface;
