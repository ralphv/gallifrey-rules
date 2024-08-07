/**
 * author: Ralph Varjabedian
 */
import EngineEventContextInterface from '../engine-interfaces/EngineEventContextInterface';

/**
 * Whether this plugin is enabled
 */
export default interface EnabledInterface {
    /**
     * If this is enabled or not for this event
     * @param context
     */
    isEnabled?(context: EngineEventContextInterface): Promise<boolean>;
}
