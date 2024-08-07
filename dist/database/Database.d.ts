import { QueryResult } from 'pg';
export default class Database {
    private static pool;
    private initialized;
    constructor();
    static closePool(): Promise<void>;
    private getClient;
    private query;
    initialize(): Promise<QueryResult<any> | undefined>;
    insertScheduledEvent(payload: ScheduledEventRecord): Promise<number>;
}
export interface ScheduledEventRecord {
    createdAt: Date;
    scheduledAt: Date;
    triggeredBy: {
        namespace: string;
        entityName: string;
        eventName: string;
        eventID: string;
        source: string;
    };
    event: {
        namespace: string;
        entityName: string;
        eventName: string;
        eventID: string;
        payload: any;
    };
    scheduledCount: number;
}
