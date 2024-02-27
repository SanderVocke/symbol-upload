import { ApiClient } from "@bugsplat/js-api-client";
export declare function uploadSymbolFiles(bugsplat: ApiClient, database: string, application: string, version: string, directory: string, filesGlob: string): Promise<void>;
