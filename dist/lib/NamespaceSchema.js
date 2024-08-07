"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTypeNamespaceSchemaConsumer = IsTypeNamespaceSchemaConsumer;
const BasicTypeGuards_1 = require("../BasicTypeGuards");
function IsTypeNamespaceSchemaConsumer(value) {
    return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (0, BasicTypeGuards_1.IsString)(value.name) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsString)(value.type) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsObject)(value.config) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, BasicTypeGuards_1.IsString)(value.eventDispatcher, true) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        ['kafka', 'kafka:scheduled-events', 'kafka:async-actions'].includes(value.type));
}
