/// <reference types="node" />
import { rm } from 'fs/promises';
export declare const tmpDir: string;
export declare function safeRemoveTmp(remover?: typeof rm): Promise<void>;
