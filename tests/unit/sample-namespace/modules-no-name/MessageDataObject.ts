import { DataObjectInterface, EngineDataObjectInterface, GallifreyPlugin, PluginType } from '../../../../src';
import EngineInterface from '../../../../src/engine-interfaces/EngineInterface';

@GallifreyPlugin(PluginType.DataObject)
export default class MessageDataObject implements DataObjectInterface<any, string> {
    async initialize?(engine: EngineInterface): Promise<void> {
        engine.info(`info`);
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

    async get(engine: EngineDataObjectInterface<any>): Promise<string> {
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
        engine.getRequest();
        if (engine.getRequest() === 'throw') {
            throw new Error('data object throws');
        }
        return Promise.resolve('data');
    }
}
