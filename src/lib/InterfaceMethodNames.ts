/**
 * author: Ralph Varjabedian
 */
import { __JournalLoggerInterface } from '../interfaces/Providers/JournalLoggerInterface';
import { __ActionQueuerInterface } from '../interfaces/Providers/ActionQueuerInterface';
import { __LoggerInterface } from '../interfaces/Providers/LoggerInterface';
import { __MetricsInterface } from '../interfaces/Providers/MetricsInterface';
import { __ActiveEventsReferenceCounterInterface } from '../interfaces/Providers/ActiveEventsReferenceCounterInterface';
import { __ConfigurationInterface } from '../interfaces/Providers/ConfigurationInterface';
import { __ReactToFailureInterface } from '../interfaces/Providers/ReactToFailureInterface';
import { __ScheduledEventsInterface } from '../interfaces/Providers/ScheduledEventsInterface';
import { __EventDispatcherInterface } from '../interfaces/Providers/EventDispatcherInterface';
import { __ActionInterface } from '../interfaces/Plugins/ActionInterface';
import { __AsyncActionInterface } from '../interfaces/Plugins/AsyncActionInterface';
import { __BatchAsyncActionInterface } from '../interfaces/Plugins/BatchAsyncActionInterface';
import { __DataObjectInterface } from '../interfaces/Plugins/DataObjectInterface';
import { __FilterInterface } from '../interfaces/Plugins/FilterInterface';
import { __RuleInterface } from '../interfaces/Plugins/RuleInterface';
import { __DistributedLocksInterface } from '../interfaces/Providers/DistributedLocksInterface';

type Constructor<T> = new () => T;
function MethodNames<T>(ctor: Constructor<T>): string[] {
    return getMethodNames(new ctor());
}

export function getMethodNames<T>(obj: T): string[] {
    const methods = new Set<string>();
    while (obj && obj !== Object.prototype) {
        const properties = Object.getOwnPropertyNames(obj);
        for (const property of properties) {
            // Check if the property is a method
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (typeof (obj as any)[property] === 'function' && property !== 'constructor') {
                methods.add(property);
            }
        }
        obj = Object.getPrototypeOf(obj);
    }

    return Array.from(methods);
}

export enum InterfaceNames {
    // providers
    JournalLoggerInterface = 'JournalLoggerInterface',
    ActionQueuerInterface = 'ActionQueuerInterface',
    LoggerInterface = 'LoggerInterface',
    MetricsInterface = 'MetricsInterface',
    ActiveEventsReferenceCounterInterface = 'ActiveEventsReferenceCounterInterface',
    ConfigurationInterface = 'ConfigurationInterface',
    ReactToFailureInterface = 'ReactToFailureInterface',
    ScheduledEventsInterface = 'ScheduledEventsInterface',
    EventDispatcherInterface = 'EventDispatcherInterface',
    DistributedLocksInterface = 'DistributedLocksInterface',
    // plugins
    ActionInterface = 'ActionInterface',
    AsyncActionInterface = 'AsyncActionInterface',
    BatchAsyncActionInterface = 'BatchAsyncActionInterface',
    DataObjectInterface = 'DataObjectInterface',
    FilterInterface = 'FilterInterface',
    RuleInterface = 'RuleInterface',
}

const interfacesMethods: { [key: string]: any } = {
    // providers
    [InterfaceNames.JournalLoggerInterface]: MethodNames(__JournalLoggerInterface),
    [InterfaceNames.ActionQueuerInterface]: MethodNames(__ActionQueuerInterface),
    [InterfaceNames.LoggerInterface]: MethodNames(__LoggerInterface),
    [InterfaceNames.MetricsInterface]: MethodNames(__MetricsInterface),
    [InterfaceNames.ActiveEventsReferenceCounterInterface]: MethodNames(__ActiveEventsReferenceCounterInterface),
    [InterfaceNames.ConfigurationInterface]: MethodNames(__ConfigurationInterface),
    [InterfaceNames.ReactToFailureInterface]: MethodNames(__ReactToFailureInterface),
    [InterfaceNames.ScheduledEventsInterface]: MethodNames(__ScheduledEventsInterface),
    [InterfaceNames.EventDispatcherInterface]: MethodNames(__EventDispatcherInterface),
    [InterfaceNames.DistributedLocksInterface]: MethodNames(__DistributedLocksInterface),
    // plugins
    [InterfaceNames.ActionInterface]: MethodNames(__ActionInterface),
    [InterfaceNames.AsyncActionInterface]: MethodNames(__AsyncActionInterface),
    [InterfaceNames.BatchAsyncActionInterface]: MethodNames(__BatchAsyncActionInterface),
    [InterfaceNames.DataObjectInterface]: MethodNames(__DataObjectInterface),
    [InterfaceNames.FilterInterface]: MethodNames(__FilterInterface),
    [InterfaceNames.RuleInterface]: MethodNames(__RuleInterface),
};

export function getInterfaceMethods(interfaceName: InterfaceNames): any {
    return interfacesMethods[interfaceName];
}
