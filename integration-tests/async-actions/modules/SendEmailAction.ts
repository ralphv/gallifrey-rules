import { AsyncAction, AsyncActionInterface, EngineActionInterface, GallifreyPlugin, PluginType } from '../../../src';
import { ModuleNames } from '../ModuleNames';
import { SpyCalls } from '../../lib/IntegrationUtils';

@AsyncAction
@GallifreyPlugin(PluginType.Action)
export default class SendEmailAction implements AsyncActionInterface<SendEmailActionPayloadType, void> {
    getModuleName(): string {
        return ModuleNames.SendEmailAction;
    }

    @SpyCalls
    async trigger(engine: EngineActionInterface<SendEmailActionPayloadType>): Promise<void> {
        // For simplicity, we log sending email intention
        engine.info(
            `Sending email to [${engine.getPayload().emailAddress}] with email contents: ${engine.getPayload().email}`,
        );
    }
}

export type SendEmailActionPayloadType = {
    email: string;
    emailAddress: string;
};
