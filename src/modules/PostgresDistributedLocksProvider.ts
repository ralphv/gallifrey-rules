import DistributedLocksInterface, { ReleaseLock } from '../interfaces/Providers/DistributedLocksInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import PostgresDatabaseLocks from '../database/PostgresDatabaseLocks';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.DistributedLocks)
export default class PostgresDistributedLocksProvider implements DistributedLocksInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock> {
        const db = new PostgresDatabaseLocks();
        return db.acquireLock(lockId, maxWaitTime);
    }

    getModuleName(): string {
        return ModuleNames.PostgresDistributedLocks;
    }
}
