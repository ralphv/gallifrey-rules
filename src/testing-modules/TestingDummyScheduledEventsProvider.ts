/* eslint-disable @typescript-eslint/no-unused-vars */

import { GallifreyProvider, ProviderType } from '../interfaces/InterfaceDecorators';
import {
    ScheduledEventRequest,
    ScheduledEventResponse,
    ScheduledEventsInterface,
    TriggeredByEvent,
} from '../interfaces/Providers';

@GallifreyProvider(ProviderType.ScheduledEvents, true)
export default class TestingDummyScheduledEventsProvider implements ScheduledEventsInterface {
    // eslint-disable-next-line @typescript-eslint/require-await
    async insertScheduledEvent(
        event: ScheduledEventRequest,
        triggeredBy: TriggeredByEvent,
        scheduleAt: Date,
        scheduledCount: number,
    ): Promise<ScheduledEventResponse> {
        return { scheduledEventID: '100' };
    }
}
