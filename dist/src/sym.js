"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSymFileInfo = void 0;
const firstline_1 = __importDefault(require("firstline"));
async function getSymFileInfo(path) {
    try {
        const firstLine = await firstline_1.default(path);
        const matches = Array.from(firstLine?.matchAll(/([0-9a-fA-F]{33,34})\s+(.*)$/gm));
        const dbgId = matches?.at(0)?.at(1) || '';
        const moduleName = matches?.at(0)?.at(2) || '';
        return {
            dbgId,
            moduleName
        };
    }
    catch {
        console.log(`Could not get first line for ${path}, skipping...`);
        return {
            dbgId: '',
            moduleName: ''
        };
    }
}
exports.getSymFileInfo = getSymFileInfo;
//# sourceMappingURL=sym.js.map