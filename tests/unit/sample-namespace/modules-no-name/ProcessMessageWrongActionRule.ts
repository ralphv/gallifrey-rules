import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';
import MessageAction from './MessageAction';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageWrongActionRule implements RuleInterface<IncomingMessagePayloadType> {
    async trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        await engine.pullDataObject(MessageAction.name, 0);
    }
}
