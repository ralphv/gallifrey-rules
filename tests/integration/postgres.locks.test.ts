import 'mocha';
import { expect } from 'chai';
import Containers from './lib/Containers';
import PostgresLocks from '../../src/database/PostgresLocks';

describe('postgres locks', () => {
    it('try normal acquire and release', async () => {
        const containers = new Containers();
        const dbContainer = await containers.startDbContainer();
        try {
            // @ts-expect-error this is only needed for tests, since the runtime is changing configuration
            PostgresLocks.initialized = false;
            const database = new PostgresLocks();
            const result = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result.acquired}`);
            expect(result.acquired).to.be.true;
            const result1 = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result1.acquired}`);
            expect(result1.acquired).to.be.false;
            await result.release();
            const result2 = await database.acquireLock('this is a test', 100);
            console.log(`Lock: ${result2.acquired}`);
            expect(result2.acquired).to.be.true;
            await result2.release();
        } catch (e) {
            expect.fail(`expected to not throw error: ${String(e)}`);
        } finally {
            await PostgresLocks.closePool();
            await dbContainer.stop();
        }
    }).timeout(300000);
    it('try normal acquire and release 2', async () => {
        const containers = new Containers();
        const dbContainer = await containers.startDbContainer();
        try {
            // @ts-expect-error this is only needed for tests, since the runtime is changing configuration
            PostgresLocks.initialized = false;
            const database = new PostgresLocks();
            const result = await database.acquireLock('this is a test', 100);
            console.log(`Lock 0: ${result.acquired}`);
            expect(result.acquired).to.be.true;
            setTimeout(() => {
                console.log(`Releasing previous lock after 500 ms`);
                void result.release();
            }, 500);
            console.time('Waiting for lock for 5 seconds');
            console.log(`Attempting to acquire lock with 5 seconds max wait time`);
            const result1 = await database.acquireLock('this is a test', 5000);
            console.timeEnd('Waiting for lock for 5 seconds');
            console.log(`Lock 1: ${result1.acquired}`);
            expect(result1.acquired).to.be.true;
            const result2 = await database.acquireLock('this is a test', 100);
            console.log(`Lock 2: ${result2.acquired}`);
            expect(result2.acquired).to.be.false;
            await result2.release();
            await result1.release();
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (e) {
            expect.fail(`expected to not throw error: ${String(e)}`);
        } finally {
            await PostgresLocks.closePool();
            await dbContainer.stop();
        }
    }).timeout(300000);
});
