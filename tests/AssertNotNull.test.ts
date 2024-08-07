import { AssertNotNull } from '../src/lib/Utils';
import { expect } from 'chai';

describe('AssertNotNull', () => {
    it('AssertNotNull', async () => {
        expect(AssertNotNull('sample')).to.be.equal('sample');
    });
    it('AssertNull', async () => {
        try {
            AssertNotNull(null);
            expect.fail(`this should throw`);
        } catch (e) {
            expect(String(e)).to.be.equal('Error: AssertNotNull failed');
        }
    });
});
