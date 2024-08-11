import { Kafka, ConsumerSubscribeTopics, EachMessagePayload, KafkaMessage, Consumer } from 'kafkajs';
import { BaseEventPayload } from './base-interfaces/BaseTypes';
import { logger } from './lib/logger';
import { GallifreyRulesEngine } from './GallifreyRulesEngine';
import { DontThrowJustLog } from './lib/Decorators';
import { KafkaConsumerLagCalculator } from './KafkaConsumerLagCalculator';
import EngineCriticalError from './errors/EngineCriticalError';
import Config from './lib/Config';
import AfterHandleEventDelegate from './delegates-interfaces/AfterHandleEventDelegate';
import EventEmitter from 'node:events';
import KafkaLog from './KafkaLog';
import { GallifreyEventType } from './GallifreyEventType';
import { AssertTypeGuard, IsArray, IsBoolean, IsString } from './BasicTypeGuards';
import {
    DBConnectorScheduledEventType,
    IsTypeDBConnectorScheduledEventType,
} from './engine-events/DBConnectorScheduledEventType';
import { getScheduledEventTypeFromDBType, ScheduledEventType } from './engine-events/ScheduledEventType';
import os from 'os';
import { IsTypeKafkaActionQueuerMessageType, KafkaActionQueuerMessageType } from './modules/KafkaActionQueuerProvider';

export class KafkaConsumer {
    private kafka: Kafka;
    private consumer: Consumer | undefined;
    private afterHandleEventDelegate: AfterHandleEventDelegate<any> | undefined;
    private emitter = new EventEmitter();

    constructor(
        private readonly name: string,
        private clientId: string,
        private brokers: string[],
        private engine: GallifreyRulesEngine,
    ) {
        if (!brokers || !brokers.length) {
            throw new EngineCriticalError(`Kafka brokers are missing`);
        }
        this.kafka = new Kafka({
            clientId,
            brokers,
            logCreator: KafkaLog.getLogCreator(),
        });
        if (!engine.isInitialized()) {
            throw new EngineCriticalError(`Engine passed to KafkaConsumer should be initialized`);
        }
        this.setupEmitter();
    }

    public setAfterHandleEventDelegate(ref: AfterHandleEventDelegate<any> | undefined) {
        this.afterHandleEventDelegate = ref;
    }

    public async startConsumer<EventPayloadType extends BaseEventPayload>(
        consumerConfig: KafkaConsumerConfig,
        consumerTransformer: ConsumerTransformer<EventPayloadType>,
    ): Promise<void> {
        if (this.consumer) {
            throw new EngineCriticalError(`startConsumer is already called`);
        }
        AssertTypeGuard(IsTypeKafkaConsumerConfig, consumerConfig);
        const { groupId, topics, fromBeginning } = consumerConfig;

        const config = new Config();
        const pushMetrics = config.getConsumerPushMetrics();

        this.consumer = this.kafka.consumer({ groupId });
        try {
            logger.debug(`consumer connect: ${this.name}`);
            await this.consumer.connect();
            logger.debug(`consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
            await this.consumer.subscribe({
                topics: Array.isArray(topics) ? topics : [topics],
                fromBeginning,
            } as ConsumerSubscribeTopics);
            logger.debug(`consumer: ${this.name} run`);
            // consumer run will not block
            await this.consumer.run({
                autoCommit: true,
                autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                autoCommitInterval: config.getAutoCommitInterval(),
                eachMessage: async (messagePayload: EachMessagePayload) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        const { topic, partition, message, pause } = messagePayload;
                        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        logger.debug(`consumer ${this.name}: - ${prefix} ${message.key}#${message.value}`);
                        if (pushMetrics) {
                            void this.calculateLag(topic, partition, message.offset, groupId);
                        }
                        const event = consumerTransformer(message);
                        await this.engine.handleEvent<EventPayloadType>(event, pause);
                        this.afterHandleEvent(messagePayload, event);
                    } catch (e) {
                        logger.error(
                            `Unhandled Exception from HandleEvent: ${String(e)} @${String((e as Error).stack ?? '')}`,
                        );
                        await this.stopConsumer();
                        throw e;
                    }
                },
            });
            logger.info(
                `consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`,
            );
        } catch (e) {
            logger.error(
                `An error has occurred while starting the consumer: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
            await this.stopConsumer();
            throw e;
        }
    }

    public async startScheduleEventConsumer(consumerConfig: KafkaConsumerConfig): Promise<void> {
        if (this.consumer) {
            throw new EngineCriticalError(`startConsumer is already called`);
        }
        AssertTypeGuard(IsTypeKafkaConsumerConfig, consumerConfig);
        const { groupId, topics, fromBeginning } = consumerConfig;

        const config = new Config();
        const pushMetrics = config.getConsumerPushMetrics();

        this.consumer = this.kafka.consumer({ groupId });
        try {
            logger.debug(`consumer: ${this.name} connect`);
            await this.consumer.connect();
            logger.debug(`consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
            await this.consumer.subscribe({
                topics: Array.isArray(topics) ? topics : [topics],
                fromBeginning,
            } as ConsumerSubscribeTopics);
            logger.debug(`consumer: ${this.name} run`);
            // consumer run will not block
            await this.consumer.run({
                autoCommit: true,
                autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                autoCommitInterval: config.getAutoCommitInterval(),
                eachMessage: async (messagePayload: EachMessagePayload) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        const { topic, partition, message, pause } = messagePayload;
                        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        logger.debug(`consumer: ${this.name} - ${prefix} ${message.key}#${message.value}`);
                        if (pushMetrics) {
                            void this.calculateLag(topic, partition, message.offset, groupId);
                        }
                        // message payload
                        const payload = JSON.parse(String(message.value));
                        AssertTypeGuard(IsTypeDBConnectorScheduledEventType, payload);
                        const dbScheduledEvent = payload as DBConnectorScheduledEventType;
                        const event = getScheduledEventTypeFromDBType(dbScheduledEvent, os.hostname());
                        await this.engine.handleScheduledEvent(event, pause);
                        this.afterHandleEvent(messagePayload, event);
                    } catch (e) {
                        logger.error(
                            `Unhandled Exception from HandleEvent: ${String(e)} @${String((e as Error).stack ?? '')}`,
                        );
                        await this.stopConsumer();
                        throw e;
                    }
                },
            });
            logger.info(
                `consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`,
            );
        } catch (e) {
            logger.error(
                `An error has occurred while starting the consumer: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
            await this.stopConsumer();
            throw e;
        }
    }

    public async startAsyncActionsConsumer(consumerConfig: KafkaConsumerConfig): Promise<void> {
        if (this.consumer) {
            throw new EngineCriticalError(`startAsyncActionsConsumer is already called`);
        }
        AssertTypeGuard(IsTypeKafkaConsumerConfig, consumerConfig);
        const { groupId, topics, fromBeginning } = consumerConfig;

        const config = new Config();
        const pushMetrics = config.getConsumerPushMetrics();

        this.consumer = this.kafka.consumer({ groupId });
        try {
            logger.debug(`async action consumer: ${this.name} connect`);
            await this.consumer.connect();
            logger.debug(`async action consumer: ${this.name} subscribe to topic: ${JSON.stringify(topics)}`);
            await this.consumer.subscribe({
                topics: Array.isArray(topics) ? topics : [topics],
                fromBeginning,
            } as ConsumerSubscribeTopics);
            logger.debug(`async action consumer: ${this.name} run`);
            // consumer run will not block
            await this.consumer.run({
                autoCommit: true,
                autoCommitThreshold: config.getAutoCommitThreshold(), //todo config? or pass
                autoCommitInterval: config.getAutoCommitInterval(),
                eachMessage: async (messagePayload: EachMessagePayload) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/unbound-method
                        const { topic, partition, message, pause } = messagePayload;
                        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        logger.debug(`consumer: : ${this.name} - ${prefix} ${message.key}#${message.value}`);
                        if (pushMetrics) {
                            void this.calculateLag(topic, partition, message.offset, groupId);
                        }
                        // message payload
                        const payload = JSON.parse(String(message.value));
                        AssertTypeGuard(IsTypeKafkaActionQueuerMessageType, payload);
                        const asyncActionEvent = payload as KafkaActionQueuerMessageType;
                        await this.engine.handleAsyncActionEvent(asyncActionEvent, os.hostname(), pause);
                    } catch (e) {
                        logger.error(
                            `Unhandled Exception from HandleEvent: ${String(e)} @${String((e as Error).stack ?? '')}`,
                        );
                        await this.stopConsumer();
                        throw e;
                    }
                },
            });
            logger.info(
                `consumer: ${this.name} is running on topic: ${JSON.stringify(topics)} with consumer group: ${groupId}`,
            );
        } catch (e) {
            logger.error(
                `An error has occurred while starting the consumer: ${String(e)} @${String((e as Error).stack ?? '')}`,
            );
            await this.stopConsumer();
            throw e;
        }
    }

    @DontThrowJustLog
    public async stopConsumer(): Promise<void> {
        this.emitter.emit(EMITTER_STOP, this);
    }

    @DontThrowJustLog
    private async calculateLag(topic: string, partition: number, offset: string, groupId: string) {
        const offsets = await KafkaConsumerLagCalculator.fetchTopicOffsets(this.clientId, this.brokers, topic);
        if (!offsets) {
            return;
        }
        const offsetForPartition = offsets.find((offset) => offset.partition === partition);
        if (!offsetForPartition) {
            return;
        }
        const lag = parseInt(offsetForPartition.high) - parseInt(offset);
        this.engine.publishPartitionLag(lag, partition, topic, groupId);
    }

    @DontThrowJustLog
    private afterHandleEvent<EventPayloadType extends BaseEventPayload>(
        messagePayload: EachMessagePayload,
        event: GallifreyEventType<EventPayloadType> | ScheduledEventType,
    ) {
        this.emitter.emit(EMITTER_AFTER_HANDLE_EVENT, messagePayload, event);
    }

    private setupEmitter() {
        this.emitter.on(
            EMITTER_AFTER_HANDLE_EVENT,
            (messagePayload: EachMessagePayload, event: GallifreyEventType<any>) => {
                if (this.afterHandleEventDelegate) {
                    void this.afterHandleEventDelegate(messagePayload, event);
                }
            },
        );
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.emitter.on(EMITTER_STOP, async () => {
            await this.stopConsumerAndWait();
        });
    }

    public addOnStopOnce(fn: () => void) {
        this.emitter.once(EMITTER_STOP, fn);
    }

    public async stopConsumerAndWait() {
        if (this.consumer) {
            try {
                logger.info(`Disconnecting consumer: ${this.name}`);
                const consumer = this.consumer;
                this.consumer = undefined;
                await consumer.disconnect();
                logger.info(`Consumer disconnected: ${this.name}`);
            } catch (e) {
                logger.error(`Unhandled Exception stopping consumer: ${String(e)}`);
            }
        }
    }
}

/**
 * Takes a kafka message and transforms it into a Gallifrey Engine Event
 */
export interface ConsumerTransformer<EventPayloadType extends BaseEventPayload> {
    (message: KafkaMessage): GallifreyEventType<EventPayloadType>;
}

const EMITTER_STOP = 'stop';
const EMITTER_AFTER_HANDLE_EVENT = 'afterHandleEvent';

export interface KafkaConsumerConfig {
    /**
     * The group ID of the consumer
     */
    groupId: string;
    /**
     * The topic of list of topics to listen to
     */
    topics: string | string[];
    /**
     * Whether to start consuming from the beginning of the topic or not. Note that this only applies when
     * Kafka sees a new groupID, once the consumer group is established, Kafka tracks it's offsets.
     */
    fromBeginning: boolean;
    /**
     * Optional brokers for this consumer. if not given, they would be expected to be provided
     * in the environment variable `GR_KAFKA_BROKERS`
     */
    brokers?: string[];
    /**
     * Optional client ID, if not provided, it would be expected to be provided
     * in the environment variable `GR_KAFKA_CLIENT_ID`
     */
    clientId?: string;
}

export function IsTypeKafkaConsumerConfig(value: any): value is KafkaConsumerConfig {
    return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsString(value.groupId) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (IsString(value.topics) || IsArray(value.topics, false, IsString)) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsBoolean(value.fromBeginning) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsArray(value.brokers, true, IsString) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        IsString(value.clientId, true)
    );
}
