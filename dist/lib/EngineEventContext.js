"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineEventContext = void 0;
const logger_1 = require("./logger");
const Utils_1 = require("./Utils");
class EngineEventContext {
    constructor(namespace, entityName, eventName, eventID, source) {
        this.namespace = namespace;
        this.entityName = entityName;
        this.eventName = eventName;
        this.eventID = eventID;
        this.source = source;
        this.eventStore = {};
    }
    getEntityName() {
        return this.entityName;
    }
    getEventID() {
        return this.eventID;
    }
    getEventName() {
        return this.eventName;
    }
    getNamespace() {
        return this.namespace;
    }
    getJournalLogger() {
        return (0, Utils_1.AssertNotNull)(this.journalLogger);
    }
    setJournalLogger(journalLogger) {
        this.journalLogger = journalLogger;
    }
    addToEventStore(key, value) {
        if (this.isInEventStore(key)) {
            logger_1.logger.warn(`Key already exists in eventStore: ${key}`);
        }
        this.eventStore[key] = value;
    }
    isInEventStore(key) {
        if (!key) {
            return false;
        }
        return key in this.eventStore;
    }
    getFromEventStore(key) {
        return this.eventStore[key];
    }
    setScheduledEvent(scheduledEvent) {
        this.scheduledEvent = scheduledEvent;
    }
    getScheduledEvent() {
        return this.scheduledEvent;
    }
    getSource() {
        return this.source;
    }
}
exports.EngineEventContext = EngineEventContext;
