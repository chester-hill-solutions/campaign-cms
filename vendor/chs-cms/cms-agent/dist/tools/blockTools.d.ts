import type { CmsAgentConfig, CmsAgentStore } from '../types';
import { type CmsAgentTool } from './makeTool';
export declare function createBlockTools(store: CmsAgentStore, config: CmsAgentConfig): CmsAgentTool[];
