"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryGetPeGuid = exports.tryGetPdbGuid = void 0;
const pdb_guid_1 = require("pdb-guid");
async function tryGetPdbGuid(pdbFilePath) {
    try {
        const pdbFile = await pdb_guid_1.PdbFile.createFromFile(pdbFilePath);
        return `${pdbFile.guid}`;
    }
    catch (error) {
        console.log(`Could not get guid for ${pdbFilePath}...`);
    }
    return '';
}
exports.tryGetPdbGuid = tryGetPdbGuid;
async function tryGetPeGuid(peFilePath) {
    try {
        const pdbFile = await pdb_guid_1.PeFile.createFromFile(peFilePath);
        return `${pdbFile.guid}`;
    }
    catch (error) {
        console.log(`Could not get guid for ${peFilePath}...`);
    }
    return '';
}
exports.tryGetPeGuid = tryGetPeGuid;
//# sourceMappingURL=pdb.js.map