"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__AsyncActionInterface = void 0;
class __AsyncActionInterface {
    getModuleName() {
        return '';
    }
    trigger(engine) {
        return Promise.reject('un-callable code');
    }
}
exports.__AsyncActionInterface = __AsyncActionInterface;
