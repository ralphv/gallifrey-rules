import ReactToFailureInterface from '../interfaces/Providers/ReactToFailureInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { Kafka } from 'kafkajs';
import EngineEventInterface from '../engine-interfaces/EngineEventInterface';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.ReactToFailure)
export default class PushToTopicReactToFailureProvider implements ReactToFailureInterface {
    getModuleName(): string {
        return ModuleNames.PushToTopicReactToFailure;
    }

    async reactToEventFailure(engine: EngineEventInterface, payload: any, error: any): Promise<void> {
        const brokers = await engine
            .getConfigurationAccessor()
            .getStringValue('push-to-topic-react-to-failure-brokers', '');
        const topic = await engine
            .getConfigurationAccessor()
            .getStringValue('push-to-topic-react-to-failure-event-topic', '');

        if (brokers && topic) {
            await produce(brokers.split(','), topic, undefined, {
                namespace: engine.getEventContext().getNamespace(),
                entityName: engine.getEventContext().getEntityName(),
                eventName: engine.getEventContext().getEventName(),
                eventID: engine.getEventContext().getEventID(),
                payload,
                error: String(error),
            });
        }
    }

    async reactToRuleFailure(engine: EngineEventInterface, payload: any, error: any, rule: string): Promise<void> {
        const brokers = await engine
            .getConfigurationAccessor()
            .getStringValue('push-to-topic-react-to-failure-brokers', '');
        const topic = await engine
            .getConfigurationAccessor()
            .getStringValue('push-to-topic-react-to-failure-rule-topic', '');

        if (brokers && topic) {
            if (brokers && topic) {
                await produce(brokers.split(','), topic, undefined, {
                    namespace: engine.getEventContext().getNamespace(),
                    entityName: engine.getEventContext().getEntityName(),
                    eventName: engine.getEventContext().getEventName(),
                    eventID: engine.getEventContext().getEventID(),
                    payload,
                    error: String(error),
                    rule,
                });
            }
        }
    }
}

async function produce(brokers: string[], topic: string, key: string | undefined, payload: any) {
    const kafka = new Kafka({
        clientId: 'gallifrey-rules',
        brokers,
    });

    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
        topic: topic,
        messages: [{ key: key, value: JSON.stringify(payload) }],
    });

    await producer.disconnect();
}
