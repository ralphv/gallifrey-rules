/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cache } from '../../src/lib/CoreDecorators';
import { expect } from 'chai';
import EngineCriticalError from '../../src/errors/EngineCriticalError';

describe('Cache', () => {
    it('test simple case', async () => {
        class Test {
            public called = 0;

            @Cache
            getSomething() {
                this.called++;
                return 'result';
            }
        }

        const t = new Test();
        expect(t.called).to.be.equal(0);
        expect(t.getSomething()).equal('result');
        expect(t.called).to.be.equal(1);
        expect(t.getSomething()).equal('result');
        expect(t.called).to.be.equal(1);
    });
    it('test simple case async', async () => {
        class Test1 {
            public called = 0;

            @Cache
            async getSomething() {
                this.called++;
                return 'result';
            }
        }

        const t = new Test1();
        expect(t.called).to.be.equal(0);
        expect(await t.getSomething()).equal('result');
        expect(t.called).to.be.equal(1);
        expect(await t.getSomething()).equal('result');
        expect(t.called).to.be.equal(1);
    });
    it('use on class', async () => {
        try {
            // @ts-expect-error ignore
            @Cache
            class Test {}
            expect.fail(`this should throw`);
        } catch (e) {
            expect(e).to.be.an('error');
            expect(e).to.be.instanceOf(EngineCriticalError);
            expect(String(e)).to.contain('Decorator Cache is being used wrong on the method');
        }
    });
});
