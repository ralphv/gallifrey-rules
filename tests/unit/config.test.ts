import 'mocha';
import { expect } from 'chai';
import BaseConfig from '../../src/lib/BaseConfig';
import * as path from 'node:path';
import Config from '../../src/lib/Config';
import { ClearCache } from '../../src/lib/CoreDecorators';
import ModulesLoader from '../../src/lib/ModulesLoader';
import EngineCriticalError from '../../src/errors/EngineCriticalError';

class TestBasicConfig extends BaseConfig {
    constructor() {
        super(`TEST_GR_`);
    }

    getBooleanDefaultFalseDontThrow() {
        return this.getBoolEnvVariable(`BOOLEAN`, false, false);
    }

    isBooleanThrow() {
        return this.getBoolEnvVariable(`BOOLEAN_THROW`, false, true);
    }

    getNumericDefault10DontThrow() {
        return this.getNumberEnvVariable(`NUMERIC`, 10, false);
    }

    getSecretMustExist() {
        return this.getSecretEnvVariable(`SECRET`, '', true);
    }

    getArrayValue() {
        return this.getArrayEnvVariable(`ARRAY`, [], false);
    }
}

describe('config and base config, bool', () => {
    it('get boolean default false dont throw', async () => {
        try {
            const config = new TestBasicConfig();
            expect(config.getBooleanDefaultFalseDontThrow()).false;
            process.env['TEST_GR_BOOLEAN'] = 'true';
            expect(config.getBooleanDefaultFalseDontThrow()).true;
            delete process.env['TEST_GR_BOOLEAN'];
            expect(config.getBooleanDefaultFalseDontThrow()).false;
            process.env['TEST_GR_BOOLEAN'] = 'TRUE';
            expect(config.getBooleanDefaultFalseDontThrow()).true;
            delete process.env['TEST_GR_BOOLEAN'];
            expect(config.getBooleanDefaultFalseDontThrow()).false;
        } finally {
            delete process.env['TEST_GR_BOOLEAN'];
        }
    });
    it('get boolean throw but default supplied', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_BOOLEAN_THROW'] = 'true';
            expect(config.isBooleanThrow()).true;
            process.env['TEST_GR_SECRET'] = 'this is not so secret';
            config.describe();
            process.env['TEST_GR_BOOLEAN_THROW'] = 'false';
            expect(config.isBooleanThrow()).false;
        } finally {
            delete process.env['TEST_GR_BOOLEAN_THROW'];
            delete process.env['TEST_GR_SECRET'];
        }
    });
    it('get boolean throw but default not supplied', async () => {
        try {
            const config = new TestBasicConfig();
            expect(config.isBooleanThrow()).true;
            expect.fail(`Should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('The environment variable');
            expect(String(e)).to.contain('is empty or missing and it is marked as required');
        }
    });
});
describe('config and base config, numeric', () => {
    it('get numeric default 10 dont throw', async () => {
        try {
            const config = new TestBasicConfig();
            expect(config.getNumericDefault10DontThrow()).to.be.equal(10);
            process.env['TEST_GR_NUMERIC'] = '10';
            expect(config.getNumericDefault10DontThrow()).to.be.equal(10);
            process.env['TEST_GR_NUMERIC'] = '11';
            expect(config.getNumericDefault10DontThrow()).to.be.equal(11);
        } finally {
            delete process.env['TEST_GR_NUMERIC'];
        }
    });
    it('get numeric default 10 dont throw, value not number', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_NUMERIC'] = 'not-numeric';
            config.getNumericDefault10DontThrow();
            expect.fail(`should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('is marked as numeric but does not seem so');
        } finally {
            delete process.env['TEST_GR_NUMERIC'];
        }
    });
    it('get numeric default 10 dont throw, load from file', async () => {
        try {
            const config = new TestBasicConfig();
            expect(config.getNumericDefault10DontThrow()).to.be.equal(10);
            process.env['TEST_GR_NUMERIC_FILE'] = path.resolve(__dirname, 'other/test_gf_numeric_file.txt');
            expect(config.getNumericDefault10DontThrow()).to.be.equal(132);
        } finally {
            delete process.env['TEST_GR_NUMERIC_FILE'];
        }
    });
});
describe('config and base config, secret', () => {
    it('get secret from file', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_SECRET_FILE'] = path.resolve(__dirname, 'other/secret.txt');
            expect(config.getSecretMustExist().getSecretValue()).to.be.equal('this is a secret');
        } finally {
            delete process.env['TEST_GR_SECRET_FILE'];
        }
    });
    it('get not so secret from environment', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_SECRET'] = 'this is not so secret';
            expect(String(config.getSecretMustExist())).to.be.equal('****************');
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            expect(`${config.getSecretMustExist()}`).to.be.equal('****************');
            expect(config.getSecretMustExist().getSecretValue()).to.be.equal('this is not so secret');
        } finally {
            delete process.env['TEST_GR_SECRET'];
        }
    });
});

describe('config and base config, array', () => {
    it('get array default empty', async () => {
        const config = new TestBasicConfig();
        expect(config.getArrayValue()).to.be.length(0);
    });
    it('get array from json array', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_ARRAY'] = '["one","two"]';
            expect(config.getArrayValue()).to.be.length(2);
            expect(config.getArrayValue()).to.be.deep.equal(['one', 'two']);
        } finally {
            delete process.env['TEST_GR_ARRAY'];
        }
    });
    it('get array from json array', async () => {
        try {
            const config = new TestBasicConfig();
            process.env['TEST_GR_ARRAY'] = 'one,two';
            expect(config.getArrayValue()).to.be.length(2);
            expect(config.getArrayValue()).to.be.deep.equal(['one', 'two']);
        } finally {
            delete process.env['TEST_GR_ARRAY'];
        }
    });
    it('get plugin name pattern and clear cache', async () => {
        try {
            const config = new Config();
            expect(config.getModuleNamePattern()).to.not.be.empty;
            expect(ModulesLoader.isValidModuleName('Invalid$')).to.be.false;
            process.env['GR_MODULE_NAME_PATTERN'] = '';
            expect(config.getModuleNamePattern()).to.not.be.empty;
            ClearCache();
            expect(config.getModuleNamePattern()).to.be.empty;
            expect(ModulesLoader.isValidModuleName('Invalid$')).to.be.true;
            ClearCache();
        } finally {
            delete process.env['GR_MODULE_NAME_PATTERN'];
        }
    });
    it('provide safe already tests coverage', async () => {
        const config = new Config();
        config.getModulesPaths();
    });
});
