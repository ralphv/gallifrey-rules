/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';

export interface ReleaseLock {
    acquired: boolean;
    release: () => Promise<void>;
}

export default interface DistributedLocksInterface extends ModuleInterface {
    acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock>;
}

export class __DistributedLocksInterface implements DistributedLocksInterface {
    getModuleName(): string {
        return '';
    }

    acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock> {
        return Promise.reject('un-callable code');
    }
}
