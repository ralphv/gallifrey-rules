/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import ConfigurationAccessorInterface from './ConfigurationAccessorInterface';
import { EngineEventContextInterface } from '../../engine-interfaces';

export type ConfigType = { [key: string]: any };

export default interface ConfigurationInterface extends ModuleInterface {
    /**
     * Context is only available when called inside the eventContext of an event, which is not always the case.
     * @param eventContext
     * @param $config
     */
    getConfigurationAccessorInterface(
        eventContext: EngineEventContextInterface | undefined,
        $config: ConfigType | undefined,
    ): Promise<ConfigurationAccessorInterface>;
}

export class __ConfigurationInterface implements ConfigurationInterface {
    getConfigurationAccessorInterface(
        context: EngineEventContextInterface | undefined,
    ): Promise<ConfigurationAccessorInterface> {
        return Promise.reject('un-callable code');
    }

    getModuleName(): string {
        return '';
    }
}
