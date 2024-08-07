"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
const logger_1 = require("../lib/logger");
const ScheduledEventsDatabaseSchema_1 = require("./ScheduledEventsDatabaseSchema");
const Utils_1 = require("../lib/Utils");
const Decorators_1 = require("../lib/Decorators");
let Database = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _insertScheduledEvent_decorators;
    return _a = class Database {
            constructor() {
                this.initialized = (__runInitializers(this, _instanceExtraInitializers), false);
                const config = new Config_1.default();
                if (!_a.pool) {
                    _a.pool = new pg_1.Pool({
                        user: config.getDBUser(),
                        host: config.getDBHost(),
                        database: config.getDBName(),
                        password: config.getDBPasswordSecret().getSecretValue(),
                        port: config.getDBPort(),
                    });
                }
            }
            static closePool() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (_a.pool) {
                        yield _a.pool.end();
                        _a.pool = undefined;
                    }
                });
            }
            getClient() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield (0, Utils_1.TypeAssertNotNull)(_a.pool).connect();
                });
            }
            query(query_1) {
                return __awaiter(this, arguments, void 0, function* (query, values = []) {
                    const client = yield this.getClient();
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return (yield client.query(query, values)).rows;
                    }
                    finally {
                        client.release();
                    }
                });
            }
            initialize() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.initialized) {
                        return;
                    }
                    const schemas = Object.assign({}, ScheduledEventsDatabaseSchema_1.scheduledEventsSchemas);
                    const client = yield this.getClient();
                    try {
                        for (const [name, query] of Object.entries(schemas)) {
                            // Check if tables exist
                            const res = yield client.query(`
                        SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = 'public'
                          and table_name = '${name}'`);
                            if (res.rows.length === 0) {
                                logger_1.logger.debug(`Adding table ${name}`);
                                return client.query(query);
                            }
                        }
                        this.initialized = true;
                    }
                    finally {
                        client.release();
                    }
                });
            }
            insertScheduledEvent(payload) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.initialize();
                    const client = yield (0, Utils_1.TypeAssertNotNull)(_a.pool).connect();
                    try {
                        const insertQuery = `
                INSERT INTO scheduled_events_landing(createdAt, scheduledAt, triggeredBy_namespace, triggeredBy_entityName,
                                             triggeredBy_eventName, triggeredBy_eventID, triggeredBy_source,
                                             event_namespace, event_entityName, event_eventName, event_eventID,
                                             event_payload, scheduled_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING scheduled_event_id;`;
                        const res = yield client.query(insertQuery, [
                            payload.createdAt,
                            payload.scheduledAt,
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
                        return res.rows[0].scheduled_event_id;
                    }
                    finally {
                        client.release();
                    }
                });
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _insertScheduledEvent_decorators = [Decorators_1.TimeIt];
            __esDecorate(_a, null, _insertScheduledEvent_decorators, { kind: "method", name: "insertScheduledEvent", static: false, private: false, access: { has: obj => "insertScheduledEvent" in obj, get: obj => obj.insertScheduledEvent }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = Database;
