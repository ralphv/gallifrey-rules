import ConfigurationInterface, { ConfigType } from '../interfaces/Providers/ConfigurationInterface';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import { EngineEventContextInterface } from '../engine-interfaces';
export default class EnvVariableConfigurationProvider implements ConfigurationInterface {
    getConfigurationAccessorInterface(context: EngineEventContextInterface | undefined, $config: ConfigType | undefined): Promise<ConfigurationAccessorInterface>;
    getModuleName(): string;
}
