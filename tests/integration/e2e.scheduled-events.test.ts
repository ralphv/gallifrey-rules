/* eslint-disable @typescript-eslint/no-misused-promises,no-async-promise-executor,@typescript-eslint/no-unsafe-member-access */
import { beforeEach } from 'mocha';
import sinon from 'sinon';
import { logger } from '../../src/lib/logger';
import Database from '../../src/database/Database';
import {
    GallifreyEventType,
    GallifreyRulesEngine,
    KafkaConsumerConfig,
    ModuleNames,
    NamespaceSchema,
    NamespaceSchemaConsumer,
} from '../../src';
import { EachMessagePayload } from 'kafkajs';
import { expect } from 'chai';
import path from 'node:path';
import { ScheduledEventType } from '../../src/engine-events/ScheduledEventType';
import { scheduledEventsConnectorConfig } from './lib/scheduledEventsConnectorConfig';
import { createTopics } from './lib/IntegrationUtils';
import { deleteKafkaConnectConnector, deployKafkaConnectConnector } from '../../src/lib/Utils';

describe('e2e.scheduled events', () => {
    let infoSpy: sinon.SinonSpy;
    let warnSpy: sinon.SinonSpy;
    beforeEach(() => {
        warnSpy = sinon.spy(logger, 'warn');
        infoSpy = sinon.spy(logger, 'info');
        process.env.GF_IS_DISTRIBUTED_LOCKS_ENABLED = 'TRUE';
    });
    afterEach(async () => {
        warnSpy.restore();
        infoSpy.restore();
        delete process.env.GF_IS_DISTRIBUTED_LOCKS_ENABLED;
    });
    it('test scheduled events', async () => {
        // docker compose -f scheduled-events.compose.yaml up -d
        process.env.GF_DB_USERNAME = 'postgres';
        process.env.GF_DB_HOSTNAME = 'localhost';
        process.env.GF_DB_NAME = 'postgres';
        process.env.GF_DB_PASSWORD = '1q2w3e4r5t6y';
        const database = new Database();
        await database.initialize();
        const random = String(Math.ceil(Math.random() * 1000000));

        await deleteKafkaConnectConnector('http://localhost:8083', 'gallifrey-rules-scheduled-events-connector');
        await deployKafkaConnectConnector('http://localhost:8083', scheduledEventsConnectorConfig);
        const brokers = ['localhost:9092'];

        // insert a future event and wait.
        await createTopics(brokers, ['gallifrey-rules-scheduled-events'], false);
        const event = await new Promise<ScheduledEventType>(async (resolve, reject) => {
            try {
                const engine = new GallifreyRulesEngine();
                await engine.initialize({
                    ...schema,
                    $consumers: [
                        {
                            name: 'consumer-name',
                            type: 'kafka:scheduled-events',
                            config: {
                                groupId: `groupId-${random}`,
                                topics: [`gallifrey-rules-scheduled-events`],
                                fromBeginning: false,
                                brokers,
                            } as KafkaConsumerConfig,
                        } as NamespaceSchemaConsumer,
                    ] as NamespaceSchemaConsumer[],
                });
                const consumers = await engine.startConsumers();
                consumers[0].setAfterHandleEventDelegate(
                    async (messagePayload: EachMessagePayload, event: GallifreyEventType<any> | ScheduledEventType) => {
                        console.log(`received`);
                        await engine.stopConsumers();
                        resolve(event as ScheduledEventType);
                    },
                );
                await database.insertScheduledEvent({
                    createdAt: new Date(),
                    event: {
                        entityName: 'entity',
                        eventID: random,
                        eventName: 'new-entity',
                        namespace: 'namespace',
                        payload: {},
                    },
                    scheduledAt: new Date(),
                    scheduledCount: 0,
                    triggeredBy: {
                        entityName: 'entity',
                        eventID: '12',
                        eventName: 'new-entity',
                        namespace: 'namespace',
                        source: 'e2e',
                    },
                });
            } catch (e) {
                reject(e);
            }
        });
        // validate the event
        expect(event.event.eventId).to.equal(random);
    }).timeout(300000);
});

const schema = {
    $namespace: 'namespace',
    $entities: {
        entity: {
            $schemaFile: path.join(__dirname, './e2e/schema.json'),
            'new-entity': {
                $rules: ['process-new-entity-rule'],
            },
        },
    },
    $providers: {
        distributedLocks: ModuleNames.PostgresDistributedLocks,
    },
    $modulesPaths: ['$', path.join(__dirname, './e2e')],
} as NamespaceSchema;
