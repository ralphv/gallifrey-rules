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
export declare class __ActionQueuerInterface implements ActionQueuerInterface<any, any> {
    getModuleName(): string;
    validateQueuerConfig(queuerConfig: any): void;
    queueAction(queueRequest: ActionQueuerRequest<any, any>): Promise<void>;
}
export interface ActionQueuerRequest<QueuerConfigType, ActionPayloadType> extends AsyncActionEventType<ActionPayloadType> {
    queuerConfig: QueuerConfigType;
}
