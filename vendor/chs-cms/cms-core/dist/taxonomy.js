import { z } from 'zod';
export const collectionFieldTypeSchema = z.enum([
    'text',
    'url',
    'date',
    'boolean',
    'stringList',
    'image',
]);
export const collectionFieldConfigSchema = z.object({
    options: z.array(z.string().min(1).max(200)).optional(),
    placeholder: z.string().max(200).optional(),
    helpText: z.string().max(500).optional(),
});
export const cmsCollectionSchema = z.object({
    id: z.string().min(1).max(80),
    label: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    createdAt: z.string().min(1).optional(),
    updatedAt: z.string().min(1).optional(),
});
export const collectionCategorySchema = z.object({
    id: z.string().min(1).max(80),
    collectionId: z.string().min(1).max(80),
    label: z.string().min(1).max(200),
    slug: z.string().min(1).max(120),
    description: z.string().max(1000).optional(),
    sortOrder: z.number().int().min(0).max(9999).default(0),
});
export const collectionTagSchema = z.object({
    id: z.string().min(1).max(80),
    label: z.string().min(1).max(200),
    slug: z.string().min(1).max(120),
    description: z.string().max(1000).optional(),
});
export const collectionFieldSchema = z.object({
    id: z.string().min(1).max(80),
    collectionId: z.string().min(1).max(80),
    key: z.string().min(1).max(80),
    label: z.string().min(1).max(200),
    type: collectionFieldTypeSchema,
    required: z.union([z.literal(0), z.literal(1)]).default(0),
    config: collectionFieldConfigSchema.default({}),
    sortOrder: z.number().int().min(0).max(9999).default(0),
});
export const entryCollectionAssignmentSchema = z.object({
    entryId: z.string().min(1).max(120),
    collectionId: z.string().min(1).max(80),
    categoryId: z.string().min(1).max(80).optional(),
    featured: z.union([z.literal(0), z.literal(1)]).default(0),
    sortDate: z.string().max(40).optional(),
});
export const entryTagAssignmentSchema = z.object({
    entryId: z.string().min(1).max(120),
    tagId: z.string().min(1).max(80),
});
export const entryMetadataValueSchema = z.object({
    entryId: z.string().min(1).max(120),
    collectionId: z.string().min(1).max(80),
    fieldKey: z.string().min(1).max(80),
    value: z.unknown(),
});
export const portfolioCollectionDefinition = {
    collection: {
        id: 'portfolio',
        label: 'Portfolio',
        description: 'Portfolio and work examples.',
    },
    categories: [
        { id: 'portfolio-projects', collectionId: 'portfolio', label: 'Projects', slug: 'projects', sortOrder: 0 },
        {
            id: 'portfolio-contributions',
            collectionId: 'portfolio',
            label: 'Contributions',
            slug: 'contributions',
            sortOrder: 1,
        },
        { id: 'portfolio-speaking', collectionId: 'portfolio', label: 'Speaking', slug: 'speaking', sortOrder: 2 },
    ],
    fields: [
        { id: 'portfolio-project-date', collectionId: 'portfolio', key: 'projectDate', label: 'Project date', type: 'date', sortOrder: 0 },
        { id: 'portfolio-external-url', collectionId: 'portfolio', key: 'externalUrl', label: 'External URL', type: 'url', sortOrder: 1 },
        { id: 'portfolio-tech-stack', collectionId: 'portfolio', key: 'techStack', label: 'Tech stack', type: 'stringList', sortOrder: 2 },
        { id: 'portfolio-featured', collectionId: 'portfolio', key: 'featured', label: 'Featured', type: 'boolean', sortOrder: 3 },
        { id: 'portfolio-thumbnail', collectionId: 'portfolio', key: 'thumbnail', label: 'Thumbnail override', type: 'image', sortOrder: 4 },
    ],
};
