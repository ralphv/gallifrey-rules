"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineContext = void 0;
class EngineContext {
    constructor(namespace) {
        this.namespace = namespace;
    }
    getNamespace() {
        return this.namespace;
    }
}
exports.EngineContext = EngineContext;
