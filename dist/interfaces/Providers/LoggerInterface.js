"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__LoggerInterface = void 0;
class __LoggerInterface {
    debug(message, payload) {
        return Promise.reject('un-callable code');
    }
    error(message, payload) {
        return Promise.reject('un-callable code');
    }
    getModuleName() {
        return '';
    }
    info(message, payload) {
        return Promise.reject('un-callable code');
    }
    warn(message, payload) {
        return Promise.reject('un-callable code');
    }
}
exports.__LoggerInterface = __LoggerInterface;
