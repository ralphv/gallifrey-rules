import ConfigurationAccessorInterface from '../interfaces/Providers/ConfigurationAccessorInterface';
import EngineLogInterface from './EngineLogInterface';
import { EngineContextInterface } from './index';

/**
 * The base Engine interface that is passed to plugins when there is no event, in places such as initialize
 */
export default interface EngineInterface extends EngineLogInterface {
    /**
     * Gets the engine context
     */
    getContext(): EngineContextInterface;

    /**
     * Gets the configuration accessor
     */
    getConfigurationAccessor(): ConfigurationAccessorInterface;
}
