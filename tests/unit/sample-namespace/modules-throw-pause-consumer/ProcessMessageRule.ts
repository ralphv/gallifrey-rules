/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unused-vars */
import { EngineRuleInterface, GallifreyPlugin, PauseConsumer, PluginType, RuleInterface } from '../../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageRule implements RuleInterface<IncomingMessagePayloadType> {
    getModuleName(): string {
        return 'process-message-rule';
    }

    trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        throw new PauseConsumer(1);
    }
}
