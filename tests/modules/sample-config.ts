/* eslint-disable @typescript-eslint/no-unused-vars */
import EngineEventContextInterface from '../../src/engine-interfaces/EngineEventContextInterface';
import { EngineInterface, GallifreyProvider, ProviderType } from '../../src';
import ConfigurationInterface from '../../src/interfaces/Providers/ConfigurationInterface';
import ConfigurationAccessorInterface from '../../src/interfaces/Providers/ConfigurationAccessorInterface';

@GallifreyProvider(ProviderType.Configuration)
export default class SampleConfig implements ConfigurationInterface {
    getBooleanValue(
        context: EngineEventContextInterface,
        key: string,
        defaultValue: boolean | undefined,
    ): Promise<boolean | undefined> {
        return Promise.resolve(undefined);
    }

    getModuleName(): string {
        return 'sample-config';
    }

    getModuleNamespaces(): Promise<string[]> {
        return Promise.resolve([]);
    }

    getNumericValue(
        context: EngineEventContextInterface,
        key: string,
        defaultValue: number | undefined,
    ): Promise<number | undefined> {
        return Promise.resolve(undefined);
    }

    getStringValue(
        context: EngineEventContextInterface,
        key: string,
        defaultValue: string | undefined,
    ): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    initialize(context: EngineInterface): Promise<void> {
        return Promise.resolve(undefined);
    }

    getConfigurationAccessorInterface(): Promise<ConfigurationAccessorInterface> {
        return Promise.reject('dead code');
    }
}
