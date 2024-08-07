"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeGallifreyEventType = IsTypeGallifreyEventType;
const BasicTypeGuards_1 = require("./BasicTypeGuards");
function IsTypeGallifreyEventType(value) {
    const t = value;
    return ((0, BasicTypeGuards_1.IsString)(t.entityName) &&
        (0, BasicTypeGuards_1.IsString)(t.eventName) &&
        (0, BasicTypeGuards_1.IsString)(t.eventId) &&
        (0, BasicTypeGuards_1.IsObject)(t.payload) &&
        (0, BasicTypeGuards_1.IsString)(t.source) &&
        (0, BasicTypeGuards_1.IsNumber)(t.eventLag));
}
