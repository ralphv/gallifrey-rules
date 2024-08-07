export default class PostgresDatabaseLocks {
    private static initialized;
    private readonly connectionConfig;
    constructor();
    private getClient;
    private initialize;
    private createAcquireLockFunction;
    acquireLock(lockKey: string, maxWaitMs: number): Promise<{
        acquired: boolean;
        release: () => Promise<void>;
    }>;
}
