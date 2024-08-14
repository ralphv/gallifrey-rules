import EnvVariableConfigurationProvider from '../../../../src/modules/EnvVariableConfigurationProvider';
import { EngineInterface, GallifreyProvider, ProviderType } from '../../../../src';

@GallifreyProvider(ProviderType.Configuration, true)
export default class EnvVariableConfigurationProvider2 extends EnvVariableConfigurationProvider {
    getModuleName(): string {
        return EnvVariableConfigurationProvider2.name;
    }

    async initialize(engine: EngineInterface): Promise<void> {
        engine.getContext().getNamespace();
    }
}
