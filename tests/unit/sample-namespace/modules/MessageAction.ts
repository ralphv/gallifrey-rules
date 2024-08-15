import {
    ActionInterface,
    EngineActionInterface,
    EngineInterface,
    ExtendEngineRuleInterface,
    ExtendEngineRuleInterfaceHelper,
    GallifreyPlugin,
    PluginType,
} from '../../../../src';

declare module '../../../../src' {
    interface ExtendEngineRuleInterface {
        doMessageAction(payload: any): Promise<void>;
    }
}
ExtendEngineRuleInterfaceHelper({
    doMessageAction: (payload: any) => {
        return (this as ExtendEngineRuleInterface).doAction(payload);
    }
});

@GallifreyPlugin(PluginType.Action)
export default class MessageAction implements ActionInterface<any, any> {
    getModuleName(): string {
        return 'message-action';
    }

    async getModuleNamespaces?(): Promise<string[]> {
        return ['sample-namespace'];
    }

    async initialize?(engine: EngineInterface): Promise<void> {
        engine.info(`info`);
        engine.warn(`warn`);
        engine.error(`error`);
        engine.debug(`debug`);
        engine.getContext().getNamespace();
        await engine
            .getMetricsPoint(`sample`)
            .floatField('a', 10.1)
            .intField('b', -1)
            .uintField('c', 1)
            .tag('a', 'b')
            .tags([
                {
                    tag: 'c',
                    value: 'd',
                },
            ])
            .submit();
    }

    async trigger(engine: EngineActionInterface<any>): Promise<any> {
        void engine.getConfigurationAccessor().getStringValue(`sample`, 'sample');
        void engine.getConfigurationAccessor().getNumericValue(`sample`, 1);
        void engine.getConfigurationAccessor().getBooleanValue(`sample`, true);
        await engine
            .getMetricsPoint(`sample`)
            .floatField('a', 10.1)
            .intField('b', -1)
            .uintField('c', 1)
            .tag('a', 'b')
            .tags([
                {
                    tag: 'c',
                    value: 'd',
                },
            ])
            .submit();
        if (engine.getPayload() === 'throw') {
            throw new Error('action throws');
        }
        return Promise.resolve(undefined);
    }
}