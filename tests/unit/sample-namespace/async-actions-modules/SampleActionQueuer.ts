import { ActionQueuerInterface, ActionQueuerRequest, GallifreyProvider, ProviderType } from '../../../../src';

@GallifreyProvider(ProviderType.ActionQueuer)
export default class SampleActionQueuer implements ActionQueuerInterface<any, any> {
    getModuleName(): string {
        return 'sample-action-queuer';
    }

    validateQueuerConfig(queuerConfig: any): void {
        if (!('topic' in queuerConfig)) {
            throw new Error(`Missing topic from queuerConfig`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queueAction(queueRequest: ActionQueuerRequest<any, any>): Promise<void> {
        return Promise.resolve(undefined);
    }
}
