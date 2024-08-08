/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import { DontThrowJustLog } from '../../src/lib/Decorators';
import CriticalError from '../../src/errors/CriticalError';
import EngineCriticalError from '../../src/errors/EngineCriticalError';

describe('DontThrowJustLog', () => {
    it('test throw error', async () => {
        class Test {
            @DontThrowJustLog
            thisThrows() {
                throw new Error('sample error');
            }
            @DontThrowJustLog
            thisDoesNotThrow() {
                return 'yey';
            }
        }

        const t = new Test();
        try {
            t.thisThrows();
            expect(t.thisDoesNotThrow()).equal('yey');
        } catch (e) {
            expect.fail(`this should not throw`);
        }
    });
    it('test throw error from async', async () => {
        class Test {
            @DontThrowJustLog
            async thisThrows() {
                throw new Error('sample error');
            }
        }

        const t = new Test();
        try {
            await t.thisThrows();
        } catch (e) {
            expect.fail(`this should not throw`);
        }
    });
    it('use on class', async () => {
        try {
            // @ts-expect-error expected
            @DontThrowJustLog
            class Test {}
            expect.fail(`this should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e).to.be.instanceOf(EngineCriticalError);
            expect((e as Error).message).to.contain('Decorator DontThrowJustLog is being used wrong on the method');
        }
    });
    it('use on static', async () => {
        try {
            class Test {
                @DontThrowJustLog
                static thisThrows() {
                    throw new Error('sample error');
                }
                @DontThrowJustLog
                static thisDoesNotThrow() {
                    return 'from-static';
                }
            }
            Test.thisThrows();
            expect(Test.thisDoesNotThrow()).to.equal('from-static');
        } catch (e) {
            expect.fail(`This should not throw`);
        }
    });
    it('test throw critical error', async () => {
        class Test {
            @DontThrowJustLog
            thisThrows() {
                throw new CriticalError('this should throw');
            }
        }

        const t = new Test();
        try {
            t.thisThrows();
            expect.fail(`this should still throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e).to.be.instanceOf(CriticalError);
            expect((e as Error).message).to.equal('this should throw');
        }
    });
    it('test throw critical error async', async () => {
        class Test {
            @DontThrowJustLog
            async thisThrows() {
                throw new CriticalError('this should throw');
            }
        }

        const t = new Test();
        try {
            await t.thisThrows();
            expect.fail(`this should still throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e).to.be.instanceOf(CriticalError);
            expect((e as Error).message).to.equal('this should throw');
        }
    });
});
