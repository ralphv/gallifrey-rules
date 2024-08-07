"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallifreyRulesEngineForTesting = void 0;
const GallifreyRulesEngine_1 = require("./GallifreyRulesEngine");
const Utils_1 = require("./lib/Utils");
/**
 * Allows for easier testing
 *  1. Disable actions
 *  2. Use pullDataObject hook to provide fake data
 */
class GallifreyRulesEngineForTesting extends GallifreyRulesEngine_1.GallifreyRulesEngine {
    constructor() {
        super(...arguments);
        this.disabledActions = {};
    }
    disableAction(actionName) {
        this.disabledActions[actionName] = true;
    }
    attachPullDataObjectHook(hook) {
        this.pullDataObjectHook = hook;
    }
    isActionDisabled(actionName) {
        return actionName in this.disabledActions;
    }
    isPullDataObjectHookAttached() {
        return this.pullDataObjectHook !== undefined;
    }
    callPullDataObject(dataObjectName, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Utils_1.AssertNotNull)(this.pullDataObjectHook)(dataObjectName, request);
        });
    }
}
exports.GallifreyRulesEngineForTesting = GallifreyRulesEngineForTesting;
