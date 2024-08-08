import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageWrongActionRule implements RuleInterface<IncomingMessagePayloadType> {
    getModuleName(): string {
        return 'process-message-wrong-action-rule';
    }

    async trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        await engine.pullDataObject('message-action', 0);
    }
}
