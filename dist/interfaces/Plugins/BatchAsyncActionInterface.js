"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__BatchAsyncActionInterface = void 0;
class __BatchAsyncActionInterface {
    batchTriggerAsync(engine) {
        return Promise.reject('un-callable code');
    }
    getModuleName() {
        return '';
    }
    trigger(engine) {
        return Promise.reject('un-callable code');
    }
}
exports.__BatchAsyncActionInterface = __BatchAsyncActionInterface;
