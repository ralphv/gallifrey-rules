import { ActionInterface, AsyncAction, EngineActionInterface, GallifreyPlugin, PluginType } from '../../src';

@AsyncAction
@GallifreyPlugin(PluginType.Action)
export default class AsyncEntityAction implements ActionInterface<string, string> {
    getModuleName(): string {
        return 'async-entity-action';
    }

    async trigger(engine: EngineActionInterface<string>): Promise<string> {
        return `action-processed: ${engine.getPayload().trim()}`;
    }
}
