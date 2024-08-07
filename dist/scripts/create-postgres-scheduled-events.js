"use strict";
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
const Database_1 = __importDefault(require("../database/Database"));
const commands_1 = require("./commands");
const GallifreyRulesEngine_1 = require("../GallifreyRulesEngine");
void (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        new GallifreyRulesEngine_1.GallifreyRulesEngine();
        if (!(0, commands_1.validateCommand)(`create-postgres-scheduled-events`)) {
            return;
        }
        console.log(`Initializing postgres database tables`);
        const database = new Database_1.default();
        yield database.initialize();
        console.log(`Done!`);
    }
    catch (e) {
        console.trace(`Error: ${String(e)}`);
    }
}))();
