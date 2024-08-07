/**
 * author: Ralph Varjabedian
 */
import EngineInterface from '../engine-interfaces/EngineInterface';

/**
 * A plugin that can be initialized
 */
export default interface InitializableInterface {
    initialize?(engine: EngineInterface): Promise<void>;
}
