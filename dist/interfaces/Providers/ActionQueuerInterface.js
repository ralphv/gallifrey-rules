"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ActionQueuerInterface = void 0;
class __ActionQueuerInterface {
    getModuleName() {
        return '';
    }
    validateQueuerConfig(queuerConfig) {
        // empty
    }
    queueAction(queueRequest) {
        return Promise.reject('dead code');
    }
}
exports.__ActionQueuerInterface = __ActionQueuerInterface;
