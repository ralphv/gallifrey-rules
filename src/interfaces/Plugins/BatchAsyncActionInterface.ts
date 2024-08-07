/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * author: Ralph Varjabedian
 */
import { BaseActionPayload, BaseActionResponse } from '../../base-interfaces/BaseTypes';
import ActionInterface from './ActionInterface';
import BatchEngineActionInterface from '../../engine-interfaces/BatchEngineActionInterface';
import { EngineActionInterface } from '../../engine-interfaces';

/**
 * To support async actions
 */
export default interface BatchAsyncActionInterface<
    ActionPayloadType extends BaseActionPayload,
    ActionResponseType extends BaseActionResponse,
> extends ActionInterface<ActionPayloadType, ActionResponseType> {
    /**
     * Same as trigger but from the queue, async
     * @param engine
     */
    batchTriggerAsync<ActionPayloadType extends BaseActionPayload>(
        engine: BatchEngineActionInterface<ActionPayloadType>,
    ): Promise<void>;
}

export class __BatchAsyncActionInterface implements BatchAsyncActionInterface<any, any> {
    batchTriggerAsync<ActionPayloadType extends BaseActionPayload>(
        engine: BatchEngineActionInterface<ActionPayloadType>,
    ): Promise<void> {
        return Promise.reject('un-callable code');
    }

    getModuleName(): string {
        return '';
    }

    trigger(engine: EngineActionInterface<any>): Promise<any> {
        return Promise.reject('un-callable code');
    }
}
