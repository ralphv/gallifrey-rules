import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../src';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessNewEntityRule implements RuleInterface<any> {
    getModuleName(): string {
        return 'process-new-entity-rule';
    }

    async trigger(engine: EngineRuleInterface<any>): Promise<void> {
        engine.journal(`this is a journal message`);
        const response = await engine.pullDataObject<number, string>('entity-data-object', 123);
        engine.journal(`data from entity data: ${response}`);
        const response2 = await engine.pullDataObject<number, string>('entity-data-object', 123);
        engine.journal(`data2 from entity data: ${response2}`);
        const response3 = await engine.pullDataObject<number, string>('entity-data-object', 1234);
        engine.journal(`data3 from entity data for a new key: ${response3}`);
        const actionResponse = await engine.doAction('entity-action', response);
        engine.journal(`data from action: ${actionResponse as string}`);
        return Promise.resolve(undefined);
    }
}
