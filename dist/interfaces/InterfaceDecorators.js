"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncActionTag = exports.ProviderType = exports.PluginType = void 0;
exports.GallifreyPlugin = GallifreyPlugin;
exports.getGallifreyPluginType = getGallifreyPluginType;
exports.GallifreyProvider = GallifreyProvider;
exports.getGallifreyProviderType = getGallifreyProviderType;
exports.getGallifreyTags = getGallifreyTags;
exports.AsyncAction = AsyncAction;
const GallifreyPluginSymbol = Symbol();
const GallifreyProviderSymbol = Symbol();
const GallifreyPluginTagsSymbol = Symbol();
var PluginType;
(function (PluginType) {
    PluginType["Action"] = "Action";
    //AsyncAction = 'AsyncAction',
    //BatchAsyncAction = 'BatchAsyncAction',
    PluginType["DataObject"] = "DataObject";
    PluginType["Filter"] = "Filter";
    PluginType["Rule"] = "Rule";
})(PluginType || (exports.PluginType = PluginType = {}));
var ProviderType;
(function (ProviderType) {
    ProviderType["ActionQueuer"] = "ActionQueuer";
    ProviderType["ActiveEventsReferenceCounter"] = "ActiveEventsReferenceCounter";
    ProviderType["Configuration"] = "Configuration";
    ProviderType["JournalLogger"] = "JournalLogger";
    ProviderType["Logger"] = "Logger";
    ProviderType["Metrics"] = "Metrics";
    ProviderType["ScheduledEvents"] = "ScheduledEvents";
    ProviderType["ReactToFailure"] = "ReactToFailure";
    ProviderType["EventDispatcher"] = "EventDispatcher";
    ProviderType["DistributedLocks"] = "DistributedLocks";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
function GallifreyPlugin(pluginType) {
    return function (originalClass) {
        originalClass[GallifreyPluginSymbol] = {
            className: originalClass.name,
            pluginType: pluginType,
        };
    };
}
function getGallifreyPluginType(classReference) {
    if (!(GallifreyPluginSymbol in classReference)) {
        return { pluginType: undefined, className: undefined };
    }
    return {
        pluginType: classReference[GallifreyPluginSymbol]['pluginType'],
        className: classReference[GallifreyPluginSymbol]['className'],
    };
}
function GallifreyProvider(providerType, isDefault) {
    return function (originalClass) {
        originalClass[GallifreyProviderSymbol] = {
            className: originalClass.name,
            providerType: providerType,
            isDefault: isDefault !== null && isDefault !== void 0 ? isDefault : false,
        };
    };
}
function getGallifreyProviderType(classReference) {
    if (!(GallifreyProviderSymbol in classReference)) {
        return { providerType: undefined, isDefault: false, className: undefined };
    }
    return {
        providerType: classReference[GallifreyProviderSymbol].providerType,
        isDefault: classReference[GallifreyProviderSymbol].isDefault,
        className: classReference[GallifreyProviderSymbol].className,
    };
}
exports.AsyncActionTag = 'AsyncAction';
function defineGallifreyTagDecorator(tag, originalClass) {
    if (!(GallifreyPluginTagsSymbol in originalClass)) {
        originalClass[GallifreyPluginTagsSymbol] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    originalClass[GallifreyPluginTagsSymbol].push(tag);
}
function getGallifreyTags(classReference) {
    var _a;
    return (_a = classReference[GallifreyPluginTagsSymbol]) !== null && _a !== void 0 ? _a : [];
}
// define Tags Decorators
function AsyncAction(originalClass) {
    defineGallifreyTagDecorator(exports.AsyncActionTag, originalClass);
}
