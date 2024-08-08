import 'mocha';
import { expect } from 'chai';
import PostgresDatabaseLocks from '../../src/database/PostgresDatabaseLocks';
import Containers from './lib/Containers';

describe('postgres locks', () => {
    it('try normal acquire and release', async () => {
        const containers = new Containers();
        const dbContainer = await containers.startDbContainer();
        try {
            // @ts-expect-error this is only needed for tests, since the runtime is changing configuration
            PostgresDatabaseLocks.initialized = false;
            const database = new PostgresDatabaseLocks();
            const result = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result.acquired}`);
            expect(result.acquired).to.be.true;
            const result1 = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result1.acquired}`);
            expect(result1.acquired).to.be.false;
            await result.release();
            const result2 = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result2.acquired}`);
            await result2.release();
        } catch (e) {
            expect.fail(`expected to not throw error: ${String(e)}`);
        } finally {
            await dbContainer.stop();
        }
    }).timeout(300000);
});
