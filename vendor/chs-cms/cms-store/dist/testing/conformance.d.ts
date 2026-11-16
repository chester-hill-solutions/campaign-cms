import { type PageDocPayload } from '@chester-hill-solutions/cms-core';
import type { CmsStoreConfig } from '../config.js';
import type { createCmsStore } from '../createCmsStore.js';
export declare const conformanceTestConfig: CmsStoreConfig<PageDocPayload>;
type PageDocStore = ReturnType<typeof createCmsStore<PageDocPayload>>;
/** Shared create → draft → publish → restore → upload media flow for adapter tests. */
export declare function runCmsStoreConformance(store: PageDocStore): Promise<void>;
/**
 * Taxonomy + forms + analytics flow covering the ports added after the core
 * content surface. Run alongside `runCmsStoreConformance` for full coverage.
 */
export declare function runCmsStoreExtendedConformance(store: PageDocStore): Promise<void>;
/** Published URLs and sitemap candidates must only observe the selected revision. */
export declare function runCmsPublicationConformance(store: PageDocStore): Promise<void>;
/** Different entry rows must not concurrently claim one immutable public URL. */
export declare function runCmsPublicationRaceConformance(store: PageDocStore): Promise<void>;
/** Page content and all entry-specific listing values share one immutable revision. */
export declare function runCmsListingSnapshotConformance(store: PageDocStore): Promise<void>;
export {};
