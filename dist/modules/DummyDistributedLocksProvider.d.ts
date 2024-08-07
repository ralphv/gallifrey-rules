import DistributedLocksInterface, { ReleaseLock } from '../interfaces/Providers/DistributedLocksInterface';
export default class DummyDistributedLocksProvider implements DistributedLocksInterface {
    acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock>;
    getModuleName(): string;
}
