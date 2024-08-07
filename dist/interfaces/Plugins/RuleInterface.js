"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__RuleInterface = void 0;
class __RuleInterface {
    getModuleName() {
        return '';
    }
    trigger(engine) {
        return Promise.reject('un-callable code');
    }
}
exports.__RuleInterface = __RuleInterface;
