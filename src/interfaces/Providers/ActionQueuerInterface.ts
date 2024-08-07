/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import ModuleInterface from '../../base-interfaces/ModuleInterface';
import { AsyncActionEventType } from '../../engine-events/AsyncActionEventType';

export default interface ActionQueuerInterface<ConfigType, ActionPayloadType> extends ModuleInterface {
    /**
     * used to validate the queuer config passed in AsyncActionConfigType
     * @param queuerConfig
     */
    validateQueuerConfig(queuerConfig: any): void;

    queueAction(queueRequest: ActionQueuerRequest<ConfigType, ActionPayloadType>): Promise<void>;
}

export class __ActionQueuerInterface implements ActionQueuerInterface<any, any> {
    getModuleName(): string {
        return '';
    }

    validateQueuerConfig(queuerConfig: any): void {
        // empty
    }

    queueAction(queueRequest: ActionQueuerRequest<any, any>): Promise<void> {
        return Promise.reject('dead code');
    }
}

export interface ActionQueuerRequest<QueuerConfigType, ActionPayloadType>
    extends AsyncActionEventType<ActionPayloadType> {
    queuerConfig: QueuerConfigType;
}
