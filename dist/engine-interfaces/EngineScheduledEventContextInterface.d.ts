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
    scheduledCount: number;
}
