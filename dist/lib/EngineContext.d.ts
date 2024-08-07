import EngineContextInterface from '../engine-interfaces/EngineContextInterface';
export declare class EngineContext implements EngineContextInterface {
    private namespace;
    constructor(namespace: string);
    getNamespace(): string;
}
