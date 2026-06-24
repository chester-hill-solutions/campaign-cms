import { type ContentEntryRow, type EntryEditorState, type PageDocPayload } from '@chester-hill-solutions/cms-core';
import type { CmsAgentConfig, CmsAgentStore, PageMeta } from './types';
export declare function makePageMeta(overrides?: Partial<PageMeta>): PageMeta;
export declare function makeEntryRow(overrides?: Partial<ContentEntryRow>): ContentEntryRow;
export declare function makeEditorState(content?: PageMeta, entry?: ContentEntryRow): EntryEditorState<PageDocPayload>;
export declare function makeStore(overrides?: Partial<CmsAgentStore>): CmsAgentStore;
export declare function makeConfig(overrides?: Partial<CmsAgentConfig>): CmsAgentConfig;
