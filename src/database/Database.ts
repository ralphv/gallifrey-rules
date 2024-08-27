/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Pool, QueryResult } from 'pg';
import Config from '../lib/Config';
import { logger } from '../lib/logger';
import { scheduledEventsSchemas } from './ScheduledEventsDatabaseSchema';
import { TypeAssertNotNull } from '../lib/Utils';
import { TimeIt } from '../lib/Decorators';
import { ScheduledEventQuery, ScheduledEventResponse } from '../interfaces/Providers/ScheduledEventsInterface';

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
                INSERT INTO scheduled_events_landing(createdAt, scheduledAt, triggeredBy_namespace,
                                                     triggeredBy_entityName,
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

    async deleteScheduledEvent(scheduledEventID: string) {
        await this.initialize();
        const client = await TypeAssertNotNull(Database.pool).connect();
        try {
            const query = `DELETE
                           FROM scheduled_events_landing
                           where scheduled_event_id = $1`;
            const res = await client.query(query, [scheduledEventID]);
            return res.rowCount !== 0;
        } finally {
            client.release();
        }
    }

    async getScheduledEvent(scheduledEventID: string) {
        await this.initialize();
        const client = await TypeAssertNotNull(Database.pool).connect();
        try {
            const query = `
                SELECT event_entityName   as "entityName",
                       event_eventid      as "eventID",
                       event_eventname    as "eventName",
                       event_namespace    as "namespace",
                       event_payload      as "payload",
                       scheduled_event_id as "scheduledEventID"
                FROM scheduled_events_landing
                where scheduled_event_id = $1`;
            const res = await client.query(query, [scheduledEventID]);
            if (res.rowCount !== 1) {
                return undefined;
            }
            return {
                ...res.rows[0],
                payload: JSON.parse(res.rows[0].payload),
            } as ScheduledEventResponse;
        } finally {
            client.release();
        }
    }

    async queryScheduledEvents(query: ScheduledEventQuery) {
        await this.initialize();
        const client = await TypeAssertNotNull(Database.pool).connect();
        try {
            const sql = `
                SELECT event_entityName   as "entityName",
                       event_eventid      as "eventID",
                       event_eventname    as "eventName",
                       event_namespace    as "namespace",
                       event_payload      as "payload",
                       scheduled_event_id as "scheduledEventID"
                FROM scheduled_events_landing
                where event_namespace = $1
                  AND event_entityname = $2
                  AND event_eventname = $3
                  AND event_eventid = $4`;
            const res = await client.query(sql, [query.namespace, query.entityName, query.eventName, query.eventID]);
            return res.rows.map(
                (row) =>
                    ({
                        ...row,
                        payload: JSON.parse(row.payload),
                    }) as ScheduledEventResponse,
            );
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
