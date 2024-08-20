import EngineEventContextInterface from './EngineEventContextInterface';
import EngineInterface from './EngineInterface';

/**
 * The base EngineEvent interface that is passed to plugins when there is an event
 */
export default interface EngineEventInterface extends EngineInterface {
    /**
     * Gets the event context
     */
    getEventContext(): EngineEventContextInterface;
}
