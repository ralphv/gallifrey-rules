import { KafkaMessage } from 'kafkajs';
import { BaseEventPayload } from './base-interfaces/BaseTypes';
import { GallifreyRulesEngine } from './GallifreyRulesEngine';
import AfterHandleEventDelegate from './delegates-interfaces/AfterHandleEventDelegate';
import { GallifreyEventType } from './GallifreyEventType';
export declare class KafkaConsumer {
    private readonly name;
    private clientId;
    private brokers;
    private engine;
    private kafka;
    private consumer;
    private afterHandleEventDelegate;
    private emitter;
    constructor(name: string, clientId: string, brokers: string[], engine: GallifreyRulesEngine);
    setAfterHandleEventDelegate(ref: AfterHandleEventDelegate<any> | undefined): void;
    startConsumer<EventPayloadType extends BaseEventPayload>(consumerConfig: KafkaConsumerConfig, consumerTransformer: ConsumerTransformer<EventPayloadType>): Promise<void>;
    startScheduleEventConsumer(consumerConfig: KafkaConsumerConfig): Promise<void>;
    startAsyncActionsConsumer(consumerConfig: KafkaConsumerConfig): Promise<void>;
    stopConsumer(): Promise<void>;
    private calculateLag;
    private afterHandleEvent;
    private setupEmitter;
    addOnStopOnce(fn: () => void): void;
    stopConsumerAndWait(): Promise<void>;
}
/**
 * Takes a kafka message and transforms it into a Gallifrey Engine Event
 */
export interface ConsumerTransformer<EventPayloadType extends BaseEventPayload> {
    (message: KafkaMessage): GallifreyEventType<EventPayloadType>;
}
export interface KafkaConsumerConfig {
    groupId: string;
    topics: string | string[];
    fromBeginning: boolean;
    brokers?: string[];
    clientId?: string;
}
export declare function IsTypeKafkaConsumerConfig(value: any): value is KafkaConsumerConfig;
