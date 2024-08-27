/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScheduledEventsInterface } from '../interfaces/Providers';
import {
    ScheduledEventRequest,
    ScheduledEventIDResponse,
    TriggeredByEvent,
} from '../interfaces/Providers/ScheduledEventsInterface';
import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import { ModuleNames } from '../ModuleNames';

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
}
