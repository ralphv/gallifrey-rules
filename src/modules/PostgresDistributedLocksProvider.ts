import DistributedLocksInterface, { ReleaseLock } from '../interfaces/Providers/DistributedLocksInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';
import PostgresLocks from '../database/PostgresLocks';

@GallifreyProvider(ProviderType.DistributedLocks)
export default class PostgresDistributedLocksProvider implements DistributedLocksInterface {
    async acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock> {
        const db = new PostgresLocks();
        return db.acquireLock(lockId, maxWaitTime);
    }

    getModuleName(): string {
        return ModuleNames.PostgresDistributedLocks;
    }
}
