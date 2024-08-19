import { GallifreyRulesEngineForTesting, NamespaceSchema, TestingModuleNames } from '../../../src';
import TestAction from './modules/TestAction';
import { expect } from 'chai';
import path from 'node:path';
import TestDataObject from './modules/TestDataObject';
import TestRule from './modules/TestRule';
import TestEventDispatcher from './modules/TestEventDispatcher';
import { TestingJournalLoggerProviderTestingMethods } from '../../../src/testing-modules/TestingJournalLoggerProvider';

describe('for-testing', () => {
    it('testDoAction', async () => {
        const engine = new GallifreyRulesEngineForTesting();
        await engine.initialize({
            $namespace: 'test-namespace',
            $entities: {},
            $modulesPaths: ['$', path.join(__dirname, './modules')],
        } as NamespaceSchema);
        const result = await engine.testDoAction(TestAction.name, { key: 'for-testing' });
        expect(result).equal('sample-action: for-testing');
    });
    it('testPullDataObject', async () => {
        const engine = new GallifreyRulesEngineForTesting();
        await engine.initialize({
            $namespace: 'test-namespace',
            $entities: {},
            $modulesPaths: ['$', path.join(__dirname, './modules')],
        } as NamespaceSchema);
        const result = await engine.testPullDataObject(TestDataObject.name, { key: 'for-testing' });
        expect(result).equal('sample-action: for-testing');
    });
    it('addDataObjectResponse', async () => {
        const engine = new GallifreyRulesEngineForTesting();
        await engine.initialize({
            $namespace: 'test-namespace',
            $entities: {},
            $modulesPaths: ['$', path.join(__dirname, './modules')],
        } as NamespaceSchema);
        engine.addDataObjectResponse('data-object', true);
        const result = await engine.testPullDataObject('data-object', {});
        expect(result).equal(true);
    });
    it('testEventOnTopic', async () => {
        const engine = new GallifreyRulesEngineForTesting();
        await engine.initialize({
            $namespace: 'test-namespace',
            $entities: { entity: { event: { $rules: [TestRule.name] } } },
            $modulesPaths: ['$', '$testing', path.join(__dirname, './modules')],
            $providers: {
                journalLogger: TestingModuleNames.TestingJournalLoggerProvider,
                scheduledEvents: TestingModuleNames.TestingDummyScheduledEventsProvider,
            },
            $consumers: [
                {
                    name: 'test',
                    type: 'kafka',
                    config: {
                        topics: ['topic'],
                    },
                    eventDispatcher: TestEventDispatcher.name,
                },
            ],
        } as NamespaceSchema);

        await engine.testEventOnTopic('topic', { a: 'b' });
        const journalLogger = engine.getLastCreatedJournalLogger<TestingJournalLoggerProviderTestingMethods>();

        expect(journalLogger.isEventRun('event')).to.be.true;
        expect(journalLogger.isActionRun(TestAction.name)).to.be.true;
        expect(journalLogger.isDataObjectPulled(TestDataObject.name)).to.be.true;
        expect(journalLogger.getErrorsCount()).to.be.equal(0);
    });
});
