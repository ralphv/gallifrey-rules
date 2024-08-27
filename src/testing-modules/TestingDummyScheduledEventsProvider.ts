/* eslint-disable @typescript-eslint/no-unused-vars */

import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import {
    ScheduledEventRequest,
    ScheduledEventIDResponse,
    ScheduledEventsInterface,
    TriggeredByEvent,
} from '../interfaces/Providers';
import { ScheduledEventQuery, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';

@GallifreyProvider(ProviderType.ScheduledEvents, true)
export default class TestingDummyScheduledEventsProvider implements ScheduledEventsInterface {
    // eslint-disable-next-line @typescript-eslint/require-await
    async insertScheduledEvent(
        event: ScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventIDResponse> {
        return { scheduledEventID: '100' };
    }

    async deleteScheduledEvent(scheduledEventID: string): Promise<boolean> {
        return true;
    }

    getScheduledEvent(scheduledEventID: string): Promise<ScheduledEventResponse | undefined> {
        return Promise.resolve(undefined);
    }

    queryScheduledEvents(query: ScheduledEventQuery): Promise<ScheduledEventResponse[]> {
        return Promise.resolve([]);
    }
}
