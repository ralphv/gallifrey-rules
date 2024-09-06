import DistributedLocksInterface, { ReleaseLock } from './interfaces/Providers/DistributedLocksInterface';
import PerformanceTimer from './lib/PerformanceTimer';
import { Metrics } from './lib/Metrics';
import { GallifreyEventTypeInternal } from './lib/GallifreyEventTypeInternal';
import Config from './lib/Config';
import { LoggerInterface } from './interfaces/Providers';

export default class DistributedLocksWrapper {
    private readonly waitTimeInMs: number;
    private readonly enabledLocks: boolean;
    constructor(
        private inner: DistributedLocksInterface,
        private metrics: Metrics,
        private readonly logger: LoggerInterface,
    ) {
        const config = new Config();
        this.enabledLocks = config.isDistributedLocksEnabled();
        this.waitTimeInMs = config.getDistributedLocksMaxWaitTimeInSeconds() * 1000;
    }

    async acquireLock(
        event: GallifreyEventTypeInternal<any>,
        atomicEvent: boolean,
        atomicEntity: boolean,
    ): Promise<ReleaseLock> {
        if (!this.enabledLocks || (!atomicEvent && !atomicEntity)) {
            // return dummy lock
            return {
                acquired: true,
                release: async () => {},
            };
        }
        // lock on namespace/entity/entityID
        const lockId = atomicEvent
            ? `${event.namespace}-${event.entityName}-${event.eventName}-${event.eventId}` // atomic event
            : `${event.namespace}-${event.entityName}-${event.eventId}`; // atomic entity

        const timer = new PerformanceTimer().resume();
        try {
            await this.logger.info(`Starting acquireLock: ${lockId}`);
            const { release, acquired } = await this.inner.acquireLock(lockId, this.waitTimeInMs);
            if (acquired) {
                await this.logger.info(`Acquired Lock successfully: ${lockId}`);
            } else {
                await this.logger.error(`Failed to acquire Lock: ${lockId}`);
            }
            const duration = timer.end();
            this.metrics.timeAcquireLock(event, duration, true);
            return {
                release: async () => {
                    const timer = new PerformanceTimer().resume();
                    try {
                        await release();
                        const duration = timer.end();
                        this.metrics.timeReleaseLock(event, duration, true);
                    } catch (e) {
                        const duration = timer.end();
                        this.metrics.timeReleaseLock(event, duration, false);
                        throw e;
                    }
                },
                acquired,
            };
        } catch (e) {
            const duration = timer.end();
            this.metrics.timeAcquireLock(event, duration, false);
            await this.logger.debug(`Failed to acquire lock exception: ${lockId}: ${String(e)}`);
            throw e;
        }
    }
}
