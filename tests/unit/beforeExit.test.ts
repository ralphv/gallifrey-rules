/* eslint-disable @typescript-eslint/no-unused-vars */
import { BeforeExit } from '../../src/lib/Decorators';
describe('BeforeExit', () => {
    it('test simple case, no warnings', async () => {
        let cleanupCalled = 0;
        class Test {
            @BeforeExit
            cleanup() {
                console.log(`cleanup on Test automatically called`);
                cleanupCalled++;
            }
        }

        const test = new Test();
        const test1 = new Test();
    });
});
