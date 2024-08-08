import { ActionInterface, AsyncAction, EngineActionInterface, GallifreyPlugin, PluginType } from '../../../../src';

@AsyncAction
@GallifreyPlugin(PluginType.Action)
export default class SampleAsyncNoInterfaceAction implements ActionInterface<any, any> {
    getModuleName(): string {
        return 'sample-async-no-interface-action';
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trigger(engine: EngineActionInterface<any>): Promise<any> {
        return Promise.resolve(undefined);
    }
}
