"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__ScheduledEventsInterface = void 0;
class __ScheduledEventsInterface {
    getModuleName() {
        return '';
    }
    insertScheduledEvent(event, triggeredBy, scheduleAt, scheduledCount) {
        return Promise.reject('un-callable code');
    }
}
exports.__ScheduledEventsInterface = __ScheduledEventsInterface;
