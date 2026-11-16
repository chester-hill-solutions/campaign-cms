import type { D1Executor } from './d1-executor.js';
import type { CmsPersistence } from '@chester-hill-solutions/cms-store';
export declare function createD1Persistence(getDb: () => D1Executor): CmsPersistence;
