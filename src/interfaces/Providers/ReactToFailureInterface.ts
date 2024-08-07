/* eslint-disable @typescript-eslint/no-unused-vars */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import EngineReactToFailureInterface from '../../engine-interfaces/EngineReactToFailureInterface';

export default interface ReactToFailureInterface extends ModuleInterface {
    reactToEventFailure(engine: EngineReactToFailureInterface, payload: any, error: any): Promise<void>;
    reactToRuleFailure(engine: EngineReactToFailureInterface, payload: any, error: any, rule: string): Promise<void>;
}

export class __ReactToFailureInterface implements ReactToFailureInterface {
    getModuleName(): string {
        return '';
    }

    reactToEventFailure(engine: EngineReactToFailureInterface, payload: any, error: any): Promise<void> {
        return Promise.reject('un-callable code');
    }

    reactToRuleFailure(engine: EngineReactToFailureInterface, payload: any, error: any, rule: string): Promise<void> {
        return Promise.reject('un-callable code');
    }
}
