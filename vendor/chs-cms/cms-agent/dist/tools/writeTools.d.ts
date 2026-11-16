import type { CmsAgentConfig, CmsAgentStore } from '../types.js';
import { type CmsAgentTool } from './makeTool.js';
export declare function createWriteTools(store: CmsAgentStore, config: CmsAgentConfig): CmsAgentTool[];
