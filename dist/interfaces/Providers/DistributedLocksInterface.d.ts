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
export declare class __DistributedLocksInterface implements DistributedLocksInterface {
    getModuleName(): string;
    acquireLock(lockId: string, maxWaitTime: number): Promise<ReleaseLock>;
}
