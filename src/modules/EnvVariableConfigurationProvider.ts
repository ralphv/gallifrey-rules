import ConfigurationInterface, { ConfigType } from '../interfaces/Providers/ConfigurationInterface';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import BaseConfig from '../lib/BaseConfig';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { EngineEventContextInterface } from '../engine-interfaces';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.Configuration)
export default class EnvVariableConfigurationProvider implements ConfigurationInterface {
    async getConfigurationAccessorInterface(
        context: EngineEventContextInterface | undefined,
        $config: ConfigType | undefined,
    ): Promise<ConfigurationAccessorInterface> {
        return new EnvVariableAccessor(context, $config);
    }

    getModuleName(): string {
        return ModuleNames.EnvVariableConfiguration;
    }
}

class EnvVariableAccessor extends BaseConfig implements ConfigurationAccessorInterface {
    constructor(
        private context: EngineEventContextInterface | undefined,
        private $config: ConfigType | undefined,
    ) {
        super('CONFIG_');
    }

    getModuleName(): string {
        return 'env-variable-configuration';
    }

    async getBooleanValue(key: string, defaultValue: boolean): Promise<boolean> {
        if (this.$config && key in this.$config) {
            return this.$config[key] as boolean;
        }
        return this.getBoolEnvVariable(this.getEnvKey(key), defaultValue, false);
    }

    // eslint-disable-next-line
    async getNumericValue(key: string, defaultValue: number): Promise<number> {
        if (this.$config && key in this.$config) {
            return this.$config[key] as number;
        }
        return this.getNumberEnvVariable(this.getEnvKey(key), defaultValue, false);
    }

    async getStringValue(key: string, defaultValue: string): Promise<string> {
        if (this.$config && key in this.$config) {
            return String(this.$config[key]);
        }
        return this.getEnvVariable(this.getEnvKey(key), defaultValue, false);
    }

    private getEnvKey(key: string) {
        // - to _
        // camelCase to spaces
        return key
            .replace(/-/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toUpperCase();
    }
}
