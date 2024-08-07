/* eslint-disable @typescript-eslint/no-misused-promises,no-async-promise-executor,@typescript-eslint/no-unsafe-member-access */
import { expect } from 'chai';
import { KafkaContainer } from '@testcontainers/kafka';
import path from 'node:path';
import { EachMessagePayload } from 'kafkajs';
import { beforeEach } from 'mocha';
import sinon from 'sinon';
import { logger } from '../src/lib/logger';
import {
    GallifreyEventType,
    GallifreyRulesEngine,
    KafkaConsumerConfig,
    NamespaceSchema,
    NamespaceSchemaConsumer,
} from '../src';
import { KafkaConsumer } from '../src/KafkaConsumer';
import { ScheduledEventType } from '../src/engine-events/ScheduledEventType';
import { findCallWithText, produceIntoKafka, WaitForCondition } from './lib/IntegrationUtils';

describe('e2e', () => {
    let infoSpy: sinon.SinonSpy;
    let warnSpy: sinon.SinonSpy;
    let errorSpy: sinon.SinonSpy;

    beforeEach(() => {
        warnSpy = sinon.spy(logger, 'warn');
        infoSpy = sinon.spy(logger, 'info');
        errorSpy = sinon.spy(logger, 'error');
    });
    afterEach(async () => {
        warnSpy.restore();
        infoSpy.restore();
        errorSpy.restore();
    });
    it('test test-containers kafka', async () => {
        const kafkaContainer = await new KafkaContainer().withKraft().withExposedPorts(9093).start();
        const brokers = [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`];

        try {
            await produceIntoKafka(brokers, 'topic', undefined, { id: '12345' });
            const event = await new Promise<GallifreyEventType<any>>(async (resolve, reject) => {
                try {
                    const engine = new GallifreyRulesEngine();
                    await engine.initialize(schema);

                    const kafkaConsumer = new KafkaConsumer('gallifrey', 'gallifrey', brokers, engine);
                    kafkaConsumer.setAfterHandleEventDelegate(
                        async (
                            messagePayload: EachMessagePayload,
                            event: GallifreyEventType<any> | ScheduledEventType,
                        ) => {
                            console.log(`received`);
                            await kafkaConsumer.stopConsumer();
                            resolve(event as GallifreyEventType<any>);
                        },
                    );
                    await kafkaConsumer.startConsumer<any>(
                        {
                            groupId: `groupId`,
                            topics: [`topic`],
                            fromBeginning: true,
                            brokers,
                        },
                        (message) => {
                            const payload = JSON.parse(String(message.value));
                            return {
                                entityName: 'entity',
                                eventName: 'new-entity',
                                eventId: payload.id ?? null,
                                payload,
                                source: 'e2e tests',
                                eventLag: 0,
                            };
                        },
                    );
                    try {
                        await kafkaConsumer.startConsumer<any>(
                            {
                                groupId: `groupId`,
                                topics: [`topic`],
                                fromBeginning: true,
                                brokers,
                            },
                            (message) => {
                                const payload = JSON.parse(String(message.value));
                                return {
                                    entityName: 'entity',
                                    eventName: 'new-entity',
                                    eventId: payload.id ?? null,
                                    payload,
                                    source: 'e2e tests',
                                    eventLag: 0,
                                };
                            },
                        );
                        expect.fail(`this should throw`);
                    } catch (e) {
                        expect(String(e)).to.equal(`Error: startConsumer is already called`);
                    }
                } catch (e) {
                    reject(e);
                }
            });
            expect(event.eventId).to.equal('12345');
            expect(event.entityName).to.equal('entity');
            expect(event.eventName).to.equal('new-entity');
            const result = findCallWithText(infoSpy, 'JournalLog: ');
            //console.log(result);
            expect(result).to.includes('this is a journal message');
            expect(result).to.includes('data from entity data: sample-data-123');
            expect(result).to.includes('data2 from entity data: sample-data-123');
            expect(result).to.includes('data3 from entity data for a new key: sample-data-1234');
            expect(result).to.includes('data from action: action-processed: sample-data');
            expect(result).to.includes("data-object 'entity-data-object' result pulled from event store");
        } finally {
            await Promise.allSettled([kafkaContainer.stop()]);
        }
    }).timeout(100000);
    it('test consumers via schema', async () => {
        const kafkaContainer = await new KafkaContainer().withKraft().withExposedPorts(9093).start();
        const brokers = [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`];

        try {
            await produceIntoKafka(brokers, 'topic', undefined, { id: '12345' });
            const event = await new Promise<GallifreyEventType<any>>(async (resolve, reject) => {
                try {
                    const engine = new GallifreyRulesEngine();
                    await engine.initialize({
                        ...schema,
                        $consumers: [
                            {
                                name: 'consumer-name',
                                type: 'kafka',
                                config: {
                                    groupId: `groupId`,
                                    topics: [`topic`],
                                    fromBeginning: true,
                                    brokers,
                                } as KafkaConsumerConfig,
                                eventDispatcher: 'sample-event-dispatcher',
                            } as NamespaceSchemaConsumer,
                        ] as NamespaceSchemaConsumer[],
                    });
                    const consumers = await engine.startConsumers();
                    consumers[0].setAfterHandleEventDelegate(
                        async (
                            messagePayload: EachMessagePayload,
                            event: GallifreyEventType<any> | ScheduledEventType,
                        ) => {
                            console.log(`received`);
                            await engine.stopConsumers();
                            resolve(event as GallifreyEventType<any>);
                        },
                    );
                } catch (e) {
                    reject(e);
                }
            });

            expect(event.eventId).to.equal('12345');
            expect(event.entityName).to.equal('entity');
            expect(event.eventName).to.equal('new-entity');
            const result = findCallWithText(infoSpy, 'JournalLog: ');
            //console.log(result);
            expect(result).to.includes('this is a journal message');
            expect(result).to.includes('data from entity data: sample-data-123');
            expect(result).to.includes('data2 from entity data: sample-data-123');
            expect(result).to.includes('data3 from entity data for a new key: sample-data-1234');
            expect(result).to.includes('data from action: action-processed: sample-data');
            expect(result).to.includes("data-object 'entity-data-object' result pulled from event store");
        } finally {
            await Promise.allSettled([kafkaContainer.stop()]);
        }
    }).timeout(100000);
    it('test consumers invalid payload', async () => {
        const kafkaContainer = await new KafkaContainer().withKraft().withExposedPorts(9093).start();
        const brokers = [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(9093)}`];

        try {
            await produceIntoKafka(brokers, 'topic', undefined, { id_invalid: '12345' });
            await new Promise<void>(async (resolve, reject) => {
                try {
                    const engine = new GallifreyRulesEngine();
                    await engine.initialize({
                        ...schema,
                        $consumers: [
                            {
                                name: 'consumer-name',
                                type: 'kafka',
                                config: {
                                    groupId: `groupId`,
                                    topics: [`topic`],
                                    fromBeginning: true,
                                    brokers,
                                } as KafkaConsumerConfig,
                                eventDispatcher: 'sample-event-dispatcher',
                            } as NamespaceSchemaConsumer,
                        ] as NamespaceSchemaConsumer[],
                    });
                    await engine.startConsumers();
                } catch (e) {
                    reject(e);
                }

                await WaitForCondition(() => {
                    const result = findCallWithText(errorSpy, 'Failed to validatePayloadSchema:');
                    if (result) {
                        resolve();
                    }
                    return !!result;
                }, 10000);
            });
        } finally {
            await Promise.allSettled([kafkaContainer.stop()]);
        }
    }).timeout(100000);
});

const schema = {
    $namespace: 'namespace',
    $entities: {
        entity: {
            'new-entity': {
                $schemaFile: path.join(__dirname, './e2e/schema.json'),
                $rules: ['process-new-entity-rule'],
            },
        },
    },
    $modulesPaths: ['$', path.join(__dirname, './e2e')],
} as NamespaceSchema;
