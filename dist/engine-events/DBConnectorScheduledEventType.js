"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeDBConnectorScheduledEventType = IsTypeDBConnectorScheduledEventType;
const BasicTypeGuards_1 = require("../BasicTypeGuards");
function IsTypeDBConnectorScheduledEventType(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return value !== null && value !== undefined && (0, BasicTypeGuards_1.IsObject)(value.payload) && (0, BasicTypeGuards_1.IsString)(value.payload.event_payload);
}
