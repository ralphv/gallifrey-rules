"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const json_schema_library_1 = require("json-schema-library");
const EngineCriticalError_1 = __importDefault(require("../errors/EngineCriticalError"));
const fs = __importStar(require("fs"));
class JsonSchemaTester {
    loadAndTest(schemaFile, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonSchema = yield this.getSchemaDraft(schemaFile);
            const errors = jsonSchema.validate(payload);
            if (errors.length !== 0) {
                throw new EngineCriticalError_1.default(`Payload does not match defined schema: ${JSON.stringify(errors, null, 2)}`);
            }
        });
    }
    getSchemaDraft(schemaFile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (schemaFile in JsonSchemaTester.cache) {
                return JsonSchemaTester.cache[schemaFile];
            }
            let fileContents;
            try {
                const buffer = yield fs.promises.readFile(schemaFile);
                fileContents = JSON.parse(buffer.toString());
            }
            catch (e) {
                throw new EngineCriticalError_1.default(`Failed to load json schema file: ${schemaFile}: ${String(e)}`);
            }
            JsonSchemaTester.cache[schemaFile] = new json_schema_library_1.Draft07(fileContents);
            return JsonSchemaTester.cache[schemaFile];
        });
    }
}
JsonSchemaTester.cache = {};
exports.default = JsonSchemaTester;
