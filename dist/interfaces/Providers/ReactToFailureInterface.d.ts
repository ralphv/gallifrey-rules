import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineReactToFailureInterface from '../../engine-interfaces/EngineReactToFailureInterface';
export default interface ReactToFailureInterface extends ModuleInterface {
    reactToEventFailure(engine: EngineReactToFailureInterface, payload: any, error: any): Promise<void>;
    reactToRuleFailure(engine: EngineReactToFailureInterface, payload: any, error: any, rule: string): Promise<void>;
}
export declare class __ReactToFailureInterface implements ReactToFailureInterface {
    getModuleName(): string;
    reactToEventFailure(engine: EngineReactToFailureInterface, payload: any, error: any): Promise<void>;
    reactToRuleFailure(engine: EngineReactToFailureInterface, payload: any, error: any, rule: string): Promise<void>;
}
