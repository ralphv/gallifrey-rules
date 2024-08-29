import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import Database from '../database/Database';
import { ModuleNames } from '../ModuleNames';
import { ScheduledEventIDResponse, ScheduledEventsInterface, TriggeredByEvent } from '../interfaces/Providers';
import {
    CompleteScheduledEventRequest,
    ScheduledEventQuery,
    ScheduledEventResponse,
} from '../interfaces/Providers/ScheduledEventsInterface';

@GallifreyProvider(ProviderType.ScheduledEvents)
export default class PostgresScheduledEventsProvider implements ScheduledEventsInterface {
    getModuleName(): string {
        return ModuleNames.PostgresScheduledEvents;
    }

    async insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date | undefined,
        scheduledCount: number,
    ): Promise<ScheduledEventIDResponse> {
        const database = new Database();
        const response = await database.insertScheduledEvent({
            createdAt: new Date(),
            event: {
                entityName: event.entityName,
                eventID: event.eventId,
                eventName: event.eventName,
                namespace: event.namespace,
                payload: event.payload,
            },
            scheduledAt: scheduleAt,
            scheduledCount,
            triggeredBy: {
                namespace: triggeredBy.namespace,
                entityName: triggeredBy.entityName,
                eventID: triggeredBy.eventID,
                eventName: triggeredBy.eventName,
                source: triggeredBy.source,
            },
        });
        return {
            scheduledEventID: String(response),
        };
    }

    async deleteScheduledEvent(scheduledEventID: string): Promise<boolean> {
        const database = new Database();
        return await database.deleteScheduledEvent(scheduledEventID);
    }

    async getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined> {
        const database = new Database();
        return await database.getScheduledEvent(scheduledEventID);
    }

    async queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]> {
        const database = new Database();
        return await database.queryScheduledEvents(query);
    }
}
