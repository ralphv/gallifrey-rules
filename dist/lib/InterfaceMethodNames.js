"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceNames = void 0;
exports.getMethodNames = getMethodNames;
exports.getInterfaceMethods = getInterfaceMethods;
/**
 * author: Ralph Varjabedian
 */
const JournalLoggerInterface_1 = require("../interfaces/Providers/JournalLoggerInterface");
const ActionQueuerInterface_1 = require("../interfaces/Providers/ActionQueuerInterface");
const LoggerInterface_1 = require("../interfaces/Providers/LoggerInterface");
const MetricsInterface_1 = require("../interfaces/Providers/MetricsInterface");
const ActiveEventsReferenceCounterInterface_1 = require("../interfaces/Providers/ActiveEventsReferenceCounterInterface");
const ConfigurationInterface_1 = require("../interfaces/Providers/ConfigurationInterface");
const ReactToFailureInterface_1 = require("../interfaces/Providers/ReactToFailureInterface");
const ScheduledEventsInterface_1 = require("../interfaces/Providers/ScheduledEventsInterface");
const EventDispatcherInterface_1 = require("../interfaces/Providers/EventDispatcherInterface");
const ActionInterface_1 = require("../interfaces/Plugins/ActionInterface");
const AsyncActionInterface_1 = require("../interfaces/Plugins/AsyncActionInterface");
const BatchAsyncActionInterface_1 = require("../interfaces/Plugins/BatchAsyncActionInterface");
const DataObjectInterface_1 = require("../interfaces/Plugins/DataObjectInterface");
const FilterInterface_1 = require("../interfaces/Plugins/FilterInterface");
const RuleInterface_1 = require("../interfaces/Plugins/RuleInterface");
const DistributedLocksInterface_1 = require("../interfaces/Providers/DistributedLocksInterface");
function MethodNames(ctor) {
    return getMethodNames(new ctor());
}
function getMethodNames(obj) {
    const methods = new Set();
    while (obj && obj !== Object.prototype) {
        const properties = Object.getOwnPropertyNames(obj);
        for (const property of properties) {
            // Check if the property is a method
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (typeof obj[property] === 'function' && property !== 'constructor') {
                methods.add(property);
            }
        }
        obj = Object.getPrototypeOf(obj);
    }
    return Array.from(methods);
}
var InterfaceNames;
(function (InterfaceNames) {
    // providers
    InterfaceNames["JournalLoggerInterface"] = "JournalLoggerInterface";
    InterfaceNames["ActionQueuerInterface"] = "ActionQueuerInterface";
    InterfaceNames["LoggerInterface"] = "LoggerInterface";
    InterfaceNames["MetricsInterface"] = "MetricsInterface";
    InterfaceNames["ActiveEventsReferenceCounterInterface"] = "ActiveEventsReferenceCounterInterface";
    InterfaceNames["ConfigurationInterface"] = "ConfigurationInterface";
    InterfaceNames["ReactToFailureInterface"] = "ReactToFailureInterface";
    InterfaceNames["ScheduledEventsInterface"] = "ScheduledEventsInterface";
    InterfaceNames["EventDispatcherInterface"] = "EventDispatcherInterface";
    InterfaceNames["DistributedLocksInterface"] = "DistributedLocksInterface";
    // plugins
    InterfaceNames["ActionInterface"] = "ActionInterface";
    InterfaceNames["AsyncActionInterface"] = "AsyncActionInterface";
    InterfaceNames["BatchAsyncActionInterface"] = "BatchAsyncActionInterface";
    InterfaceNames["DataObjectInterface"] = "DataObjectInterface";
    InterfaceNames["FilterInterface"] = "FilterInterface";
    InterfaceNames["RuleInterface"] = "RuleInterface";
})(InterfaceNames || (exports.InterfaceNames = InterfaceNames = {}));
const interfacesMethods = {
    // providers
    [InterfaceNames.JournalLoggerInterface]: MethodNames(JournalLoggerInterface_1.__JournalLoggerInterface),
    [InterfaceNames.ActionQueuerInterface]: MethodNames(ActionQueuerInterface_1.__ActionQueuerInterface),
    [InterfaceNames.LoggerInterface]: MethodNames(LoggerInterface_1.__LoggerInterface),
    [InterfaceNames.MetricsInterface]: MethodNames(MetricsInterface_1.__MetricsInterface),
    [InterfaceNames.ActiveEventsReferenceCounterInterface]: MethodNames(ActiveEventsReferenceCounterInterface_1.__ActiveEventsReferenceCounterInterface),
    [InterfaceNames.ConfigurationInterface]: MethodNames(ConfigurationInterface_1.__ConfigurationInterface),
    [InterfaceNames.ReactToFailureInterface]: MethodNames(ReactToFailureInterface_1.__ReactToFailureInterface),
    [InterfaceNames.ScheduledEventsInterface]: MethodNames(ScheduledEventsInterface_1.__ScheduledEventsInterface),
    [InterfaceNames.EventDispatcherInterface]: MethodNames(EventDispatcherInterface_1.__EventDispatcherInterface),
    [InterfaceNames.DistributedLocksInterface]: MethodNames(DistributedLocksInterface_1.__DistributedLocksInterface),
    // plugins
    [InterfaceNames.ActionInterface]: MethodNames(ActionInterface_1.__ActionInterface),
    [InterfaceNames.AsyncActionInterface]: MethodNames(AsyncActionInterface_1.__AsyncActionInterface),
    [InterfaceNames.BatchAsyncActionInterface]: MethodNames(BatchAsyncActionInterface_1.__BatchAsyncActionInterface),
    [InterfaceNames.DataObjectInterface]: MethodNames(DataObjectInterface_1.__DataObjectInterface),
    [InterfaceNames.FilterInterface]: MethodNames(FilterInterface_1.__FilterInterface),
    [InterfaceNames.RuleInterface]: MethodNames(RuleInterface_1.__RuleInterface),
};
function getInterfaceMethods(interfaceName) {
    return interfacesMethods[interfaceName];
}
