import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.ReactToFailure, true)
export default class DummyReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string {
        return ModuleNames.DummyReactToFailure;
    }

    reactToEventFailure(): Promise<void> {
        return Promise.resolve(undefined);
    }

    reactToRuleFailure(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
