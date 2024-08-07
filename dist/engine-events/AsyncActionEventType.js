"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeAsyncActionEventType = IsTypeAsyncActionEventType;
const BasicTypeGuards_1 = require("../BasicTypeGuards");
function IsTypeAsyncActionEventType(value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return (value !== null &&
        value !== undefined &&
        (0, BasicTypeGuards_1.IsString)(value.namespace) &&
        (0, BasicTypeGuards_1.IsString)(value.actionName) &&
        (0, BasicTypeGuards_1.IsString)(value.entityName) &&
        (0, BasicTypeGuards_1.IsString)(value.eventName) &&
        (0, BasicTypeGuards_1.IsString)(value.eventId) &&
        (0, BasicTypeGuards_1.IsObject)(value.payload));
}
