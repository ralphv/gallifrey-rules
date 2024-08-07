"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ReactToFailureInterface = void 0;
class __ReactToFailureInterface {
    getModuleName() {
        return '';
    }
    reactToEventFailure(engine, payload, error) {
        return Promise.reject('un-callable code');
    }
    reactToRuleFailure(engine, payload, error, rule) {
        return Promise.reject('un-callable code');
    }
}
exports.__ReactToFailureInterface = __ReactToFailureInterface;
