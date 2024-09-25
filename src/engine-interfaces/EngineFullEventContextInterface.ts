/**
 * author: Ralph Varjabedian
 */

import { EngineEventContextInterface } from './index';

/**
 * Answers basic questions about the context of the current event and data related to it including the payload
 */
export default interface EngineFullEventContextInterface extends EngineEventContextInterface {
    /**
     * Payload
     */
    getPayload(): any;
}
