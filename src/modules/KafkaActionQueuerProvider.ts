import { ActionQueuerInterface, ActionQueuerRequest } from '../interfaces/Providers';
import { KafkaConsumerConfig } from '../KafkaConsumer';
import { IsArray, IsString } from '../BasicTypeGuards';
import Config from '../lib/Config';
import { produce } from '../lib/Utils';
import { AsyncActionEventType } from '../engine-events/AsyncActionEventType';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.ActionQueuer)
export default class KafkaActionQueuerProvider implements ActionQueuerInterface<KafkaActionQueuerConfig, any> {
    validateQueuerConfig(queuerConfig: any): void {
        if (!IsTypeKafkaActionQueuerConfig(queuerConfig)) {
            throw new Error(`KafkaActionQueuer queuerConfig is not valid config`);
        }

        const config = new Config();

        const brokers = queuerConfig.brokers ?? config.getKafkaBrokers();
        const clientId = queuerConfig.clientId ?? config.getKafkaClientID();

        if (!brokers || !clientId || brokers.length === 0) {
            throw new Error(`brokers or clientId are missing from both env variables or queuerConfig`);
        }
    }

    async queueAction(queueRequest: ActionQueuerRequest<KafkaActionQueuerConfig, any>): Promise<void> {
        const config = new Config();
        const { queuerConfig, ...restOfRequest } = queueRequest;

        const brokers = queuerConfig.brokers ?? config.getKafkaBrokers();
        const clientId = queuerConfig.clientId ?? config.getKafkaClientID();
        const topic = queuerConfig.topic;

        await produce(clientId, brokers, topic, undefined, restOfRequest as KafkaActionQueuerMessageType);
    }

    getModuleName(): string {
        return ModuleNames.KafkaActionQueuer;
    }
}

interface KafkaActionQueuerConfig {
    brokers?: string[];
    topic: string;
    clientId?: string;
}

export function IsTypeKafkaActionQueuerConfig(value: any): value is KafkaConsumerConfig {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return IsString(value.topic) && IsArray(value.brokers, true, IsString) && IsString(value.clientId, true);
}

export interface KafkaActionQueuerMessageType extends AsyncActionEventType<any> {
    namespace: string;
    actionName: string;
    payload: any;
    entityName: string;
    eventName: string;
    eventId: string;
}

export function IsTypeKafkaActionQueuerMessageType(value: any): value is KafkaConsumerConfig {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return IsString(value.namespace) && IsString(value.actionName);
}
