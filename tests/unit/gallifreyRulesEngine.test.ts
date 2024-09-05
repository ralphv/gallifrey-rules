/**
 * author: Ralph Varjabedian
 */

import { expect } from 'chai';
import { GallifreyRulesEngine, NamespaceSchema } from '../../src';
import path from 'node:path';
import { IncomingMessagePayloadType } from './sample-namespace/IncomingMessagePayloadType';
import { afterEach, beforeEach } from 'mocha';
import sinon from 'sinon';
import { logger } from '../../src/lib/logger';
import { KafkaConsumer } from '../../src/KafkaConsumer';
import ProcessMessageRule from './sample-namespace/modules-no-name/ProcessMessageRule';

describe('gallifrey engine', () => {
    let infoSpy: sinon.SinonSpy;
    let warnSpy: sinon.SinonSpy;
    let errorSpy: sinon.SinonSpy;

    beforeEach(() => {
        warnSpy = sinon.spy(logger, 'warn');
        infoSpy = sinon.spy(logger, 'info');
        errorSpy = sinon.spy(logger, 'error');
    });
    const findCallWithText = (spy: sinon.SinonSpy, searchText: string) => {
        const found = spy
            .getCalls()
            .find((call) => call.args.some((arg) => typeof arg === 'string' && arg.includes(searchText)));
        if (!found) {
            return null;
        }
        return found.args[0];
    };
    afterEach(async () => {
        warnSpy.restore();
        infoSpy.restore();
        errorSpy.restore();
    });
    it('initialize from object', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {},
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);
        expect(engine.getNamespace()).to.equal('sample-namespace');
        engine.describeEnvironment();
    });
    it('initialize from file', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initializeFromFile(path.resolve(__dirname, './sample-namespace/namespace-in-file.json'));
        expect(engine.getNamespace()).to.equal('sample-namespace');
        engine.describeEnvironment();
    });
    it('initialize from file x2', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initializeFromFile(path.resolve(__dirname, './sample-namespace/namespace-in-file.json'));
        try {
            await engine.initializeFromFile(path.resolve(__dirname, './sample-namespace/namespace-in-file.json'));
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Engine already initialized');
        }
    });
    it('initialize from file invalid', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initializeFromFile(path.resolve(__dirname, './sample-namespace/empty-namespace-in-file.json'));
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.includes('Error: Invalid namespace schema');
        }
    });
    it('initialize from object', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: {},
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        await engine.shutdown();
    });
    it('throw PauseConsumer', async () => {
        const engine = new GallifreyRulesEngine();
        process.env.GR_MODULES_PATHS = '$';
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: [path.resolve(__dirname, './sample-namespace/modules-throw-pause-consumer')],
        } as NamespaceSchema);
        delete process.env.GR_MODULES_PATHS;

        let pauseCalled = false;
        let resumeCalled = false;

        // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
        await new Promise<void>(async (resolve) => {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: {},
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => {
                    pauseCalled = true;
                    return () => {
                        resumeCalled = true;
                        resolve();
                    };
                },
            );
        });
        expect(pauseCalled).to.be.true;
        expect(resumeCalled).to.be.true;
    });
    it('wrong data object', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-wrong-data-object-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: {},
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should not get here, it should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(`Error: module name: message-data-object is not a Action`);
        }
    });
    it('wrong action', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-wrong-action-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: {},
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should not get here, it should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(`Error: module name: message-action is not a DataObject`);
        }
    });
    it('initialize schema x2', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {},
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
            } as NamespaceSchema);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(`Error: Engine already initialized`);
        }
    });
    it('initialize invalid schema', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({} as NamespaceSchema);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.includes(`Error: Invalid namespace schema`);
        }
    });
    it('no modules to load', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $entities: {},
                $modulesPaths: [path.resolve(__dirname, './sample-namespace/modulesna')],
            } as NamespaceSchema);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.includes(
                `Error: Configuration provider is missing from schema, doesn't have a single provider loaded, nor a default provider`,
            );
        }
    });
    it('initialize from object, no rules', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: [] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: {},
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        await engine.shutdown();
        expect(
            warnSpy.calledWithMatch(
                sinon.match((value: string | string[]) =>
                    value.includes('No rules found for entityName: message, eventName: incoming-message'),
                ),
            ),
        ).to.be.true;
    });
    it('throwWarning', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: { throwWarning: true },
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        expect(
            warnSpy.calledWithMatch(
                sinon.match((value: string | string[]) =>
                    value.includes('A warning error has occurred while handling event: Error: warning'),
                ),
            ),
        ).to.be.true;
    });
    it('throwInfo', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: { throwInfo: true },
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        expect(
            infoSpy.calledWithMatch(
                sinon.match((value: string | string[]) =>
                    value.includes('An info error has occurred while handling event: Error: info'),
                ),
            ),
        ).to.be.true;
    });
    it('throwError', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { throwError: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: unknown error');
        }
    });
    it('throwCriticalError', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { throwCriticalError: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: critical error');
        }
    });
    it('throwEngineCriticalError', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { throwEngineCriticalError: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: engine critical error');
        }
    });
    it('dataObjectThrow', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { dataObjectThrow: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: data object throws');
        }
    });
    it('actionThrow', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { actionThrow: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: action throws');
        }
    });
    it('dataObjectNotFound', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { dataObjectNotFound: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Requested module name not found: not-found');
        }
    });
    it('actionNotFound', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { actionNotFound: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Requested module name not found: not-found');
        }
    });
    it('dataObjectThrow but continue', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            process.env.GR_THROW_ON_EVENT_UNHANDLED_EXCEPTION = 'FALSE';
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { dataObjectThrow: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
        } catch (e) {
            expect.fail(`this should not throw ${String(e)}`);
        } finally {
            delete process.env.GR_THROW_ON_EVENT_UNHANDLED_EXCEPTION;
        }
    });
    it('throwCriticalError but continue', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: ['process-message-rule'] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
        } as NamespaceSchema);

        try {
            process.env.GR_THROW_ON_CRITICAL_ERROR = 'FALSE';
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { throwCriticalError: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
        } catch (e) {
            expect.fail(`this should not throw ${String(e)}`);
        } finally {
            delete process.env.GR_THROW_ON_CRITICAL_ERROR;
        }
    });
    it('KafkaConsumer pass not initialized engine', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            new KafkaConsumer('client', 'client', ['a'], engine);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Engine passed to KafkaConsumer should be initialized');
        }
    });
    it('KafkaConsumer missing brokers', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            new KafkaConsumer('client', 'client', [], engine);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Kafka brokers are missing');
        }
    });
    it('filters dont stop', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': {
                        $filters: ['sample-filter'],
                        $rules: ['process-message-rule'],
                    },
                },
            },
            $modulesPaths: [
                '$',
                path.resolve(__dirname, './sample-namespace/modules'),
                path.resolve(__dirname, './sample-namespace/modules-filters'),
            ],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: {},
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        await engine.shutdown();

        const result = findCallWithText(infoSpy, 'JournalLog: ');
        console.log(result);
        expect(result).to.includes("starting filter 'sample-filter'");
        expect(result).to.includes("starting rule 'process-message-rule'");
    });
    it('filters stop', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': {
                        $filters: ['sample-filter'],
                        $rules: ['process-message-rule'],
                    },
                },
            },
            $modulesPaths: [
                '$',
                path.resolve(__dirname, './sample-namespace/modules'),
                path.resolve(__dirname, './sample-namespace/modules-filters'),
            ],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: { stop: true },
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        await engine.shutdown();

        const result = findCallWithText(infoSpy, 'JournalLog: ');
        console.log(result);
        expect(result).to.includes("starting filter 'sample-filter'");
        expect(result).to.includes("filter 'sample-filter' stopped event");
    });
    it('filters throw', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': {
                        $filters: ['sample-filter'],
                        $rules: ['process-message-rule'],
                    },
                },
            },
            $modulesPaths: [
                '$',
                path.resolve(__dirname, './sample-namespace/modules'),
                path.resolve(__dirname, './sample-namespace/modules-filters'),
            ],
        } as NamespaceSchema);

        try {
            await engine.handleEvent<IncomingMessagePayloadType>(
                {
                    eventId: '1000',
                    entityName: 'message',
                    eventName: 'incoming-message',
                    payload: { throw: true },
                    eventLag: 5,
                    source: 'unit-tests',
                },
                () => () => {},
            );
            expect.fail(`this should throw`);
        } catch {
            // ignore
        }
        await engine.shutdown();

        const result = findCallWithText(errorSpy, 'JournalLog: ');
        expect(result).to.includes("starting filter 'sample-filter'");
        expect(result).to.includes("Error ending filter 'sample-filter', error: 'Error: throwing'");
    });
    it('initialize with async actions 1', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $entities: {},
                $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules')],
                $providers: {
                    actionQueuer: '',
                },
                $asyncActions: [
                    {
                        actionPluginName: '',
                        queuerConfig: {},
                    },
                ],
            } as NamespaceSchema);
            expect.fail(`This should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: Requested module name not found: ');
        }
    });
    it('initialize with async actions 2 no decorator', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/async-actions-modules')],
                $entities: {},
                $providers: {
                    actionQueuer: 'sample-action-queuer',
                },
                $asyncActions: [
                    {
                        actionPluginName: 'sample-action',
                        queuerConfig: {},
                    },
                ],
            } as NamespaceSchema);
            expect.fail(`This should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(
                'Error: AsyncAction: sample-action is missing "AsyncAction" tag. Are you sure you added @AsyncAction decorator?',
            );
        }
    });
    /*it('initialize with async actions 3 no interface', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/async-actions-modules')],
                $entities: {},
                $asyncActions: [
                    {
                        actionPluginName: 'sample-async-no-interface-action',
                        queuerProviderName: 'sample-action-queuer',
                        queuerConfig: { topic: 'asd' },
                    },
                ],
            } as NamespaceSchema);
            expect.fail(`This should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(
                "Error: It looks like the loaded module does not correctly implement it's expected interface for tag: [AsyncAction]: sample-async-no-interface-action",
            );
        }
    });*/
    it('initialize with async actions 4 invalid queuer config', async () => {
        const engine = new GallifreyRulesEngine();
        try {
            await engine.initialize({
                $namespace: 'sample-namespace',
                $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/async-actions-modules1')],
                $entities: {},
                $providers: {
                    actionQueuer: 'sample-action-queuer',
                },
                $asyncActions: [
                    {
                        actionPluginName: 'sample-async-action',
                        queuerConfig: {},
                    },
                ],
            } as NamespaceSchema);
            expect.fail(`This should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal(
                'Error: Failed to validate queuer config for queuerProviderName: sample-action-queuer: Error: Missing topic from queuerConfig',
            );
        }
    });
    it('initialize with async actions 5', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/async-actions-modules1')],
            $entities: {},
            $providers: {
                actionQueuer: 'sample-action-queuer',
            },
            $asyncActions: [
                {
                    actionPluginName: 'sample-async-action',
                    queuerConfig: { topic: 'something' },
                },
            ],
        } as NamespaceSchema);
    });
    it('initialize without getModuleName', async () => {
        const engine = new GallifreyRulesEngine();
        await engine.initialize({
            $namespace: 'sample-namespace',
            $entities: {
                message: {
                    'incoming-message': { $rules: [ProcessMessageRule.name] },
                },
            },
            $modulesPaths: ['$', path.resolve(__dirname, './sample-namespace/modules-no-name')],
        } as NamespaceSchema);

        await engine.handleEvent<IncomingMessagePayloadType>(
            {
                eventId: '1000',
                entityName: 'message',
                eventName: 'incoming-message',
                payload: {},
                eventLag: 5,
                source: 'unit-tests',
            },
            () => () => {},
        );
        await engine.shutdown();
    });
});
