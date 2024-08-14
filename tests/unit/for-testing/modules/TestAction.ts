import { ActionInterface, GallifreyPlugin, PluginType } from '../../../../src';
import EngineActionInterface from '../../../../src/engine-interfaces/EngineActionInterface';

@GallifreyPlugin(PluginType.Action)
export default class TestAction implements ActionInterface<{ key: string }, string> {
    async trigger(engine: EngineActionInterface<{ key: string }>): Promise<string> {
        return `sample-action: ${engine.getPayload().key}`;
    }
}
