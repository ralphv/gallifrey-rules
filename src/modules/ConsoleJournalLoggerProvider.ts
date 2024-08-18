import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import JournalLoggerInterface from '../interfaces/Providers/JournalLoggerInterface';
import { GallifreyEventTypeInternal } from '../lib/GallifreyEventTypeInternal';
import { logger } from '../lib/logger';
import Config from '../lib/Config';
import { ModuleNames } from '../ModuleNames';
import { CompleteScheduledEventRequest, TriggeredByEvent } from '../interfaces/Providers/ScheduledEventsInterface';

@GallifreyProvider(ProviderType.JournalLogger)
export default class ConsoleJournalLoggerProvider implements JournalLoggerInterface {
    private readonly addExtraToJournalLogs: boolean;
    constructor() {
        const config = new Config();
        this.addExtraToJournalLogs = config.getAddExtraToJournalLogs();
    }
    private log: ConsoleJournalLoggerProviderType | undefined;

    startEvent(event: GallifreyEventTypeInternal<any>): void {
        this.log = {
            entityName: event.entityName,
            eventName: event.eventName,
            eventId: event.eventId,
            payload: event.payload,
            source: event.source,
            eventLag: event.eventLag,
            logs: [],
        };
        this.log?.logs.push({ description: `starting event '${event.eventName}'` });
    }

    customLog(description: string, extra: any): void {
        this.log?.logs.push({ description, extra: this.getExtra(extra) });
    }

    endDoAction(name: string, response: any, duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending action '${name}', error: '${String(error)}'`,
                extra: this.getExtra(error),
            });
        } else {
            this.log?.logs.push({
                description: `ending action '${name}', duration: ${duration}`,
                extra: this.getExtra(response),
            });
        }
    }

    endEvent(duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending event: '${String(error)}'`,
                extra: this.getExtra(error),
            });
        } else {
            this.log?.logs.push({ description: `ending event, duration: ${duration}` });
        }
        logger.info(`JournalLog: ${JSON.stringify(this.log, null, 2)}`);
        this.onEndEvent(this.log);
        this.log = undefined;
    }

    endPullDataObject(name: string, response: any, duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending data-object '${name}', error: '${String(error)}'`,
                extra: this.getExtra(error),
            });
        } else {
            this.log?.logs.push({
                description: `ending data-object '${name}', duration: ${duration}`,
                extra: this.getExtra(response),
            });
        }
    }

    endRunRule(name: string, duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending rule '${name}', error: '${String(error)}'`,
                extra: this.getExtra(error),
            });
        } else {
            this.log?.logs.push({ description: `ending rule '${name}', duration: ${duration}` });
        }
    }

    getModuleName(): string {
        return ModuleNames.ConsoleJournalLogger;
    }

    startDoAction(name: string, payload: any): void {
        this.log?.logs.push({ description: `starting action '${name}'`, extra: this.getExtra(payload) });
    }

    startPullDataObject(name: string, request: any): void {
        this.log?.logs.push({ description: `starting data-object '${name}'`, extra: this.getExtra(request) });
    }

    startRunRule(name: string): void {
        this.log?.logs.push({ description: `starting rule '${name}'` });
    }

    private getExtra(extra: any) {
        if (!this.addExtraToJournalLogs) {
            return undefined;
        }
        return extra;
    }

    dataObjectPulledFromEventStore(name: string, request: any): void {
        this.log?.logs.push({
            description: `data-object '${name}' result pulled from event store`,
            extra: this.getExtra(request),
        });
    }

    endFilter(name: string, duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending filter '${name}', error: '${String(error)}'`,
                extra: this.getExtra(error),
            });
        } else {
            this.log?.logs.push({ description: `ending filter '${name}', duration: ${duration}` });
        }
    }

    startFilter(name: string): void {
        this.log?.logs.push({ description: `starting filter '${name}'` });
    }

    filterStoppedEvent(name: string, duration: number) {
        this.log?.logs.push({ description: `filter '${name}' stopped event, duration: ${duration}` });
    }

    endQueueAsyncAction(name: string, duration: number, error?: Error): void {
        if (error) {
            this.log?.logs.push({
                description: `Error ending queue async action '${name}', duration: ${duration}, error: ${String(error)}`,
            });
        } else {
            this.log?.logs.push({ description: `ending queue async action '${name}', duration: ${duration}` });
        }
    }

    startQueueAsyncAction(name: string, payload: any): void {
        this.log?.logs.push({ description: `starting queue async action '${name}'`, extra: this.getExtra(payload) });
    }

    insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): void {
        this.log?.logs.push({
            description: `insert scheduled event: entityName: '${event.entityName}' eventName: '${event.eventName}' eventID: '${event.eventId}'`,
            extra: this.getExtra({ event, triggeredBy, scheduleAt, scheduledCount }),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected onEndEvent(log: ConsoleJournalLoggerProviderType | undefined) {
        // for deriving classes
    }
}

interface ConsoleJournalLoggerProviderType {
    entityName: string;
    eventName: string;
    eventId: string;
    payload: any;
    source: string;
    eventLag: number;
    logs: { description: string; extra?: any }[];
}
