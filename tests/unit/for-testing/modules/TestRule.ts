import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../../src';
import TestDataObject from './TestDataObject';
import TestAction from './TestAction';

@GallifreyPlugin(PluginType.Rule)
export default class TestRule implements RuleInterface<any> {
    async trigger(engine: EngineRuleInterface<any>): Promise<void> {
        await engine.pullDataObject<{ key: string }, string>(TestDataObject.name, { key: '12345' });
        await engine.doAction<{ key: string }, string>(TestAction.name, { key: '12345' });
    }
}
