import DistributedLocksInterface, { ReleaseLock } from './interfaces/Providers/DistributedLocksInterface';
import { Metrics } from './lib/Metrics';
import { GallifreyEventTypeInternal } from './lib/GallifreyEventTypeInternal';
export default class DistributedLocksWrapper {
    private inner;
    private metrics;
    private readonly waitTimeInMs;
    private readonly enabledLocks;
    constructor(inner: DistributedLocksInterface, metrics: Metrics);
    acquireLock(event: GallifreyEventTypeInternal<any>): Promise<ReleaseLock>;
}
