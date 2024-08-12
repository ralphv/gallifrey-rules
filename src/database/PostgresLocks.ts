import { Pool } from 'pg';
import Config from '../lib/Config';
import { TypeAssertNotNull } from '../lib/Utils';

export default class PostgresLocks {
    private static pool: Pool | undefined;
    private static initialized: boolean = false;

    constructor() {
        const config = new Config();
        if (!PostgresLocks.pool) {
            PostgresLocks.pool = new Pool({
                user: config.getDBUser(),
                host: config.getDBHost(),
                database: config.getDBName(),
                password: config.getDBPasswordSecret().getSecretValue(),
                port: config.getDBPort(),
            });
        }
    }

    static async closePool() {
        if (PostgresLocks.pool) {
            await PostgresLocks.pool.end();
            PostgresLocks.pool = undefined;
        }
    }

    private async getClient() {
        return await TypeAssertNotNull(PostgresLocks.pool).connect();
    }

    private async createAcquireLockFunction(): Promise<void> {
        const client = await this.getClient();

        try {
            await client.query(
                `
CREATE OR REPLACE FUNCTION acquire_lock(lock_key VARCHAR, max_wait_ms INT) RETURNS BOOLEAN AS $$
DECLARE
    lock_acquired BOOLEAN := FALSE;
    sleep_interval INT := 100;  -- Sleep interval in milliseconds
    elapsed_time INT := 0;      -- Track the elapsed time
    lock_id BIGINT;
BEGIN
    SELECT hashtext(lock_key) INTO lock_id;
    LOOP
        SELECT pg_try_advisory_lock(lock_id) INTO lock_acquired;
        IF lock_acquired THEN
            RETURN TRUE;  -- Lock acquired, exit the function
        END IF;
        
        PERFORM pg_sleep(sleep_interval / 1000.0);
        elapsed_time := elapsed_time + sleep_interval;
        
        IF elapsed_time >= max_wait_ms THEN
            RETURN FALSE;  -- Return FALSE if the maximum wait time is reached
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
            `,
            );
        } finally {
            client.release();
        }
    }

    public async acquireLock(
        lockKey: string,
        maxWaitMs: number,
    ): Promise<{
        acquired: boolean;
        release: () => Promise<void>;
    }> {
        await this.initialize();
        const client = await this.getClient();

        try {
            const res = await client.query('SELECT acquire_lock($1, $2) AS lock_acquired', [lockKey, maxWaitMs]); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const lock_acquired = res.rows[0]?.lock_acquired || false;
            if (!lock_acquired) {
                client.release();
                return {
                    acquired: false,
                    release: async () => {},
                };
            } else {
                return {
                    acquired: true,
                    release: async () => {
                        await client.query('SELECT pg_advisory_unlock(hashtext($1))', [lockKey]);
                        client.release();
                    },
                };
            }
        } catch (e) {
            client.release();
            throw e;
        }
    }

    async initialize() {
        if (PostgresLocks.initialized) {
            return;
        }
        await this.createAcquireLockFunction();
        PostgresLocks.initialized = true;
    }
}
