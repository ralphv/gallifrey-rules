/**
 * author: Ralph Varjabedian
 */
import { BaseActionPayload } from '../base-interfaces/BaseTypes';
import EngineInterface from './EngineInterface';

/**
 * Passed to actions
 */
export default interface EngineActionInterface<ActionPayloadType extends BaseActionPayload> extends EngineInterface {
    /**
     * Gets the payload passed to the Action
     */
    getPayload(): ActionPayloadType;

    /**
     * This will return true if this action was queued as an asynchronous action
     */
    isAsyncQueued(): boolean;
}
