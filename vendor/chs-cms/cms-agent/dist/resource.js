/**
 * The input field that names the resource each tool acts on.
 *
 * Keyed by tool name, so a new tool with no selector is a type error rather than a silent
 * grant of the whole site. A field may be a dotted path into a nested object.
 */
const TOOL_RESOURCES = {
    list_pages: { kind: 'site' },
    get_page: { kind: 'entry', field: 'entryId' },
    get_block_types: { kind: 'site' },
    list_revisions: { kind: 'entry', field: 'entryId' },
    list_media: { kind: 'site' },
    check_slug: { kind: 'slug', field: 'slug' },
    create_page: { kind: 'slug', field: 'slug' },
    update_page_meta: { kind: 'entry', field: 'entryId' },
    add_block: { kind: 'entry', field: 'entryId' },
    update_block: { kind: 'entry', field: 'entryId' },
    remove_block: { kind: 'entry', field: 'entryId' },
    reorder_block: { kind: 'entry', field: 'entryId' },
    duplicate_block: { kind: 'entry', field: 'entryId' },
    upload_media: { kind: 'site' },
    restore_revision: { kind: 'entry', field: 'entryId' },
    publish_page: { kind: 'entry', field: 'entryId' },
    list_domain_entries: { kind: 'site' },
    get_domain_entry: { kind: 'entryOrSlug', entryField: 'entryId', slugField: 'slug' },
    list_domain_revisions: { kind: 'entry', field: 'entryId' },
    describe_domain_content: { kind: 'site' },
    save_domain_draft: { kind: 'entryOrSlug', entryField: 'entryId', slugField: 'create.slug' },
    publish_domain_entry: { kind: 'entry', field: 'entryId' },
    unpublish_domain_entry: { kind: 'entry', field: 'entryId' },
    restore_domain_revision: { kind: 'entry', field: 'entryId' },
};
/** Read a string at a dotted path, or undefined when any step is absent or not a string. */
function readId(input, path) {
    let current = input;
    for (const step of path.split('.')) {
        if (typeof current !== 'object' || current === null)
            return undefined;
        current = current[step];
    }
    return typeof current === 'string' && current.length > 0 ? current : undefined;
}
/**
 * Select the resource a tool call acts on from its parsed input.
 *
 * Called after Zod validation, so a valid input always carries the field. A missing one yields
 * `unknown` rather than `site`, because falling back to the wider scope would turn a malformed
 * call into an authorized one.
 */
export function selectToolResource(toolName, input) {
    const selector = TOOL_RESOURCES[toolName];
    if (selector.kind === 'site')
        return { kind: 'site' };
    if (selector.kind === 'entryOrSlug') {
        const entryId = readId(input, selector.entryField);
        if (entryId !== undefined)
            return { kind: 'entry', entryId };
        const slug = readId(input, selector.slugField);
        return slug !== undefined ? { kind: 'slug', slug } : { kind: 'unknown' };
    }
    const id = readId(input, selector.field);
    if (id === undefined)
        return { kind: 'unknown' };
    return selector.kind === 'entry'
        ? { kind: 'entry', entryId: id }
        : { kind: 'slug', slug: id };
}
