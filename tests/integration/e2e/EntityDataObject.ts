import { DataObjectInterface, EngineDataObjectInterface, GallifreyPlugin, PluginType } from '../../../src';

@GallifreyPlugin(PluginType.DataObject)
export default class EntityDataObject implements DataObjectInterface<number, string> {
    async get(engine: EngineDataObjectInterface<number>): Promise<string> {
        const data = `sample-data-${engine.getRequest()}`;
        engine.addResultIntoEventStore(data);
        return data;
    }

    getModuleName(): string {
        return 'entity-data-object';
    }
}
