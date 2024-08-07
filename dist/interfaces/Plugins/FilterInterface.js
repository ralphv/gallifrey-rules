"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__FilterInterface = void 0;
class __FilterInterface {
    getModuleName() {
        return '';
    }
    canContinue(engine) {
        return Promise.resolve(false);
    }
}
exports.__FilterInterface = __FilterInterface;
