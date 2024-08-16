import { GallifreyRulesEngineForTesting, NamespaceSchema } from '../../../src';
import TestAction from './modules/TestAction';
import { expect } from 'chai';
import path from 'node:path';
import TestDataObject from './modules/TestDataObject';

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
});
