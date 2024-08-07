import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import EngineEventInterface from '../engine-interfaces/EngineEventInterface';
export default class PushToTopicReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string;
    reactToEventFailure(engine: EngineEventInterface, payload: any, error: any): Promise<void>;
    reactToRuleFailure(engine: EngineEventInterface, payload: any, error: any, rule: string): Promise<void>;
}
