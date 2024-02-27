"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDSymFileInfos = void 0;
const macho_uuid_1 = require("macho-uuid");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const tmp_1 = require("./tmp");
async function getDSymFileInfos(path) {
    try {
        const machoFiles = await macho_uuid_1.createMachoFiles(path);
        if (!machoFiles.length) {
            throw new Error(`${path} is not a valid Mach-O file`);
        }
        return Promise.all(machoFiles.map(async (macho) => {
            const dbgId = await macho.getUUID();
            const moduleName = node_path_1.basename(macho.path);
            const relativePath = node_path_1.join(await macho.getUUID(), moduleName);
            const path = node_path_1.join(tmp_1.tmpDir, relativePath);
            await promises_1.mkdir(node_path_1.dirname(path), { recursive: true });
            await macho.writeFile(path);
            return {
                path,
                relativePath,
                dbgId,
                moduleName,
            };
        }));
    }
    catch {
        console.log(`Could not create macho files for ${path}, skipping...`);
        return [];
    }
}
exports.getDSymFileInfos = getDSymFileInfos;
function normalizeModuleName(moduleName) {
    return moduleName.split('.')[0];
}
//# sourceMappingURL=dsym.js.map