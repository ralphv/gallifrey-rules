import { ActionInterface, EngineActionInterface, GallifreyPlugin, PluginType } from '../../src';

@GallifreyPlugin(PluginType.Action)
export default class EntityAction implements ActionInterface<string, string> {
    getModuleName(): string {
        return 'entity-action';
    }

    async trigger(engine: EngineActionInterface<string>): Promise<string> {
        return `action-processed: ${engine.getPayload().trim()}`;
    }
}
