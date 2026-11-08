import { emptyEntryListingSnapshot, entryListingSnapshotSchema, } from '@chester-hill-solutions/cms-core';
/** A listing selection/value the editor can correct without losing local changes. */
export class CmsListingValidationError extends Error {
    constructor(message) { super(message); this.name = 'CmsListingValidationError'; }
}
export function parseEntryListingSnapshot(raw) {
    try {
        const parsed = entryListingSnapshotSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
    }
    catch {
        return null;
    }
}
/** Resolve changed selections against the catalog; unchanged historical labels remain frozen. */
export async function resolveEntryListingSnapshot(db, input, previous = emptyEntryListingSnapshot()) {
    const parsed = entryListingSnapshotSchema.safeParse(input);
    if (!parsed.success)
        throw new CmsListingValidationError(parsed.error.issues[0]?.message ?? 'Invalid listing snapshot');
    const snapshot = parsed.data;
    for (const assignment of snapshot.collections) {
        const before = previous.collections.find(row => row.collectionId === assignment.collectionId);
        if (before)
            assignment.collectionLabel = before.collectionLabel;
        else {
            const collection = await db.getCollection(assignment.collectionId);
            if (!collection)
                throw new CmsListingValidationError('Collection not found');
            assignment.collectionLabel = collection.label;
        }
        if (assignment.category) {
            if (before?.category?.id === assignment.category.id)
                assignment.category = before.category;
            else {
                const category = await db.getCollectionCategory(assignment.category.id);
                if (!category || category.collection_id !== assignment.collectionId)
                    throw new CmsListingValidationError('Category does not belong to this collection');
                assignment.category = { id: category.id, label: category.label, slug: category.slug };
            }
        }
        await validateMetadata(db, assignment, false);
    }
    for (let index = 0; index < snapshot.tags.length; index++) {
        const tag = snapshot.tags[index];
        const before = previous.tags.find(row => row.id === tag.id);
        if (before)
            snapshot.tags[index] = before;
        else {
            const row = await db.getTag(tag.id);
            if (!row)
                throw new CmsListingValidationError('Tag not found');
            snapshot.tags[index] = { id: row.id, label: row.label, slug: row.slug,
                ...(row.description == null ? {} : { description: row.description }) };
        }
    }
    return snapshot;
}
async function validateMetadata(db, assignment, required) {
    const fields = await db.listCollectionFields(assignment.collectionId);
    for (const field of fields) {
        const value = assignment.metadata[field.key];
        if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
            if (required && field.required === 1)
                throw new CmsListingValidationError(`${field.label} is required`);
            continue;
        }
        let valid;
        switch (field.type) {
            case 'boolean':
                valid = typeof value === 'boolean';
                break;
            case 'stringList':
                valid = Array.isArray(value) && value.every(item => typeof item === 'string');
                break;
            case 'text':
            case 'url':
            case 'date':
            case 'image':
                valid = typeof value === 'string';
                break;
            default: throw new Error(`Unsupported metadata field type: ${field.type}`);
        }
        if (!valid)
            throw new CmsListingValidationError(`${field.label} has an invalid value`);
    }
}
export async function assertListingPublishable(db, snapshot) {
    for (const assignment of snapshot.collections)
        await validateMetadata(db, assignment, true);
}
