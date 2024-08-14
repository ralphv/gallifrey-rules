import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';
import MessageDataObject from './MessageDataObject';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageWrongDataObjectRule implements RuleInterface<IncomingMessagePayloadType> {
    async trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        await engine.doAction(MessageDataObject.name, 0);
    }
}
