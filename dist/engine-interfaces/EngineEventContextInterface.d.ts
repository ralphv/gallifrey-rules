/**
 * author: Ralph Varjabedian
 */
import EngineContextInterface from './EngineContextInterface';
/**
 * Answers basic questions about the context of the current event and data related to it
 */
export default interface EngineEventContextInterface extends EngineContextInterface {
    /**
     * Gets the namespace the event was triggered on
     */
    getNamespace(): string;
    /**
     * Gets the entity name that the event was triggered on
     */
    getEntityName(): string;
    /**
     * Gets the event name
     */
    getEventName(): string;
    /**
     * Gets the event id
     */
    getEventID(): string;
    /**
     * Source of event
     */
    getSource(): string;
}
