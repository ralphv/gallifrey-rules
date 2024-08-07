import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
export default class DummyReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string;
    reactToEventFailure(): Promise<void>;
    reactToRuleFailure(): Promise<void>;
}
