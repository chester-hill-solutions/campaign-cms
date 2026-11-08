import type { CmsAgentConfig } from '../types.js';
import { type CmsAgentTool } from './makeTool.js';
/**
 * Tools for typed domain content — a tour, a stop, a business, a notice.
 *
 * Registered only when the host supplies a domain store, so a site that publishes
 * pages and nothing else does not expose tools that would fail on every call. The
 * split mirrors the store: the page tools above need `CmsAgentStore`, these need
 * `CmsDomainStore`.
 */
export declare function createDomainTools(config: CmsAgentConfig): CmsAgentTool[];
