import { ActionQueuerInterface, ActionQueuerRequest } from '../interfaces/Providers';
import { KafkaConsumerConfig } from '../KafkaConsumer';
import { AsyncActionEventType } from '../engine-events/AsyncActionEventType';
export default class KafkaActionQueuerProvider implements ActionQueuerInterface<KafkaActionQueuerConfig, any> {
    validateQueuerConfig(queuerConfig: any): void;
    queueAction(queueRequest: ActionQueuerRequest<KafkaActionQueuerConfig, any>): Promise<void>;
    getModuleName(): string;
}
interface KafkaActionQueuerConfig {
    brokers?: string[];
    topic: string;
    clientId?: string;
}
export declare function IsTypeKafkaActionQueuerConfig(value: any): value is KafkaConsumerConfig;
export interface KafkaActionQueuerMessageType extends AsyncActionEventType<any> {
    namespace: string;
    actionName: string;
    payload: any;
    entityName: string;
    eventName: string;
    eventId: string;
}
export declare function IsTypeKafkaActionQueuerMessageType(value: any): value is KafkaConsumerConfig;
export {};
