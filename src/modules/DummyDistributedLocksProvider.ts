import DistributedLocksInterface, { ReleaseLock } from '../interfaces/Providers/DistributedLocksInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.DistributedLocks, true)
export default class DummyDistributedLocksProvider implements DistributedLocksInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock> {
        return { release: async () => {}, acquired: true };
    }

    getModuleName(): string {
        return ModuleNames.DummyDistributedLocks;
    }
}
