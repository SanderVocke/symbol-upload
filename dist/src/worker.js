"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadWorker = exports.createWorkersFromSymbolFiles = void 0;
const fs_1 = require("fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const promise_retry_1 = __importDefault(require("promise-retry"));
const workerpool_1 = require("workerpool");
const tmp_1 = require("./tmp");
const workerCount = workerpool_1.cpus;
function createWorkersFromSymbolFiles(workerPool, symbolFiles, clients) {
    const numberOfSymbols = symbolFiles.length;
    if (workerCount >= numberOfSymbols) {
        return symbolFiles.map((symbolFile, i) => new UploadWorker(i + 1, [symbolFile], workerPool, ...clients));
    }
    const symbolFilesChunks = splitToChunks(symbolFiles, workerCount);
    return symbolFilesChunks.map((chunk, i) => new UploadWorker(i + 1, chunk, workerPool, ...clients));
}
exports.createWorkersFromSymbolFiles = createWorkersFromSymbolFiles;
class UploadWorker {
    constructor(id, symbolFileInfos, pool, symbolsClient, versionsClient) {
        this.id = id;
        this.symbolFileInfos = symbolFileInfos;
        this.pool = pool;
        this.symbolsClient = symbolsClient;
        this.versionsClient = versionsClient;
        this.createReadStream = fs_1.createReadStream;
        this.retryPromise = promise_retry_1.default;
        this.stat = promises_1.stat;
        this.toWeb = fs_1.ReadStream.toWeb;
    }
    async upload(database, application, version) {
        console.log(`Worker ${this.id} uploading ${this.symbolFileInfos.length} symbol files...`);
        await Promise.all(this.symbolFileInfos.map((symbolFileInfo) => this.uploadSingle(database, application, version, symbolFileInfo)));
    }
    async uploadSingle(database, application, version, symbolFileInfo) {
        let { path, relativePath } = symbolFileInfo;
        const { dbgId, moduleName } = symbolFileInfo;
        const folderPrefix = relativePath.replace(/\\/g, '-');
        const fileName = folderPrefix ? [folderPrefix, node_path_1.basename(path)].join('-') : node_path_1.basename(path);
        const uncompressedSize = await this.stat(path).then(stats => stats.size);
        const timestamp = Math.round(new Date().getTime() / 1000);
        const isZip = node_path_1.extname(path).toLowerCase().includes('.zip');
        let client = this.versionsClient;
        let name = node_path_1.basename(path);
        let tmpFileName = '';
        if (dbgId && !isZip) {
            tmpFileName = node_path_1.join(tmp_1.tmpDir, `${fileName}.gz`);
            let tmpSubdir = node_path_1.join(tmp_1.tmpDir, node_path_1.dirname(fileName));
            if (!fs_1.existsSync(tmpSubdir)) {
                fs_1.mkdirSync(tmpSubdir, { recursive: true });
            }
            client = this.symbolsClient;
            await this.pool.exec('createGzipFile', [path, tmpFileName]);
        }
        else if (!isZip) {
            name = `${name}.zip`;
            tmpFileName = node_path_1.join(tmp_1.tmpDir, `${fileName}-${timestamp}.zip`);
            await this.pool.exec('createZipFile', [path, tmpFileName]);
        }
        else {
            tmpFileName = path;
        }
        const stats = await this.stat(tmpFileName);
        const lastModified = stats.mtime;
        const size = stats.size;
        const symFileReadStream = this.createReadStream(tmpFileName);
        const file = this.toWeb(symFileReadStream);
        const symbolFile = {
            name,
            size,
            file,
            uncompressedSize,
            dbgId,
            lastModified,
            moduleName
        };
        console.log(`Worker ${this.id} uploading ${name}...`);
        await this.retryPromise((retry) => client.postSymbols(database, application, version, [symbolFile])
            .catch((error) => {
            symFileReadStream.destroy();
            console.error(`Worker ${this.id} failed to upload ${name} with error: ${error.message}! Retrying...`);
            retry(error);
        }));
        console.log(`Worker ${this.id} uploaded ${name}!`);
    }
}
exports.UploadWorker = UploadWorker;
function splitToChunks(array, parts) {
    const copy = [...array];
    const result = [];
    for (let i = parts; i > 0; i--) {
        result.push(copy.splice(0, Math.ceil(array.length / parts)));
    }
    return result;
}
//# sourceMappingURL=worker.js.map