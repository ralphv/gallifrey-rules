"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ActionInterface = void 0;
class __ActionInterface {
    getModuleName() {
        return '';
    }
    trigger(engine) {
        return Promise.reject('un-callable code');
    }
}
exports.__ActionInterface = __ActionInterface;
