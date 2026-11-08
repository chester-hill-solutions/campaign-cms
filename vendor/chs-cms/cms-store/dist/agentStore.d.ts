import type { PageDocPayload } from '@chester-hill-solutions/cms-core';
import type { CmsStore } from './config.js';
export type CmsAgentStore = Pick<CmsStore<PageDocPayload>, 'listPageDocEntriesWithStatus' | 'getPageDocEditorState' | 'getContentEntryRow' | 'listRevisionsForEntry' | 'listMediaAssets' | 'isPageDocSlugTaken' | 'createPageDocEntry' | 'savePageDocDraft' | 'publishEntry' | 'restoreRevisionAsDraft' | 'uploadMediaAsset'>;
