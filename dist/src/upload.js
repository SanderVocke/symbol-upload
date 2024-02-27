"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSymbolFiles = void 0;
const js_api_client_1 = require("@bugsplat/js-api-client");
const glob_1 = require("glob");
const node_path_1 = require("node:path");
const workerpool_1 = require("workerpool");
const dsym_1 = require("./dsym");
const pdb_1 = require("./pdb");
const sym_1 = require("./sym");
const worker_1 = require("./worker");
const workerPool = workerpool_1.pool(node_path_1.join(__dirname, 'compression.js'));
async function uploadSymbolFiles(bugsplat, database, application, version, directory, filesGlob) {
    const globPattern = `${directory}/${filesGlob}`;
    const symbolFilePaths = await glob_1.glob(globPattern);
    if (!symbolFilePaths.length) {
        throw new Error(`Could not find any files to upload using glob ${globPattern}!`);
    }
    console.log(`Found files:\n ${symbolFilePaths.join('\n')}`);
    console.log(`About to upload symbols for ${database}-${application}-${version}...`);
    const symbolsApiClient = new js_api_client_1.SymbolsApiClient(bugsplat);
    const versionsApiClient = new js_api_client_1.VersionsApiClient(bugsplat);
    const symbolFiles = await Promise.all(symbolFilePaths.map(async (symbolFilePath) => await createSymbolFileInfos(directory, symbolFilePath))).then(array => array.flat());
    const workers = worker_1.createWorkersFromSymbolFiles(workerPool, symbolFiles, [symbolsApiClient, versionsApiClient]);
    const uploads = workers.map((worker) => worker.upload(database, application, version));
    await Promise.all(uploads);
    console.log('Symbols uploaded successfully!');
}
exports.uploadSymbolFiles = uploadSymbolFiles;
async function createSymbolFileInfos(searchDirectory, symbolFilePath) {
    const path = symbolFilePath;
    const relativePath = node_path_1.relative(searchDirectory, node_path_1.dirname(path));
    const extLowerCase = node_path_1.extname(path).toLowerCase();
    const isSymFile = extLowerCase.includes('.sym');
    const isPdbFile = extLowerCase.includes('.pdb');
    const isPeFile = extLowerCase.includes('.exe') || extLowerCase.includes('.dll');
    const isDsymFile = extLowerCase.includes('.dsym');
    if (isPdbFile) {
        const dbgId = await pdb_1.tryGetPdbGuid(path);
        const moduleName = node_path_1.basename(path);
        return [{
                path,
                dbgId,
                moduleName,
                relativePath
            }];
    }
    if (isPeFile) {
        const dbgId = await pdb_1.tryGetPeGuid(path);
        const moduleName = node_path_1.basename(path);
        return [{
                path,
                dbgId,
                moduleName,
                relativePath
            }];
    }
    if (isSymFile) {
        const { dbgId, moduleName } = await sym_1.getSymFileInfo(path);
        return [{
                path,
                dbgId,
                moduleName,
                relativePath
            }];
    }
    if (isDsymFile) {
        return dsym_1.getDSymFileInfos(path);
    }
    const dbgId = '';
    const moduleName = node_path_1.basename(path);
    return [{
            path,
            dbgId,
            moduleName,
            relativePath
        }];
}
//# sourceMappingURL=upload.js.map