import 'mocha';
import { expect } from 'chai';
import ModulesLoader from '../../src/lib/ModulesLoader';
import * as path from 'node:path';
import EngineCriticalError from '../../src/errors/EngineCriticalError';

describe('modules loader', () => {
    it('loading sample modules', async () => {
        const modulesLoader = new ModulesLoader();
        await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules'));
    });
    it('loading same modules again', async () => {
        const modulesLoader = new ModulesLoader();
        await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules'));
        await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules'));
    });
    it('loading different modules with same name', async () => {
        try {
            const modulesLoader = new ModulesLoader();
            await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules-same-name'));
            expect.fail(`Should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain(
                'Attempting to load a module with the same name of an already loaded module. Module names should be unique',
            );
        }
    });
    it('loading modules without decorator and throw', async () => {
        try {
            process.env['GR_THROW_ON_NOT_MODULE'] = 'true';
            const modulesLoader = new ModulesLoader();
            await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules-no-decorator'));
            expect.fail(`Should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('default export found in module');
            expect(String(e)).to.contain('is not decorated as a plugin/provider');
        } finally {
            delete process.env['GR_THROW_ON_NOT_MODULE'];
        }
    });
    it('loading modules without decorator and warn', async () => {
        try {
            process.env['GR_THROW_ON_NOT_MODULE'] = 'false';
            const modulesLoader = new ModulesLoader();
            await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules-no-decorator'));
            expect(modulesLoader.getModules()).to.be.length(0);
        } catch (e) {
            expect.fail(`expected to not throw error ${String(e)}`);
        } finally {
            delete process.env['GR_THROW_ON_NOT_MODULE'];
        }
    });
    it('loading modules without default export', async () => {
        try {
            const modulesLoader = new ModulesLoader();
            await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules-no-default'));
            expect.fail(`Should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('No default export found in module');
        }
    });
    it('loading modules without invalid naming', async () => {
        try {
            const modulesLoader = new ModulesLoader();
            await modulesLoader.loadModulesFromPath(path.resolve(__dirname, './modules-invalid-name'));
            expect.fail(`Should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e instanceof EngineCriticalError).to.be.true;
            expect(String(e)).to.contain('module name is not following naming conventions:');
        }
    });
});
