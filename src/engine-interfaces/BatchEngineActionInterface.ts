/**
 * author: Ralph Varjabedian
 */
import EngineActionInterface from './EngineActionInterface';

/**
 * Passed to actions
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export default interface BatchEngineActionInterface<ActionPayloadType>
    extends EngineActionInterface<ActionPayloadType> {}
