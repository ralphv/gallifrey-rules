import { DataObjectInterface, EngineDataObjectInterface, GallifreyPlugin, PluginType } from '../../../../src';

@GallifreyPlugin(PluginType.DataObject)
export default class TestDataObject implements DataObjectInterface<{ key: string }, string> {
    async get(engine: EngineDataObjectInterface<{ key: string }>): Promise<string> {
        return `sample-action: ${engine.getRequest().key}`;
    }
}
