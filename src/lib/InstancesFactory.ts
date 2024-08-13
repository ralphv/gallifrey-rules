import SchemaLoader from './SchemaLoader';
import ModulesLoader, { ModuleData } from './ModulesLoader';
import ConfigurationInterface from '../interfaces/Providers/ConfigurationInterface';
import { ProviderType } from '../interfaces/InterfaceDecorators';
import ModuleInterface from '../base-interfaces/ModuleInterface';
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

    private async getProvider(
        engineContext: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface | undefined,
        providerName: string | null,
        providerType: ProviderType,
        providerDescription: string,
    ) {
        const instance = this.getProviderInstance(providerName, providerType, providerDescription);
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

    private getProviderInstance(
        providerName: string | null,
        providerType: ProviderType,
        providerDescription: string,
    ): ModuleInterface {
        logger.info(`Requesting provider instance: ${providerDescription}`);
        // check if we have specs inside the schema first, if not we will check if they have
        if (!providerName) {
            const providers = this.modulesLoader.getModules().filter((a) => a.providerType === providerType);
            if (providers.length === 1) {
                logger.info(`Provider ${providerDescription} has a single module: ${providers[0].name}, using that.`);
                return new providers[0].classRef();
            }
            const defaultProviders = this.modulesLoader
                .getModules()
                .filter((a) => a.providerType === providerType && a.isDefaultProvider);
            if (defaultProviders.length === 1) {
                logger.info(`Provider ${providerDescription} has a default module: ${providers[0].name}, using that.`);
                return new providers[0].classRef();
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
                return new providers[0].classRef();
            }
            throw new EngineCriticalError(`${providerDescription} provider specified "${providerName}" is not found.`);
        }
    }

    async getConfigurationInterfaceProvider(context: EngineContextInterface): Promise<ConfigurationInterface> {
        return (await this.getProvider(
            context,
            undefined,
            this.schemaLoader.getConfigurationInterfaceProvider(),
            ProviderType.Configuration,
            `Configuration`,
        )) as ConfigurationInterface;
    }

    async getJournalLoggerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<JournalLoggerInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getJournalLoggerInterfaceProvider(),
            ProviderType.JournalLogger,
            `JournalLogger`,
        )) as JournalLoggerInterface;
    }

    async getLoggerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<LoggerInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getLoggerInterfaceProvider(),
            ProviderType.Logger,
            `Logger`,
        )) as LoggerInterface;
    }

    async getReactToFailureInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<ReactToFailureInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getReactToFailureInterfaceProvider(),
            ProviderType.ReactToFailure,
            `ReactToFailure`,
        )) as ReactToFailureInterface;
    }

    async getMetricsInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<MetricsInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getMetricsInterfaceProvider(),
            ProviderType.Metrics,
            `Metrics`,
        )) as MetricsInterface;
    }

    async getModulesInstances(
        engineContext: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
        modules: ModuleData[],
        journalLogger: JournalLoggerInterface | undefined,
        getMetricsPointDelegate: GetMetricsPointDelegate | undefined,
    ) {
        const instances = modules.map((module) => {
            return new module.classRef();
        });

        await Promise.all(
            instances.map((instance) => {
                const engineBase = new EngineBase(
                    engineContext,
                    undefined,
                    configurationAccessor,
                    `initialize - ${instance.getModuleName()}`,
                    journalLogger,
                    getMetricsPointDelegate,
                );
                return instance.initialize ? instance.initialize(engineBase) : Promise.resolve();
            }),
        );
        return instances;
    }

    getEventDispatcherProvider(eventDispatcher: string) {
        return this.getProviderInstance(
            eventDispatcher,
            ProviderType.EventDispatcher,
            'EventDispatcher',
        ) as EventDispatcherInterface<any, any>;
    }

    async getScheduledEventsInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<ScheduledEventsInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getScheduledEventsInterfaceProvider(),
            ProviderType.ScheduledEvents,
            `ScheduledEvents`,
        )) as ScheduledEventsInterface;
    }

    async getDistributedLocksInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<DistributedLocksInterface> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getDistributedLocksInterfaceProvider(),
            ProviderType.DistributedLocks,
            `DistributedLocks`,
        )) as DistributedLocksInterface;
    }

    async getActionQueuerInterfaceProvider(
        context: EngineContextInterface,
        configurationAccessor: ConfigurationAccessorInterface,
    ): Promise<ActionQueuerInterface<any, any>> {
        return (await this.getProvider(
            context,
            configurationAccessor,
            this.schemaLoader.getActionQueuerInterfaceProvider(),
            ProviderType.ActionQueuer,
            `ActionQueuer`,
        )) as ActionQueuerInterface<any, any>;
    }
}
