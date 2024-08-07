export default interface EngineScheduledEventContextInterface {
    createdAt: Date;
    scheduledAt: Date;
    triggeredBy: {
        namespace: string;
        entityName: string;
        eventName: string;
        eventID: string;
        source: string;
    };
    scheduledCount: number; // engine knows that the event was a scheduled one or not, and so can increase this number
}
