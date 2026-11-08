import { z } from 'zod';
export declare const collectionFieldTypeSchema: z.ZodEnum<{
    boolean: "boolean";
    date: "date";
    text: "text";
    image: "image";
    url: "url";
    stringList: "stringList";
}>;
export type CollectionFieldType = z.infer<typeof collectionFieldTypeSchema>;
export declare const collectionFieldConfigSchema: z.ZodObject<{
    options: z.ZodOptional<z.ZodArray<z.ZodString>>;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CollectionFieldConfig = z.infer<typeof collectionFieldConfigSchema>;
export declare const cmsCollectionSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CmsCollection = z.infer<typeof cmsCollectionSchema>;
export declare const collectionCategorySchema: z.ZodObject<{
    id: z.ZodString;
    collectionId: z.ZodString;
    label: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CollectionCategory = z.infer<typeof collectionCategorySchema>;
export declare const collectionTagSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CollectionTag = z.infer<typeof collectionTagSchema>;
export declare const collectionFieldSchema: z.ZodObject<{
    id: z.ZodString;
    collectionId: z.ZodString;
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<{
        boolean: "boolean";
        date: "date";
        text: "text";
        image: "image";
        url: "url";
        stringList: "stringList";
    }>;
    required: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
    config: z.ZodDefault<z.ZodObject<{
        options: z.ZodOptional<z.ZodArray<z.ZodString>>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CollectionField = z.infer<typeof collectionFieldSchema>;
export declare const entryCollectionAssignmentSchema: z.ZodObject<{
    entryId: z.ZodString;
    collectionId: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    featured: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
    sortDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type EntryCollectionAssignment = z.infer<typeof entryCollectionAssignmentSchema>;
export declare const entryTagAssignmentSchema: z.ZodObject<{
    entryId: z.ZodString;
    tagId: z.ZodString;
}, z.core.$strip>;
export type EntryTagAssignment = z.infer<typeof entryTagAssignmentSchema>;
export declare const entryMetadataValueSchema: z.ZodObject<{
    entryId: z.ZodString;
    collectionId: z.ZodString;
    fieldKey: z.ZodString;
    value: z.ZodUnknown;
}, z.core.$strip>;
export type EntryMetadataValue = z.infer<typeof entryMetadataValueSchema>;
export declare const portfolioCollectionDefinition: {
    readonly collection: {
        readonly id: "portfolio";
        readonly label: "Portfolio";
        readonly description: "Portfolio and work examples.";
    };
    readonly categories: readonly [{
        readonly id: "portfolio-projects";
        readonly collectionId: "portfolio";
        readonly label: "Projects";
        readonly slug: "projects";
        readonly sortOrder: 0;
    }, {
        readonly id: "portfolio-contributions";
        readonly collectionId: "portfolio";
        readonly label: "Contributions";
        readonly slug: "contributions";
        readonly sortOrder: 1;
    }, {
        readonly id: "portfolio-speaking";
        readonly collectionId: "portfolio";
        readonly label: "Speaking";
        readonly slug: "speaking";
        readonly sortOrder: 2;
    }];
    readonly fields: readonly [{
        readonly id: "portfolio-project-date";
        readonly collectionId: "portfolio";
        readonly key: "projectDate";
        readonly label: "Project date";
        readonly type: "date";
        readonly sortOrder: 0;
    }, {
        readonly id: "portfolio-external-url";
        readonly collectionId: "portfolio";
        readonly key: "externalUrl";
        readonly label: "External URL";
        readonly type: "url";
        readonly sortOrder: 1;
    }, {
        readonly id: "portfolio-tech-stack";
        readonly collectionId: "portfolio";
        readonly key: "techStack";
        readonly label: "Tech stack";
        readonly type: "stringList";
        readonly sortOrder: 2;
    }, {
        readonly id: "portfolio-featured";
        readonly collectionId: "portfolio";
        readonly key: "featured";
        readonly label: "Featured";
        readonly type: "boolean";
        readonly sortOrder: 3;
    }, {
        readonly id: "portfolio-thumbnail";
        readonly collectionId: "portfolio";
        readonly key: "thumbnail";
        readonly label: "Thumbnail override";
        readonly type: "image";
        readonly sortOrder: 4;
    }];
};
