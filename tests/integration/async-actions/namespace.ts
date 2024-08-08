import { NamespaceSchema } from '../../../src';
import path from 'node:path';
import { ModuleNames } from './ModuleNames';

export const namespaceSchema: NamespaceSchema = {
    $namespace: 'orders-namespace',
    $entities: {
        orders: {
            'new-order': {
                $rules: [ModuleNames.ProcessNewOrderRule],
            },
        },
    },
    $providers: {
        actionQueuer: 'kafka-action-queuer',
    },
    $consumers: [
        {
            name: 'orders',
            type: 'kafka',
            config: {
                groupId: `e2e-tests-1-${Math.random().toString(36)}`,
                topics: [`orders-topic`],
                fromBeginning: false,
                brokers: ['localhost:9092'],
            },
            eventDispatcher: 'orders-topic-dispatcher',
        },
        {
            name: 'async-actions',
            type: 'kafka:async-actions',
            config: {
                groupId: `e2e-tests-1-${Math.random().toString(36)}`,
                topics: [`orders-namespace-async-actions`],
                fromBeginning: false,
                brokers: ['localhost:9092'],
            },
            eventDispatcher: 'orders-topic-dispatcher',
        },
    ],
    $modulesPaths: ['$', path.join(__dirname, 'modules')],
};
