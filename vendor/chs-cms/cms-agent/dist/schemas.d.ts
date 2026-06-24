import { z } from 'zod';
export declare const listPagesInput: z.ZodObject<{}, z.core.$strip>;
export declare const getPageInput: z.ZodObject<{
    entryId: z.ZodString;
    view: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        both: "both";
        summary: "summary";
    }>>;
}, z.core.$strip>;
export declare const getBlockTypesInput: z.ZodObject<{}, z.core.$strip>;
export declare const listRevisionsInput: z.ZodObject<{
    entryId: z.ZodString;
}, z.core.$strip>;
export declare const listMediaInput: z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const checkSlugInput: z.ZodObject<{
    slug: z.ZodString;
    excludeEntryId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createPageInput: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
}, z.core.$strip>;
export declare const updatePageMetaInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    dek: z.ZodOptional<z.ZodString>;
    seoTitle: z.ZodOptional<z.ZodString>;
    seoDescription: z.ZodOptional<z.ZodString>;
    navLabel: z.ZodOptional<z.ZodString>;
    navOrder: z.ZodOptional<z.ZodNumber>;
    showInNav: z.ZodOptional<z.ZodBoolean>;
    enabled: z.ZodOptional<z.ZodBoolean>;
    noindex: z.ZodOptional<z.ZodBoolean>;
    ogImagePath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const addBlockInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        sectionHeader: "sectionHeader";
        twoUp: "twoUp";
        columns: "columns";
        spacer: "spacer";
        divider: "divider";
        hero: "hero";
        richText: "richText";
        cardGrid: "cardGrid";
        statGrid: "statGrid";
        table: "table";
        accordion: "accordion";
        timeline: "timeline";
        callout: "callout";
        quote: "quote";
        image: "image";
        list: "list";
        ctaStrip: "ctaStrip";
        embed: "embed";
        customHtml: "customHtml";
        contactForm: "contactForm";
        eventsList: "eventsList";
        eventsTeaser: "eventsTeaser";
        bioLinks: "bioLinks";
        donateEmbed: "donateEmbed";
    }>;
    index: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateBlockInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    blockId: z.ZodString;
    patch: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
export declare const removeBlockInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    blockId: z.ZodString;
}, z.core.$strip>;
export declare const reorderBlockInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    blockId: z.ZodOptional<z.ZodString>;
    direction: z.ZodOptional<z.ZodEnum<{
        up: "up";
        down: "down";
    }>>;
    fromIndex: z.ZodOptional<z.ZodNumber>;
    toIndex: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const duplicateBlockInput: z.ZodObject<{
    entryId: z.ZodString;
    expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
    blockId: z.ZodString;
}, z.core.$strip>;
export declare const uploadMediaInput: z.ZodObject<{
    filename: z.ZodString;
    mime: z.ZodEnum<{
        "image/jpeg": "image/jpeg";
        "image/png": "image/png";
        "image/webp": "image/webp";
        "image/gif": "image/gif";
    }>;
    base64: z.ZodString;
    alt: z.ZodString;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const restoreRevisionInput: z.ZodObject<{
    entryId: z.ZodString;
    revisionId: z.ZodString;
}, z.core.$strip>;
export declare const publishPageInput: z.ZodObject<{
    entryId: z.ZodString;
}, z.core.$strip>;
export declare const cmsAgentToolSchemas: {
    readonly list_pages: z.ZodObject<{}, z.core.$strip>;
    readonly get_page: z.ZodObject<{
        entryId: z.ZodString;
        view: z.ZodDefault<z.ZodEnum<{
            draft: "draft";
            published: "published";
            both: "both";
            summary: "summary";
        }>>;
    }, z.core.$strip>;
    readonly get_block_types: z.ZodObject<{}, z.core.$strip>;
    readonly list_revisions: z.ZodObject<{
        entryId: z.ZodString;
    }, z.core.$strip>;
    readonly list_media: z.ZodObject<{
        limit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    readonly check_slug: z.ZodObject<{
        slug: z.ZodString;
        excludeEntryId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly create_page: z.ZodObject<{
        title: z.ZodString;
        slug: z.ZodString;
    }, z.core.$strip>;
    readonly update_page_meta: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        dek: z.ZodOptional<z.ZodString>;
        seoTitle: z.ZodOptional<z.ZodString>;
        seoDescription: z.ZodOptional<z.ZodString>;
        navLabel: z.ZodOptional<z.ZodString>;
        navOrder: z.ZodOptional<z.ZodNumber>;
        showInNav: z.ZodOptional<z.ZodBoolean>;
        enabled: z.ZodOptional<z.ZodBoolean>;
        noindex: z.ZodOptional<z.ZodBoolean>;
        ogImagePath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    readonly add_block: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        type: z.ZodEnum<{
            sectionHeader: "sectionHeader";
            twoUp: "twoUp";
            columns: "columns";
            spacer: "spacer";
            divider: "divider";
            hero: "hero";
            richText: "richText";
            cardGrid: "cardGrid";
            statGrid: "statGrid";
            table: "table";
            accordion: "accordion";
            timeline: "timeline";
            callout: "callout";
            quote: "quote";
            image: "image";
            list: "list";
            ctaStrip: "ctaStrip";
            embed: "embed";
            customHtml: "customHtml";
            contactForm: "contactForm";
            eventsList: "eventsList";
            eventsTeaser: "eventsTeaser";
            bioLinks: "bioLinks";
            donateEmbed: "donateEmbed";
        }>;
        index: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    readonly update_block: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        blockId: z.ZodString;
        patch: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>;
    readonly remove_block: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        blockId: z.ZodString;
    }, z.core.$strip>;
    readonly reorder_block: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        blockId: z.ZodOptional<z.ZodString>;
        direction: z.ZodOptional<z.ZodEnum<{
            up: "up";
            down: "down";
        }>>;
        fromIndex: z.ZodOptional<z.ZodNumber>;
        toIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    readonly duplicate_block: z.ZodObject<{
        entryId: z.ZodString;
        expectedDraftRevisionId: z.ZodOptional<z.ZodString>;
        blockId: z.ZodString;
    }, z.core.$strip>;
    readonly upload_media: z.ZodObject<{
        filename: z.ZodString;
        mime: z.ZodEnum<{
            "image/jpeg": "image/jpeg";
            "image/png": "image/png";
            "image/webp": "image/webp";
            "image/gif": "image/gif";
        }>;
        base64: z.ZodString;
        alt: z.ZodString;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    readonly restore_revision: z.ZodObject<{
        entryId: z.ZodString;
        revisionId: z.ZodString;
    }, z.core.$strip>;
    readonly publish_page: z.ZodObject<{
        entryId: z.ZodString;
    }, z.core.$strip>;
};
export type CmsAgentToolName = keyof typeof cmsAgentToolSchemas;
