import {
    CriticalError,
    EngineRuleInterface,
    GallifreyPlugin,
    InfoError,
    PluginType,
    RuleInterface,
    WarningError,
} from '../../../../src';
import { IncomingMessagePayloadType } from '../IncomingMessagePayloadType';
import EngineInterface from '../../../../src/engine-interfaces/EngineInterface';
import EngineCriticalError from '../../../../src/errors/EngineCriticalError';
import MessageAction from './MessageAction';
import MessageDataObject from './MessageDataObject';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessMessageRule implements RuleInterface<IncomingMessagePayloadType> {
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

    async trigger(engine: EngineRuleInterface<IncomingMessagePayloadType>): Promise<void> {
        if (engine.getEventPayload().dataObjectNotFound) {
            await engine.pullDataObject('not-found', 0);
        }
        if (engine.getEventPayload().actionNotFound) {
            await engine.doAction('not-found', 0);
        }
        engine.getEventContext().getEventName();
        engine.getEventContext().getNamespace();
        engine.getEventContext().getEntityName();
        engine.getEventContext().getEventID();
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
        if (engine.getEventPayload().actionThrow) {
            await engine.doAction(MessageAction.name, 'throw');
        } else {
            await engine.doAction(MessageAction.name, 0);
        }
        if (engine.getEventPayload().dataObjectThrow) {
            await engine.pullDataObject(MessageDataObject.name, 'throw');
        } else {
            await engine.pullDataObject(MessageDataObject.name, 0);
        }
        if (engine.getEventPayload()?.throwWarning) {
            throw new WarningError(`warning`);
        }
        if (engine.getEventPayload()?.throwInfo) {
            throw new InfoError(`info`);
        }
        if (engine.getEventPayload()?.throwError) {
            throw new Error(`unknown error`);
        }
        if (engine.getEventPayload()?.throwCriticalError) {
            throw new CriticalError(`critical error`);
        }
        if (engine.getEventPayload()?.throwEngineCriticalError) {
            throw new EngineCriticalError(`engine critical error`);
        }
    }
}
