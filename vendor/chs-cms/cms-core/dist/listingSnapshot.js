import { z } from 'zod';
import { collectionTagSchema } from './taxonomy.js';
export const entryListingSnapshotSchema = z.object({
    version: z.literal(1),
    collections: z.array(z.object({
        collectionId: z.string().min(1).max(80),
        collectionLabel: z.string().min(1).max(200),
        category: z.object({ id: z.string().min(1).max(80), label: z.string().min(1).max(200), slug: z.string().min(1).max(120) }).nullable(),
        featured: z.union([z.literal(0), z.literal(1)]),
        sortDate: z.string().max(40).nullable(),
        metadata: z.record(z.string().min(1).max(80), z.json()),
    })).max(200),
    tags: z.array(collectionTagSchema).max(500),
}).superRefine((snapshot, context) => {
    if (new Set(snapshot.collections.map(row => row.collectionId)).size !== snapshot.collections.length)
        context.addIssue({ code: 'custom', path: ['collections'], message: 'Duplicate collection assignment' });
    if (new Set(snapshot.tags.map(row => row.id)).size !== snapshot.tags.length)
        context.addIssue({ code: 'custom', path: ['tags'], message: 'Duplicate tag assignment' });
});
export function emptyEntryListingSnapshot() {
    return { version: 1, collections: [], tags: [] };
}
