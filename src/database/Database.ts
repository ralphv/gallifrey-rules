import { Pool, QueryResult } from 'pg';
import Config from '../lib/Config';
import { logger } from '../lib/logger';
import { scheduledEventsSchemas } from './ScheduledEventsDatabaseSchema';
import { TypeAssertNotNull } from '../lib/Utils';
import { TimeIt } from '../lib/Decorators';

export default class Database {
    private static pool: Pool | undefined;
    private initialized: boolean = false;

    constructor() {
        const config = new Config();
        if (!Database.pool) {
            Database.pool = new Pool({
                user: config.getDBUser(),
                host: config.getDBHost(),
                database: config.getDBName(),
                password: config.getDBPasswordSecret().getSecretValue(),
                port: config.getDBPort(),
            });
        }
    }

    static async closePool() {
        if (Database.pool) {
            await Database.pool.end();
            Database.pool = undefined;
        }
    }

    private async getClient() {
        return await TypeAssertNotNull(Database.pool).connect();
    }

    private async query(query: string, values: any[] = []): Promise<any[]> {
        const client = await this.getClient();
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return (await client.query(query, values)).rows;
        } finally {
            client.release();
        }
    }

    async initialize() {
        if (this.initialized) {
            return;
        }
        const schemas = { ...scheduledEventsSchemas };
        const client = await this.getClient();
        try {
            for (const [name, query] of Object.entries(schemas)) {
                // Check if tables exist
                const res: QueryResult = await client.query(`
                        SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          and table_name = '${name}'`);
                if (res.rows.length === 0) {
                    logger.debug(`Adding table ${name}`);
                    return client.query(query);
                }
            }
            this.initialized = true;
        } finally {
            client.release();
        }
    }

    @TimeIt
    async insertScheduledEvent(payload: ScheduledEventRecord) {
        await this.initialize();
        const client = await TypeAssertNotNull(Database.pool).connect();
        try {
            const insertQuery = `
                INSERT INTO scheduled_events_landing(createdAt, scheduledAt, triggeredBy_namespace, triggeredBy_entityName,
                                             triggeredBy_eventName, triggeredBy_eventID, triggeredBy_source,
                                             event_namespace, event_entityName, event_eventName, event_eventID,
                                             event_payload, scheduled_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING scheduled_event_id;`;

            const res = await client.query(insertQuery, [
                payload.createdAt,
                payload.scheduledAt ?? new Date(),
                payload.triggeredBy.namespace,
                payload.triggeredBy.entityName,
                payload.triggeredBy.eventName,
                payload.triggeredBy.eventID,
                payload.triggeredBy.source,
                payload.event.namespace,
                payload.event.entityName,
                payload.event.eventName,
                payload.event.eventID,
                JSON.stringify(payload.event.payload),
                payload.scheduledCount,
            ]);

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return res.rows[0].scheduled_event_id as number;
        } finally {
            client.release();
        }
    }
}

export interface ScheduledEventRecord {
    createdAt: Date;
    scheduledAt: Date | undefined;
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
