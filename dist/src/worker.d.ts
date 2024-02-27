import { SymbolsApiClient, VersionsApiClient } from '@bugsplat/js-api-client';
import { WorkerPool } from 'workerpool';
import { SymbolFileInfo } from './info';
export declare function createWorkersFromSymbolFiles(workerPool: WorkerPool, symbolFiles: SymbolFileInfo[], clients: [SymbolsApiClient, VersionsApiClient]): Array<UploadWorker>;
export declare class UploadWorker {
    readonly id: number;
    readonly symbolFileInfos: SymbolFileInfo[];
    private readonly pool;
    private readonly symbolsClient;
    private readonly versionsClient;
    private createReadStream;
    private retryPromise;
    private stat;
    private toWeb;
    constructor(id: number, symbolFileInfos: SymbolFileInfo[], pool: WorkerPool, symbolsClient: SymbolsApiClient, versionsClient: VersionsApiClient);
    upload(database: string, application: string, version: string): Promise<void>;
    private uploadSingle;
}
