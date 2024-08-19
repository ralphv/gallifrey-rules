import { EventDispatcherInterface, GallifreyEventType, GallifreyProvider, ProviderType } from '../../../../src';

@GallifreyProvider(ProviderType.EventDispatcher)
export default class TestEventDispatcher implements EventDispatcherInterface<any, any> {
    getEvent(message: any): GallifreyEventType<any> {
        return { entityName: 'entity', eventId: '1', eventLag: 0, eventName: 'event', payload: message, source: '' };
    }
}
