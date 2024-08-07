/**
 * author: Ralph Varjabedian
 */
import { DontThrowJustLog } from './Decorators';
import { GallifreyEventTypeInternal } from './GallifreyEventTypeInternal';
import MetricsInterface from '../interfaces/Providers/MetricsInterface';

export class Metrics {
    constructor(private metricsProvider: MetricsInterface) {}

    @DontThrowJustLog
    private getPoint(measurementName: string, event: GallifreyEventTypeInternal<any>) {
        const point = this.metricsProvider.getPoint(measurementName);
        return point
            .tag('namespace', event.namespace)
            .tag('entity', event.entityName)
            .tag('event', event.eventName)
            .tag('source', event.source);
    }

    @DontThrowJustLog
    engineInitialized(namespace: string) {
        const point = this.metricsProvider.getPoint('engine_initialized');
        point.intField('count', 1);
        point.tag('namespace', namespace);
        void point.submit();
    }

    @DontThrowJustLog
    handleEvent(event: GallifreyEventTypeInternal<any>) {
        const point = this.getPoint('handle_event', event);
        point.intField('count', 1).floatField('lag', event.eventLag);
        void point.submit();
    }

    async flush() {
        await this.metricsProvider.flush();
    }

    @DontThrowJustLog
    publishPartitionLag(namespace: string, lag: number, partition: number, topic: string, group: string) {
        const point = this.metricsProvider.getPoint('consumer_partition_lags');

        point.uintField('lag', lag);

        point.tag('namespace', namespace);
        point.tag('partition', String(partition));
        point.tag('topic', topic);
        point.tag('group', group);

        void point.submit();
    }

    private timeModule(
        event: GallifreyEventTypeInternal<any>,
        name: string,
        timerInMs: number,
        measurement: string,
        moduleTagType?: string,
    ) {
        const point = this.getPoint(measurement, event);

        point.floatField('timerMs', timerInMs);

        if (moduleTagType) {
            point.tag(moduleTagType, name);
        }

        void point.submit();
    }

    @DontThrowJustLog
    timeEvent(event: GallifreyEventTypeInternal<any>, timerInMs: number) {
        this.timeModule(event, '', timerInMs, 'event_timer');
    }

    @DontThrowJustLog
    timeRule(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number) {
        this.timeModule(event, name, timerInMs, 'rule_timer', 'rule');
    }

    @DontThrowJustLog
    timeAction(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number, triggeredAsAsync: boolean) {
        this.timeModule(event, name, timerInMs, triggeredAsAsync ? 'async_action_timer' : 'action_timer', 'action');
    }

    @DontThrowJustLog
    timeDataObject(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number) {
        this.timeModule(event, name, timerInMs, 'data_object_timer', 'data_object');
    }

    @DontThrowJustLog
    timeFilter(event: GallifreyEventTypeInternal<any>, name: string, timerInMs: number) {
        this.timeModule(event, name, timerInMs, 'filter_timer', 'filter');
    }

    @DontThrowJustLog
    timeAcquireLock(event: GallifreyEventTypeInternal<any>, timerInMs: number, acquiredSuccess: boolean) {
        const point = this.getPoint('acquire_lock_timer', event);

        point.floatField('timerMs', timerInMs);
        point.uintField('success', acquiredSuccess ? 1 : 0);

        void point.submit();
    }

    @DontThrowJustLog
    timeReleaseLock(event: GallifreyEventTypeInternal<any>, timerInMs: number, acquiredSuccess: boolean) {
        const point = this.getPoint('release_lock_timer', event);

        point.floatField('timerMs', timerInMs);
        point.uintField('success', acquiredSuccess ? 1 : 0);

        void point.submit();
    }

    @DontThrowJustLog
    countErrors(event: GallifreyEventTypeInternal<any>) {
        const point = this.getPoint('errors', event);

        point.uintField('count', 1);

        void point.submit();
    }

    @DontThrowJustLog
    queuedAction(
        event: GallifreyEventTypeInternal<any>,
        actionName: string,
        timerInMs: number,
        queuedSuccess: boolean,
    ) {
        const point = this.getPoint('queued_actions', event);

        point.tag('action', actionName);
        point.uintField('count', 1);
        point.floatField('timerMs', timerInMs);
        point.uintField('success', queuedSuccess ? 1 : 0);

        void point.submit();
    }

    @DontThrowJustLog
    timeIt(className: string, methodName: string, timerInMs: number) {
        const point = this.metricsProvider.getPoint('time_it');

        point.floatField('timerMs', timerInMs);
        point.tag('class', className);
        point.tag('method', methodName);

        void point.submit();
    }
}
