import { EventDispatcherInterface, GallifreyEventType, GallifreyProvider, ProviderType } from '../../../src';

@GallifreyProvider(ProviderType.EventDispatcher)
export default class SampleEventDispatcher implements EventDispatcherInterface<any, any> {
    getModuleName(): string {
        return 'sample-event-dispatcher';
    }

    getEvent(message: any): GallifreyEventType<any> {
        return {
            entityName: 'entity',
            eventName: 'new-entity',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            eventId: message.id ?? message.id_invalid ?? null,
            payload: message,
            source: 'e2e tests',
            eventLag: 0,
        };
    }
}
