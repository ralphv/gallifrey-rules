/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unused-vars */
import { expect } from 'chai';
import { TimeAndWarn } from '../../src/lib/Decorators';
import { logger } from '../../src/lib/logger';
import sinon from 'sinon';
import EngineCriticalError from '../../src/errors/EngineCriticalError';
import { Metrics } from '../../src/lib/Metrics';
import InfluxDBMetricsProvider from '../../src/modules/InfluxDBMetricsProvider';

describe('TimeAndWarn', () => {
    let warnSpy: sinon.SinonSpy;
    beforeEach(() => {
        warnSpy = sinon.spy(logger, 'warn');
    });
    afterEach(() => {
        warnSpy.restore();
    });

    it('test simple case, no warnings', async () => {
        class Test {
            @TimeAndWarn(10)
            fast() {}
        }

        const t = new Test();
        try {
            t.fast();
            expect(warnSpy.called).to.be.false;
        } catch (e) {
            expect.fail(`this should not throw`);
        }
    });
    it('test simple case, with warnings', async () => {
        class Test {
            @TimeAndWarn(0)
            fast() {}
        }

        const metrics = new Metrics(new InfluxDBMetricsProvider());
        metrics.timeRule(
            {
                namespace: 'sample',
                entityName: 'test',
                eventId: '',
                eventLag: 0,
                eventName: '',
                payload: undefined,
                source: '',
            },
            'a',
            10,
        );
        const t = new Test();
        try {
            t.fast();
            //expect(warnSpy.calledTwice).to.be.true;
            expect(
                warnSpy.calledWithMatch(
                    sinon.match((value: string) => value.includes('Function "fast" execution time')),
                ),
            ).to.be.true;
            expect(
                warnSpy.calledWithMatch(
                    sinon.match((value: string) => value.includes('exceeded the threshold of 0ms.')),
                ),
            ).to.be.true;
        } catch (e) {
            console.log(String(e));
            expect.fail(`this should not throw: ${String(e)}`);
        }
    });
    it('test simple case, async no warnings', async () => {
        class Test {
            @TimeAndWarn(10)
            async fast() {}
        }

        const t = new Test();
        try {
            await t.fast();
            expect(warnSpy.called).to.be.false;
        } catch (e) {
            expect.fail(`this should not throw`);
        }
    });
    it('test simple case, async with warnings', async () => {
        class Test {
            @TimeAndWarn(5)
            async slow() {
                return new Promise((resolve) => {
                    setTimeout(resolve, 10);
                });
            }
        }

        const t = new Test();
        try {
            await t.slow();
            expect(warnSpy.calledOnce).to.be.true;
            expect(
                warnSpy.calledWithMatch(
                    sinon.match((value: string) => value.includes('Function "slow" execution time')),
                ),
            ).to.be.true;
            expect(
                warnSpy.calledWithMatch(
                    sinon.match((value: string) => value.includes('exceeded the threshold of 5ms.')),
                ),
            ).to.be.true;
        } catch (e) {
            expect.fail(`this should not throw`);
        }
    });
    it('use on class', async () => {
        try {
            // @ts-expect-error ignore
            @TimeAndWarn(1)
            class Test {}

            expect.fail(`this should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e).to.be.instanceOf(EngineCriticalError);
            expect(String(e)).to.contain('Decorator TimeAndWarn is being used wrong on the method');
        }
    });
});
