import { GallifreyRulesEngineForTesting, NamespaceSchema } from '../../../src';
import TestAction from './modules/TestAction';
import { expect } from 'chai';
import path from 'node:path';

describe('for-testing', () => {
    it('AssertNotNull', async () => {
        const engine = new GallifreyRulesEngineForTesting();
        await engine.initialize({
            $namespace: 'test-namespace',
            $entities: {},
            $modulesPaths: ['$', path.join(__dirname, './modules')],
        } as NamespaceSchema);
        const result = await engine.testDoAction(TestAction.name, { key: 'for-testing' });
        expect(result).equal('sample-action: for-testing');
    });
});
