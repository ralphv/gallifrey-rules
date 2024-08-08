import { AsyncAction, AsyncActionInterface, EngineActionInterface, GallifreyPlugin, PluginType } from '../../../../src';

@AsyncAction
@GallifreyPlugin(PluginType.Action)
export default class SampleAsyncNoInterfaceAction implements AsyncActionInterface<any, any> {
    getModuleName(): string {
        return 'sample-async-action';
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trigger(engine: EngineActionInterface<any>): Promise<any> {
        return Promise.resolve(undefined);
    }
}
