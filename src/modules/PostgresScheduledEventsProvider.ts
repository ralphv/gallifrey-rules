import { ScheduledEventsInterface } from '../interfaces/Providers';
import {
    CompleteScheduledEventRequest,
    ScheduledEventResponse,
    TriggeredByEvent,
} from '../interfaces/Providers/ScheduledEventsInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import Database from '../database/Database';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.ScheduledEvents)
export default class PostgresScheduledEventsProvider implements ScheduledEventsInterface {
    getModuleName(): string {
        return ModuleNames.PostgresScheduledEvents;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async insertScheduledEvent(
        event: CompleteScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date | undefined,
        scheduledCount: number,
    ): Promise<ScheduledEventResponse> {
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
}
