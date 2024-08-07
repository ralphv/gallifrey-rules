import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageRule implements RuleInterface<IncomingMessagePayloadType> {
    getModuleName(): string {
        return 'process-message-wrong-data-object-rule';
    }

    async trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        await engine.doAction('message-data-object', 0);
    }
}
