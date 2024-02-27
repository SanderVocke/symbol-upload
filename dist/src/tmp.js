"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeRemoveTmp = exports.tmpDir = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const promise_retry_1 = __importDefault(require("promise-retry"));
const currentDirectory = process ? process.cwd() : __dirname;
exports.tmpDir = path_1.join(currentDirectory, 'tmp');
async function safeRemoveTmp(remover = promises_1.rm) {
    try {
        await promise_retry_1.default((retry) => remover(exports.tmpDir, { recursive: true, force: true }).catch(retry), {
            minTimeout: 0,
            maxTimeout: 2000,
            factor: 2,
            retries: 4, // Try 4 times
        });
    }
    catch (error) {
        console.error(`Could not delete ${exports.tmpDir}!`, error);
    }
}
exports.safeRemoveTmp = safeRemoveTmp;
//# sourceMappingURL=tmp.js.map