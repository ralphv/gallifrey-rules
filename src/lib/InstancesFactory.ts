import SchemaLoader from './SchemaLoader';
import ModulesLoader, { ModuleData } from './ModulesLoader';
import ConfigurationInterface from '../interfaces/Providers/ConfigurationInterface';
import { ProviderType } from '../interfaces/InterfaceDecorators';
import ModuleInterface, { WithModuleName, WithModuleNameType } from '../base-interfaces/ModuleInterface';
import EngineContextInterface from '../engine-interfaces/EngineContextInterface';
import { logger } from './logger';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import LoggerInterface from '../interfaces/Providers/LoggerInterface';
import MetricsInterface from '../interfaces/Providers/MetricsInterface';
import EngineBase from './EngineBase';
import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineCriticalError from '../errors/EngineCriticalError';
import GetMetricsPointDelegate from '../delegates-interfaces/GetMetricsPointDelegate';
import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import EventDispatcherInterface from '../interfaces/Providers/EventDispatcherInterface';
import { ActionQueuerInterface, ScheduledEventsInterface } from '../interfaces/Providers';
import DistributedLocksInterface from '../interfaces/Providers/DistributedLocksInterface';

export default class InstancesFactory {
    constructor(
        private schemaLoader: SchemaLoader,
        private modulesLoader: ModulesLoader,
    ) {}

    private async getProvider<T extends ModuleInterface>(
        engineContext: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface | undefined,
        providerName: string | null,
        providerType: ProviderType,
        providerDescription: string,
    ): Promise<WithModuleNameType<T>> {
        const instance = WithModuleName<T>(this.getProviderInstance(providerName, providerType, providerDescription));
        logger.info(`Initializing provider: ${providerDescription}`);
        if (instance.initialize) {
            const engineBase = new EngineBase(
                engineContext,
                undefined,
                configurationAccessor,
                `provider - ${instance.getModuleName()}`,
                undefined,
                undefined,
            );
            await instance.initialize(engineBase);
        }
        return instance;
    }

    private getProviderInstance<T extends ModuleInterface>(
        providerName: string | null,
        providerType: ProviderType,
        providerDescription: string,
    ): WithModuleNameType<T> {
        logger.info(`Requesting provider instance: ${providerDescription}`);
        // check if we have specs inside the schema first, if not we will check if they have
        if (!providerName) {
            const providers = this.modulesLoader.getModules().filter((a) => a.providerType === providerType);
            if (providers.length === 1) {
                logger.info(`Provider ${providerDescription} has a single module: ${providers[0].name}, using that.`);
                return WithModuleName<T>(new providers[0].classRef() as T);
            }
            const defaultProviders = this.modulesLoader
                .getModules()
                .filter((a) => a.providerType === providerType && a.isDefaultProvider);
            if (defaultProviders.length === 1) {
                logger.info(`Provider ${providerDescription} has a default module: ${providers[0].name}, using that.`);
                return WithModuleName<T>(new providers[0].classRef() as T);
            }
            throw new EngineCriticalError(
                `${providerDescription} provider is missing from schema, doesn't have a single provider loaded, nor a default provider`,
            );
        } else {
            const providers = this.modulesLoader
                .getModules()
                .filter((a) => a.providerType === providerType && a.name === providerName);
            if (providers.length === 1) {
                logger.info(`Create provider ${providerDescription} instance: ${providers[0].name}`);
                return WithModuleName<T>(new providers[0].classRef() as T);
            }
            throw new EngineCriticalError(`${providerDescription} provider specified "${providerName}" is not found.`);
        }
    }

    async getConfigurationInterfaceProvider(context: EngineContextInterface) {
        return await this.getProvider<ConfigurationInterface>(
            context,
            undefined,
            this.schemaLoader.getConfigurationInterfaceProvider(),
            ProviderType.Configuration,
            `Configuration`,
        );
    }

    async getJournalLoggerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ) {
        return await this.getProvider<JournalLoggerInterface>(
            context,
            configurationAccessor,
            this.schemaLoader.getJournalLoggerInterfaceProvider(),
            ProviderType.JournalLogger,
            `JournalLogger`,
        );
    }

    async getLoggerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ) {
        return await this.getProvider<LoggerInterface>(
            context,
            configurationAccessor,
            this.schemaLoader.getLoggerInterfaceProvider(),
            ProviderType.Logger,
            `Logger`,
        );
    }

    async getReactToFailureInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ) {
        return await this.getProvider<ReactToFailureInterface>(
            context,
            configurationAccessor,
            this.schemaLoader.getReactToFailureInterfaceProvider(),
            ProviderType.ReactToFailure,
            `ReactToFailure`,
        );
    }

    async getMetricsInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ) {
        return await this.getProvider<MetricsInterface>(
            context,
            configurationAccessor,
            this.schemaLoader.getMetricsInterfaceProvider(),
            ProviderType.Metrics,
            `Metrics`,
        );
    }

    async getModulesInstances<T extends ModuleInterface>(
        engineContext: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
        modules: ModuleData[],
        journalLogger: JournalLoggerInterface | undefined,
        getMetricsPointDelegate: GetMetricsPointDelegate | undefined,
    ): Promise<WithModuleNameType<T>[]> {
        const instances = modules.map((module) => {
            return WithModuleName(new module.classRef() as T);
        });

        await Promise.all(
            instances.map((instance) => {
                const engineBase = new EngineBase(
                    engineContext,
                    undefined,
                    configurationAccessor,
                    `initialize - ${WithModuleName(instance).getModuleName()}`,
                    journalLogger,
                    getMetricsPointDelegate,
                );
                return instance.initialize ? instance.initialize(engineBase) : Promise.resolve();
            }),
        );

        return instances;
    }

    getEventDispatcherProvider(eventDispatcher: string) {
        return this.getProviderInstance<WithModuleNameType<EventDispatcherInterface<any, any>>>(
            eventDispatcher,
            ProviderType.EventDispatcher,
            'EventDispatcher',
        );
    }

    async getScheduledEventsInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<ScheduledEventsInterface> {
        return await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getScheduledEventsInterfaceProvider(),
            ProviderType.ScheduledEvents,
            `ScheduledEvents`,
        );
    }

    async getDistributedLocksInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<WithModuleNameType<DistributedLocksInterface>> {
        return await this.getProvider<DistributedLocksInterface>(
            context,
            configurationAccessor,
            this.schemaLoader.getDistributedLocksInterfaceProvider(),
            ProviderType.DistributedLocks,
            `DistributedLocks`,
        );
    }

    async getActionQueuerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<WithModuleNameType<ActionQueuerInterface<any, any>>> {
        return await this.getProvider<ActionQueuerInterface<any, any>>(
            context,
            configurationAccessor,
            this.schemaLoader.getActionQueuerInterfaceProvider(),
            ProviderType.ActionQueuer,
            `ActionQueuer`,
        );
    }
}
