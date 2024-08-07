"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__JournalLoggerInterface = void 0;
class __JournalLoggerInterface {
    customLog(description, extra) { }
    dataObjectPulledFromEventStore(name, request) { }
    endDoAction(name, response, duration, error) { }
    endEvent(duration, error) { }
    endPullDataObject(name, response, duration, error) { }
    endRunRule(name, duration, error) { }
    getModuleName() {
        return '';
    }
    startDoAction(name, payload) { }
    startEvent(event) { }
    startPullDataObject(name, request) { }
    startRunRule(name) { }
    endFilter(name, duration, error) { }
    startFilter(name) { }
    filterStoppedEvent(name, duration) { }
    endQueueAsyncAction(name, duration, error) { }
    startQueueAsyncAction(name, payload) { }
}
exports.__JournalLoggerInterface = __JournalLoggerInterface;
