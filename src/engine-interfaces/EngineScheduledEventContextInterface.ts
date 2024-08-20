export default interface EngineScheduledEventContextInterface {
    /**
     * Created At
     */
    createdAt: Date;
    /**
     * Scheduled At
     */
    scheduledAt: Date;

    /**
     * Triggered By Event information
     */
    triggeredBy: {
        namespace: string;
        entityName: string;
        eventName: string;
        eventID: string;
        source: string;
    };

    /**
     * The number of times the event was scheduled
     */
    scheduledCount: number;
}
