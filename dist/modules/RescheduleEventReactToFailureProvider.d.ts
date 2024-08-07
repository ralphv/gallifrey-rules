import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import EngineReactToFailure from '../lib/EngineReactToFailure';
export default class RescheduleEventReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string;
    reactToEventFailure(engine: EngineReactToFailure, payload: any, error: any): Promise<void>;
    reactToRuleFailure(): Promise<void>;
}
