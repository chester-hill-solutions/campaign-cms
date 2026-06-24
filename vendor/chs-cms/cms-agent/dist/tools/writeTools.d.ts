import type { CmsAgentConfig, CmsAgentStore } from '../types';
import { type CmsAgentTool } from './makeTool';
export declare function createWriteTools(store: CmsAgentStore, config: CmsAgentConfig): CmsAgentTool[];
