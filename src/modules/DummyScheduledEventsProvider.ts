/* eslint-disable @typescript-eslint/no-unused-vars */
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';
import {
    ScheduledEventIDResponse,
    ScheduledEventQuery,
    ScheduledEventRequest,
    ScheduledEventResponse,
    ScheduledEventsInterface,
    TriggeredByEvent,
} from '../interfaces/Providers';

@GallifreyProvider(ProviderType.ScheduledEvents, true)
export default class DummyScheduledEventsProvider implements ScheduledEventsInterface {
    getModuleName(): string {
        return ModuleNames.DummyScheduledEvents;
    }

    insertScheduledEvent(
        event: ScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventIDResponse> {
        return Promise.reject(`This is the dummy scheduled event provider, functionality unavailable`);
    }

    deleteScheduledEvent(scheduledEventID: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined> {
        return Promise.resolve(undefined);
    }

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]> {
        return Promise.resolve([]);
    }
}
