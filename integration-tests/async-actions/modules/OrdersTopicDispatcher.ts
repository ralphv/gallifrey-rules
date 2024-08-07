import { EventDispatcherInterface, GallifreyEventType, GallifreyProvider, ProviderType } from '../../../src';
import os from 'os';
import { ModuleNames } from '../ModuleNames';

@GallifreyProvider(ProviderType.EventDispatcher)
export default class OrdersTopicDispatcher
    implements EventDispatcherInterface<OrdersTopicPayloadType, OrdersTopicPayloadType>
{
    getModuleName(): string {
        return ModuleNames.OrderTopicDispatcher;
    }

    getEvent(message: OrdersTopicPayloadType): GallifreyEventType<OrdersTopicPayloadType> {
        // take the payload from the order-topic and translate that to an event that the engine understands
        return {
            entityName: 'orders',
            eventName: 'new-order',
            eventId: message.orderId,
            payload: message,
            source: os.hostname(),
            eventLag: 0,
        };
    }
}

/**
 * Defines the payload type of this event
 */
export type OrdersTopicPayloadType = {
    user: string;
    emailAddress: string;
    orderId: string;
};
