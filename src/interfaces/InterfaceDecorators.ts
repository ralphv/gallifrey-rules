/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const GallifreyPluginSymbol = Symbol();
const GallifreyProviderSymbol = Symbol();
const GallifreyPluginTagsSymbol = Symbol();

export enum PluginType {
    Action = 'Action',
    //AsyncAction = 'AsyncAction',
    //BatchAsyncAction = 'BatchAsyncAction',
    DataObject = 'DataObject',
    Filter = 'Filter',
    Rule = 'Rule',
}

export enum ProviderType {
    ActionQueuer = 'ActionQueuer',
    ActiveEventsReferenceCounter = 'ActiveEventsReferenceCounter',
    Configuration = 'Configuration',
    JournalLogger = 'JournalLogger',
    Logger = 'Logger',
    Metrics = 'Metrics',
    ScheduledEvents = 'ScheduledEvents',
    ReactToFailure = 'ReactToFailure',
    EventDispatcher = 'EventDispatcher',
    DistributedLocks = 'DistributedLocks',
}

export function GallifreyPlugin(pluginType: PluginType) {
    return function (originalClass: any) {
        originalClass[GallifreyPluginSymbol] = {
            className: originalClass.name,
            pluginType: pluginType,
        };
    };
}

export function getGallifreyPluginType(classReference: any): {
    pluginType: PluginType | undefined;
    className: string | undefined;
} {
    if (!(GallifreyPluginSymbol in classReference)) {
        return { pluginType: undefined, className: undefined };
    }
    return {
        pluginType: classReference[GallifreyPluginSymbol]['pluginType'] as PluginType,
        className: classReference[GallifreyPluginSymbol]['className'],
    };
}

export function GallifreyProvider(providerType: ProviderType, isDefault?: boolean) {
    return function (originalClass: any) {
        originalClass[GallifreyProviderSymbol] = {
            className: originalClass.name,
            providerType: providerType,
            isDefault: isDefault ?? false,
        };
    };
}

export function getGallifreyProviderType(classReference: any): {
    providerType: ProviderType | undefined;
    isDefault: boolean;
    className: string | undefined;
} {
    if (!(GallifreyProviderSymbol in classReference)) {
        return { providerType: undefined, isDefault: false, className: undefined };
    }
    return {
        providerType: classReference[GallifreyProviderSymbol].providerType,
        isDefault: classReference[GallifreyProviderSymbol].isDefault,
        className: classReference[GallifreyProviderSymbol].className,
    };
}

export const AsyncActionTag = 'AsyncAction';

function defineGallifreyTagDecorator(tag: string, originalClass: any): void {
    if (!(GallifreyPluginTagsSymbol in originalClass)) {
        originalClass[GallifreyPluginTagsSymbol] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    originalClass[GallifreyPluginTagsSymbol].push(tag);
}

export function getGallifreyTags(classReference: any): string[] {
    return classReference[GallifreyPluginTagsSymbol] ?? [];
}

// define Tags Decorators
export function AsyncAction(originalClass: any) {
    defineGallifreyTagDecorator(AsyncActionTag, originalClass);
}
