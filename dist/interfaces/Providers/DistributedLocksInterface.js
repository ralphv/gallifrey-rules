"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__DistributedLocksInterface = void 0;
class __DistributedLocksInterface {
    getModuleName() {
        return '';
    }
    acquireLock(lockId, maxWaitTime) {
        return Promise.reject('un-callable code');
    }
}
exports.__DistributedLocksInterface = __DistributedLocksInterface;
