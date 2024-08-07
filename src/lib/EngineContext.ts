import EngineContextInterface from '../engine-interfaces/EngineContextInterface';

export class EngineContext implements EngineContextInterface {
    constructor(private namespace: string) {}
    getNamespace(): string {
        return this.namespace;
    }
}
