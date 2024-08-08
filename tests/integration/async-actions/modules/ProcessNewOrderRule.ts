import { EngineRuleInterface, GallifreyPlugin, PluginType, RuleInterface } from '../../../../src';
import { SendEmailActionPayloadType } from './SendEmailAction';
import { OrdersTopicPayloadType } from './OrdersTopicDispatcher';
import { ModuleNames } from '../ModuleNames';

@GallifreyPlugin(PluginType.Rule)
export default class ProcessNewOrderRule implements RuleInterface<OrdersTopicPayloadType> {
    getModuleName(): string {
        return ModuleNames.ProcessNewOrderRule;
    }

    async trigger(engine: EngineRuleInterface<OrdersTopicPayloadType>): Promise<void> {
        // the actions we do when we get a new order
        // 1. Send email to customer acknowledging the order receipt

        const { user, emailAddress, orderId } = engine.getEventPayload();

        await engine.doAction<SendEmailActionPayloadType, void>(ModuleNames.SendEmailAction, {
            emailAddress,
            email: `Hello ${user}, a new order has been created with order id: ${orderId}`,
        });
    }
}
