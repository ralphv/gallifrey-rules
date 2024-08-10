import 'mocha';
import { expect } from 'chai';
import SchemaLoader from '../../src/lib/SchemaLoader';
import EngineCriticalError from '../../src/errors/EngineCriticalError';

describe('schema loader', () => {
    it('loading basic schema file', async () => {
        try {
            const schemaLoader = new SchemaLoader();
            await schemaLoader.loadSchemaFromFile('./tests/unit/other/sample-namespace-schema.json');
            expect(schemaLoader.isLoaded()).to.be.true;
            expect(schemaLoader.getNamespace()).equal('sample');
        } catch (e) {
            expect.fail(`expected to not throw error ${String(e)}`);
        }
    });
    it('loading basic schema file with missing namespace', async () => {
        const schemaLoader = new SchemaLoader();
        try {
            await schemaLoader.loadSchemaFromFile('./tests/unit/other/empty-namespace-schema.json');
            expect.fail(`it should throw an error`);
        } catch (e) {
            expect(schemaLoader.isLoaded()).false;
            expect(e).to.be.an('error');
            expect(String(e)).to.contain('Invalid namespace schema');
            expect(String(e)).to.contain('The required property `$namespace` is missing');
        }
    });
    it('loading basic schema object with missing namespace', async () => {
        try {
            const schemaLoader = new SchemaLoader();
            await schemaLoader.loadSchema({});
            expect.fail(`it should throw an error`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(String(e)).to.contain('Invalid namespace schema');
            expect(String(e)).to.contain('The required property `$namespace` is missing');
        }
    });
    it('loading basic schema string with missing namespace', async () => {
        try {
            const schemaLoader = new SchemaLoader();
            await schemaLoader.loadSchema('{}');
            expect.fail(`it should throw an error`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('Invalid namespace schema');
            expect(String(e)).to.contain('The required property `$namespace` is missing');
        }
    });
    it('ask something without loaded schema', async () => {
        try {
            const schemaLoader = new SchemaLoader();
            schemaLoader.getModulesPath();
            expect.fail(`it should throw an error`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('method called without a loaded schema');
        }
    });
    it('loading basic schema object with aliases', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $namespaceAliases: ['alt'],
            $modulesPaths: [],
            $entities: {},
        });
        expect(schemaLoader.getNamespace()).equal('main');
        expect(schemaLoader.getCompatibleNamespaces()).deep.equal(['main', 'alt']);
    });
    it('loading basic schema with configs 1', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $config: { namespaceLevel: 1 },
            $entities: {
                $config: { entityLevel: 2 },
                entity: {
                    event: {
                        $rules: [],
                        $config: { eventLevel: 3 },
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelConfig('entity', 'event')).deep.equal({
            namespaceLevel: 1,
            entityLevel: 2,
            eventLevel: 3,
        });
    });
    it('loading basic schema with configs 2', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $config: { namespaceLevel: 1 },
            $entities: {
                $config: { entityLevel: 2 },
                entity: {
                    event: {
                        $rules: [],
                        $config: { eventLevel: 3, entityLevel: 3 },
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelConfig('entity', 'event')).deep.equal({
            namespaceLevel: 1,
            entityLevel: 3,
            eventLevel: 3,
        });
    });
    it('loading basic schema with configs 3', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $config: { namespaceLevel: 1 },
            $entities: {
                $config: { entityLevel: 2 },
                entity: {
                    event: {
                        $rules: [],
                        $config: { eventLevel: 3, entityLevel: 3, namespaceLevel: 3 },
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelConfig('entity', 'event')).deep.equal({
            namespaceLevel: 3,
            entityLevel: 3,
            eventLevel: 3,
        });
    });
    it('loading basic schema with configs 4', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $config: { namespaceLevel: 1 },
            $entities: {
                $config: { entityLevel: 2, namespaceLevel: 2 },
                entity: {
                    event: {
                        $rules: [],
                        $config: { eventLevel: 3 },
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelConfig('entity', 'event')).deep.equal({
            namespaceLevel: 2,
            entityLevel: 2,
            eventLevel: 3,
        });
    });
    it('loading basic schema with configs 5', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $config: { namespaceLevel: 1 },
            $entities: {
                $config: { entityLevel: 2, namespaceLevel: 2 },
                entity: {
                    event: {
                        $rules: [],
                        $config: { eventLevel: 3, namespaceLevel: 3 },
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelConfig('entity', 'event')).deep.equal({
            namespaceLevel: 3,
            entityLevel: 2,
            eventLevel: 3,
        });
    });
    it('loading basic schema with schemaFile 1', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $schemaFile: '1',
            $entities: {
                $schemaFile: '2',
                entity: {
                    event: {
                        $schemaFile: '3',
                        $rules: [],
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelSchemaFile('entity', 'event')).equal('3');
    });
    it('loading basic schema with schemaFile 1', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $schemaFile: '1',
            $entities: {
                $schemaFile: '2',
                entity: {
                    event: {
                        $rules: [],
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelSchemaFile('entity', 'event')).equal('2');
    });
    it('loading basic schema with schemaFile 1', async () => {
        const schemaLoader = new SchemaLoader();
        await schemaLoader.loadSchema({
            $namespace: 'main',
            $entities: {
                entity: {
                    event: {
                        $rules: [],
                    },
                },
            },
            $modulesPaths: [],
        });
        expect(schemaLoader.getEventLevelSchemaFile('entity', 'event')).equal(undefined);
    });
});
