"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const Config_1 = __importDefault(require("../lib/Config"));
class PostgresDatabaseLocks {
    constructor() {
        const config = new Config_1.default();
        this.connectionConfig = {
            user: config.getDBUser(true),
            host: config.getDBHost(true),
            database: config.getDBName(true),
            password: config.getDBPasswordSecret(true).getSecretValue(),
            port: config.getDBPort(),
            keepAlive: true,
            idle_in_transaction_session_timeout: 0,
            connectionTimeoutMillis: 0,
        };
    }
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client(this.connectionConfig);
            yield client.connect();
            return client;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (PostgresDatabaseLocks.initialized) {
                return;
            }
            yield this.createAcquireLockFunction();
            PostgresDatabaseLocks.initialized = true;
        });
    }
    createAcquireLockFunction() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            try {
                yield client.query(`
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
            `);
            }
            finally {
                yield client.end();
            }
        });
    }
    acquireLock(lockKey, maxWaitMs) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.initialize();
            const client = yield this.getClient();
            try {
                const res = yield client.query('SELECT acquire_lock($1, $2) AS lock_acquired', [lockKey, maxWaitMs]); // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const lock_acquired = ((_a = res.rows[0]) === null || _a === void 0 ? void 0 : _a.lock_acquired) || false;
                if (!lock_acquired) {
                    yield client.end();
                    return {
                        acquired: false,
                        release: () => __awaiter(this, void 0, void 0, function* () { }),
                    };
                }
                else {
                    return {
                        acquired: true,
                        release: () => __awaiter(this, void 0, void 0, function* () {
                            yield client.query('SELECT pg_advisory_unlock(hashtext($1))', [lockKey]);
                            yield client.end();
                        }),
                    };
                }
            }
            catch (e) {
                yield client.end();
                throw e;
            }
        });
    }
}
PostgresDatabaseLocks.initialized = false;
exports.default = PostgresDatabaseLocks;
