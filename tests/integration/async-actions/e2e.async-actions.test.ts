/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach } from 'mocha';
import sinon from 'sinon';
import { logger } from '../../../src/lib/logger';
import { GallifreyRulesEngine, NamespaceSchema } from '../../../src';
import path from 'node:path';
import { namespaceSchema } from './namespace';
import { createTopics, getSpiedCalls, produceIntoKafka, WaitForCondition } from '../lib/IntegrationUtils';
import { OrdersTopicPayloadType } from './modules/OrdersTopicDispatcher';
import SendEmailAction from './modules/SendEmailAction';
import { ModuleNames } from './ModuleNames';
import { expect } from 'chai';

describe('e2e.async-actions', () => {
    let infoSpy: sinon.SinonSpy;
    let warnSpy: sinon.SinonSpy;
    beforeEach(() => {
        process.env.GR_DB_USERNAME = 'postgres';
        process.env.GR_DB_HOSTNAME = 'localhost';
        process.env.GR_DB_NAME = 'postgres';
        process.env.GR_DB_PASSWORD = '1q2w3e4r5t6y';
        warnSpy = sinon.spy(logger, 'warn');
        infoSpy = sinon.spy(logger, 'info');
    });
    afterEach(async () => {
        warnSpy.restore();
        infoSpy.restore();
    });
    it('test sync', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            // 1. make sure topics are fresh and created
            await createTopics(['localhost:9092'], ['orders-topic', 'orders-namespace-async-actions'], true);

            await engine.initialize(namespaceSchema);
            await engine.startConsumers();

            await new Promise((resolve) => setTimeout(resolve, 5000));

            await produceIntoKafka<OrdersTopicPayloadType>(['localhost:9092'], 'orders-topic', undefined, {
                user: 'DoctorWho',
                emailAddress: 'TheDoctor@gallifrey-rules.dev',
                orderId: '1000',
            });

            await WaitForCondition(() => getSpiedCalls(SendEmailAction.name, 'trigger').length !== 0, 30000);
            // 3. produce event
            // 4. rule will call action,
            // 5. action is set to trigger async
            // 6. async consumer will pick up and execute action
        } finally {
            await engine.shutdown();
        }
    }).timeout(300000);
    it('test async', async () => {
        process.env.ORDER_CONSUMER = 'TRUE';
        const engine = new GallifreyRulesEngine();
        try {
            // 1. make sure topics are fresh and created
            await createTopics(['localhost:9092'], ['orders-topic', 'orders-namespace-async-actions'], true);

            await engine.initialize({
                ...namespaceSchema,
                $asyncActions: [
                    {
                        actionPluginName: ModuleNames.SendEmailAction,
                        queuerConfig: {
                            groupId: 'e2e-group-async-actions',
                            topic: 'orders-namespace-async-actions',
                            fromBeginning: true,
                            brokers: ['localhost:9092'],
                        },
                    },
                ],
            });
            await engine.startConsumers();

            await new Promise((resolve) => setTimeout(resolve, 5000));

            await produceIntoKafka<OrdersTopicPayloadType>(['localhost:9092'], 'orders-topic', undefined, {
                user: 'DoctorWho',
                emailAddress: 'TheDoctor@gallifrey-rules.dev',
                orderId: '1000',
            });

            await WaitForCondition(() => getSpiedCalls(SendEmailAction.name, 'trigger').length !== 0, 30000);
            // 3. produce event
            // 4. rule will call action,
            // 5. action is set to trigger async
            // 6. async consumer will pick up and execute action
            expect(getSpiedCalls(SendEmailAction.name, 'trigger').length !== 0).true;
        } catch (e) {
            expect.fail(`this should not throw: ${String(e)}`);
        } finally {
            await engine.shutdown();
        }
    }).timeout(300000);
});

const schema = {
    $namespace: 'namespace',
    $entities: {
        entity: {
            order: {
                $rules: ['process-new-order-rule'],
            },
        },
    },
    $modulesPaths: ['$', path.join(__dirname, 'modules')],
} as NamespaceSchema;
