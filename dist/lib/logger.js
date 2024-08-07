"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = __importDefault(require("log4js"));
const Config_1 = __importDefault(require("./Config"));
const config = new Config_1.default();
const l = log4js_1.default.getLogger(`gallifrey-rules`);
l.level = config.getLogLevel();
exports.logger = l;
