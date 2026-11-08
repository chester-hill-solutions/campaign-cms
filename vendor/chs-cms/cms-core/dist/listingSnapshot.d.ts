import { z } from 'zod';
export declare const entryListingSnapshotSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    collections: z.ZodArray<z.ZodObject<{
        collectionId: z.ZodString;
        collectionLabel: z.ZodString;
        category: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            slug: z.ZodString;
        }, z.core.$strip>>;
        featured: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>;
        sortDate: z.ZodNullable<z.ZodString>;
        metadata: z.ZodRecord<z.ZodString, z.ZodJSONSchema>;
    }, z.core.$strip>>;
    tags: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        slug: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type EntryListingSnapshot = z.infer<typeof entryListingSnapshotSchema>;
export declare function emptyEntryListingSnapshot(): EntryListingSnapshot;
