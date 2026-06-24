import { APP_BLOCK_TYPES, BLOCK_TYPE_LABELS, LAYOUT_BLOCK_TYPES, pageBlockSchema, } from '@chester-hill-solutions/cms-core';
import { notFound } from '../errors';
import { checkSlugInput, getBlockTypesInput, getPageInput, listMediaInput, listPagesInput, listRevisionsInput, } from '../schemas';
import { makeTool } from './makeTool';
/** Shared base fields present on every block; not listed per type. */
const BLOCK_BASE_FIELDS = new Set(['id', 'type', 'layout']);
const LAYOUT_TYPE_SET = new Set(LAYOUT_BLOCK_TYPES);
const APP_TYPE_SET = new Set(APP_BLOCK_TYPES);
/** Field metadata derived from the Zod schemas — never hand-maintained. */
function describeBlockTypes() {
    return pageBlockSchema.options.map((option) => {
        const type = option.shape.type.value;
        const fields = Object.entries(option.shape)
            .filter(([name]) => !BLOCK_BASE_FIELDS.has(name))
            .map(([name, schema]) => ({
            name,
            required: !schema.safeParse(undefined).success,
        }));
        const category = LAYOUT_TYPE_SET.has(type)
            ? 'layout'
            : APP_TYPE_SET.has(type)
                ? 'app'
                : 'content';
        return { type, label: BLOCK_TYPE_LABELS[type], category, fields };
    });
}
/** Compact per-block summary used by get_page view:'summary'. */
function summarizeBlock(block) {
    const probe = block;
    const candidate = probe.heading ?? probe.headline ?? probe.title ?? probe.text ?? probe.markdown;
    const summary = typeof candidate === 'string' && candidate.length > 0
        ? candidate.slice(0, 80)
        : null;
    return { id: block.id, type: block.type, summary };
}
export function createReadTools(store, config) {
    return [
        makeTool({
            name: 'list_pages',
            description: 'List all CMS pages with entry id, slug, title, and publish status.',
            inputSchema: listPagesInput,
            mutates: false,
            config,
            handler: async () => ({
                ok: true,
                data: await store.listPageDocEntriesWithStatus(),
            }),
        }),
        makeTool({
            name: 'get_page',
            description: 'Get a page by entry id. view: "draft", "published", "both" (default), or "summary" (meta plus a compact block list — use for large pages).',
            inputSchema: getPageInput,
            mutates: false,
            config,
            handler: async ({ entryId, view }) => {
                const state = await store.getPageDocEditorState(entryId);
                if (!state) {
                    return notFound(`Entry "${entryId}"`, 'Call list_pages for valid ids.');
                }
                const { entry, meta, draft, published } = state;
                if (view === 'summary') {
                    const base = draft ?? published;
                    return {
                        ok: true,
                        data: {
                            entry,
                            meta,
                            blocks: base ? base.blocks.map(summarizeBlock) : [],
                        },
                    };
                }
                return {
                    ok: true,
                    data: {
                        entry,
                        meta,
                        ...(view !== 'published' ? { draft } : {}),
                        ...(view !== 'draft' ? { published } : {}),
                    },
                };
            },
        }),
        makeTool({
            name: 'get_block_types',
            description: 'List every block type with its category, label, and editable fields (derived from the schemas). All blocks also share id, type, and layout (width/background/spacing/align). Call this before add_block or update_block.',
            inputSchema: getBlockTypesInput,
            mutates: false,
            config,
            handler: async () => ({ ok: true, data: { types: describeBlockTypes() } }),
        }),
        makeTool({
            name: 'list_revisions',
            description: 'List the revision history (id, version, created_at, message) for an entry, newest first.',
            inputSchema: listRevisionsInput,
            mutates: false,
            config,
            handler: async ({ entryId }) => {
                const entry = await store.getContentEntryRow(entryId);
                if (!entry) {
                    return notFound(`Entry "${entryId}"`, 'Call list_pages for valid ids.');
                }
                return { ok: true, data: await store.listRevisionsForEntry(entryId) };
            },
        }),
        makeTool({
            name: 'list_media',
            description: 'List uploaded media assets (newest first). Use the returned r2_key as /media/{r2_key} in image block src fields.',
            inputSchema: listMediaInput,
            mutates: false,
            config,
            handler: async ({ limit }) => ({
                ok: true,
                data: await store.listMediaAssets(limit),
            }),
        }),
        makeTool({
            name: 'check_slug',
            description: 'Check whether a slug is valid and available for a new page before calling create_page.',
            inputSchema: checkSlugInput,
            mutates: false,
            config,
            handler: async ({ slug, excludeEntryId }) => {
                const reason = config.validateNewPageSlug(slug);
                if (reason) {
                    return { ok: true, data: { available: false, reason } };
                }
                const taken = await store.isPageDocSlugTaken(slug, excludeEntryId);
                if (taken) {
                    return {
                        ok: true,
                        data: { available: false, reason: 'Slug is already in use.' },
                    };
                }
                return { ok: true, data: { available: true } };
            },
        }),
    ];
}
// Exported for tests asserting parity with ALL_BLOCK_TYPES.
export { describeBlockTypes };
