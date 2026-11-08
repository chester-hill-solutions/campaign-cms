import { z } from 'zod';
/** Constrained on-brand layout options shared by every block. */
export declare const blockLayoutSchema: z.ZodObject<{
    width: z.ZodEnum<{
        contained: "contained";
        wide: "wide";
        full: "full";
    }>;
    background: z.ZodEnum<{
        accent: "accent";
        none: "none";
        card: "card";
        "brand-gradient": "brand-gradient";
    }>;
    spacing: z.ZodEnum<{
        tight: "tight";
        normal: "normal";
        loose: "loose";
    }>;
    align: z.ZodEnum<{
        left: "left";
        center: "center";
    }>;
    accent: z.ZodOptional<z.ZodEnum<{
        primary: "primary";
        alt: "alt";
        tertiary: "tertiary";
    }>>;
}, z.core.$strip>;
export type BlockLayout = z.infer<typeof blockLayoutSchema>;
export declare const DEFAULT_BLOCK_LAYOUT: BlockLayout;
/** Constrained item-container options for multi-item blocks (grids, columns, lists). */
export declare const containerLayoutSchema: z.ZodObject<{
    gap: z.ZodDefault<z.ZodEnum<{
        tight: "tight";
        normal: "normal";
        loose: "loose";
    }>>;
    arrangement: z.ZodDefault<z.ZodEnum<{
        grid: "grid";
        list: "list";
    }>>;
    alignItems: z.ZodDefault<z.ZodEnum<{
        center: "center";
        start: "start";
        stretch: "stretch";
    }>>;
}, z.core.$strip>;
export type ContainerLayout = z.infer<typeof containerLayoutSchema>;
export declare const DEFAULT_CONTAINER_LAYOUT: ContainerLayout;
/** Gap + cross-axis align only (columns and list blocks — no arrangement). */
export declare const stackContainerLayoutSchema: z.ZodObject<{
    gap: z.ZodDefault<z.ZodEnum<{
        tight: "tight";
        normal: "normal";
        loose: "loose";
    }>>;
    alignItems: z.ZodDefault<z.ZodEnum<{
        center: "center";
        start: "start";
        stretch: "stretch";
    }>>;
}, z.core.$strip>;
export type StackContainerLayout = z.infer<typeof stackContainerLayoutSchema>;
export declare const DEFAULT_STACK_CONTAINER_LAYOUT: StackContainerLayout;
export declare const blockCtaSchema: z.ZodObject<{
    label: z.ZodString;
    href: z.ZodString;
    external: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type BlockCta = z.infer<typeof blockCtaSchema>;
export declare const heroBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"hero">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    headingAccent: z.ZodOptional<z.ZodString>;
    subhead: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tertiaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    portraitSrc: z.ZodOptional<z.ZodString>;
    portraitAlt: z.ZodOptional<z.ZodString>;
    backgroundSrc: z.ZodOptional<z.ZodString>;
    imagePosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    mobileImagePosition: z.ZodOptional<z.ZodEnum<{
        top: "top";
        bottom: "bottom";
    }>>;
}, z.core.$strip>;
export declare const richTextBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"richText">;
    markdown: z.ZodString;
    anchorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const cardGridItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    expandBody: z.ZodOptional<z.ZodString>;
    iconSrc: z.ZodOptional<z.ZodString>;
    imageSrc: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const cardGridBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"cardGrid">;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    cards: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        body: z.ZodOptional<z.ZodString>;
        expandBody: z.ZodOptional<z.ZodString>;
        iconSrc: z.ZodOptional<z.ZodString>;
        imageSrc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const tableBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"table">;
    heading: z.ZodOptional<z.ZodString>;
    headers: z.ZodArray<z.ZodString>;
    rows: z.ZodArray<z.ZodArray<z.ZodString>>;
    footnote: z.ZodOptional<z.ZodString>;
    mobileCollapse: z.ZodOptional<z.ZodBoolean>;
    mobileSummary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const accordionSectionSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    markdown: z.ZodString;
    imageSrc: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const accordionBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"accordion">;
    heading: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        markdown: z.ZodString;
        imageSrc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ctaStripBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"ctaStrip">;
    headline: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const quoteBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"quote">;
    text: z.ZodString;
    attribution: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const imageBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"image">;
    src: z.ZodString;
    alt: z.ZodString;
    caption: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const columnsBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"columns">;
    columnCount: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    columns: z.ZodArray<z.ZodObject<{
        markdown: z.ZodString;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const listBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"list">;
    heading: z.ZodOptional<z.ZodString>;
    ordered: z.ZodOptional<z.ZodBoolean>;
    items: z.ZodArray<z.ZodString>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const dividerBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"divider">;
}, z.core.$strip>;
export declare const sectionHeaderBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"sectionHeader">;
    anchorId: z.ZodOptional<z.ZodString>;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    dek: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<{
        h2: "h2";
        h3: "h3";
    }>>;
}, z.core.$strip>;
export declare const twoUpBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"twoUp">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodOptional<z.ZodString>;
    bodyMarkdown: z.ZodOptional<z.ZodString>;
    imageSrc: z.ZodOptional<z.ZodString>;
    imageAlt: z.ZodOptional<z.ZodString>;
    imageCaption: z.ZodOptional<z.ZodString>;
    imagePosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const statGridItemSchema: z.ZodObject<{
    id: z.ZodString;
    value: z.ZodString;
    label: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const statGridBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"statGrid">;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    stats: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        value: z.ZodString;
        label: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const timelineItemSchema: z.ZodObject<{
    id: z.ZodString;
    phase: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    bodyMarkdown: z.ZodOptional<z.ZodString>;
    dateLabel: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const timelineBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"timeline">;
    heading: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        phase: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        bodyMarkdown: z.ZodOptional<z.ZodString>;
        dateLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const calloutBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"callout">;
    tone: z.ZodDefault<z.ZodEnum<{
        success: "success";
        neutral: "neutral";
        info: "info";
        warning: "warning";
    }>>;
    heading: z.ZodOptional<z.ZodString>;
    markdown: z.ZodString;
}, z.core.$strip>;
export declare const embedBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"embed">;
    title: z.ZodString;
    src: z.ZodString;
    provider: z.ZodOptional<z.ZodString>;
    aspectRatio: z.ZodDefault<z.ZodEnum<{
        "16:9": "16:9";
        "4:3": "4:3";
        "1:1": "1:1";
        auto: "auto";
    }>>;
    caption: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * The longest custom HTML this repository will store, and the longest `sanitizeCustomHtml`
 * will return. Matches `customHtmlBlockSchema`'s own bound, so a value that passed the schema
 * cannot still be refused by the filter for length.
 */
export declare const CUSTOM_HTML_MAX_LENGTH = 50000;
/**
 * Tags `customHtml` may contain.
 *
 * Declared here rather than beside the filter, because the block schema is what says what a
 * custom HTML block is allowed to be. A sanitizer with its own private list is a list that
 * nobody reads when a block changes.
 *
 * `svg` and `math` are absent on purpose. Foreign-content parsing is where mutation XSS lives:
 * a subtree that re-parses differently in the browser than in the filter is the whole attack,
 * and the cheapest refusal is to not accept the namespace.
 */
export declare const CUSTOM_HTML_ALLOWED_TAGS: ReadonlySet<string>;
/**
 * Attributes `customHtml` may carry, for any allowed tag.
 *
 * An allowlist rather than a denylist, so `onerror`, `style`, `srcdoc`, `formaction`, `ping`
 * and `data` are refused by absence instead of by being remembered. `class` and `id` are here
 * because the CMS's own stylesheets target them.
 */
export declare const CUSTOM_HTML_ALLOWED_ATTRIBUTES: ReadonlySet<string>;
/**
 * Attributes whose value is a URL, so their value gets a scheme check.
 *
 * Only names in `CUSTOM_HTML_ALLOWED_ATTRIBUTES` reach the check, so this list is a
 * completeness note rather than a second gate.
 */
export declare const CUSTOM_HTML_URL_ATTRIBUTES: ReadonlySet<string>;
/**
 * URL schemes `customHtml` may use.
 *
 * Everything else is refused, including `javascript:` and `vbscript:`. A scheme absent from
 * this set cannot reach the output whatever the tag.
 */
export declare const CUSTOM_HTML_ALLOWED_URL_SCHEMES: ReadonlySet<string>;
/**
 * Elements whose content is dropped along with the element.
 *
 * Keeping the text of a `script` or `style` is how a filter ends up emitting its payload as
 * visible text, and keeping the children of `svg` or `object` is how a filter ends up
 * reconstructing a subtree it never checked.
 */
export declare const CUSTOM_HTML_DROP_WITH_CONTENT: ReadonlySet<string>;
export declare const customHtmlBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"customHtml">;
    label: z.ZodOptional<z.ZodString>;
    html: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const spacerBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"spacer">;
    size: z.ZodDefault<z.ZodEnum<{
        small: "small";
        medium: "medium";
        large: "large";
    }>>;
}, z.core.$strip>;
export declare const contactFormBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"contactForm">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    subtext: z.ZodOptional<z.ZodString>;
    formId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const eventsListBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"eventsList">;
    heading: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const eventsTeaserBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"eventsTeaser">;
    heading: z.ZodOptional<z.ZodString>;
    maxItems: z.ZodOptional<z.ZodNumber>;
    showViewAllLink: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const bioLinksBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"bioLinks">;
}, z.core.$strip>;
export declare const donateEmbedBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"donateEmbed">;
    heading: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const collectionGridBlockSchema: z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"collectionGrid">;
    collectionId: z.ZodString;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
    categoryId: z.ZodOptional<z.ZodString>;
    showFeaturedOnly: z.ZodDefault<z.ZodBoolean>;
    maxItems: z.ZodOptional<z.ZodNumber>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
    cardStyle: z.ZodEnum<{
        summary: "summary";
        overlay: "overlay";
    }>;
}, z.core.$strip>;
export declare const pageBlockSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"hero">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    headingAccent: z.ZodOptional<z.ZodString>;
    subhead: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tertiaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    portraitSrc: z.ZodOptional<z.ZodString>;
    portraitAlt: z.ZodOptional<z.ZodString>;
    backgroundSrc: z.ZodOptional<z.ZodString>;
    imagePosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    mobileImagePosition: z.ZodOptional<z.ZodEnum<{
        top: "top";
        bottom: "bottom";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"richText">;
    markdown: z.ZodString;
    anchorId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"cardGrid">;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    cards: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        body: z.ZodOptional<z.ZodString>;
        expandBody: z.ZodOptional<z.ZodString>;
        iconSrc: z.ZodOptional<z.ZodString>;
        imageSrc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"table">;
    heading: z.ZodOptional<z.ZodString>;
    headers: z.ZodArray<z.ZodString>;
    rows: z.ZodArray<z.ZodArray<z.ZodString>>;
    footnote: z.ZodOptional<z.ZodString>;
    mobileCollapse: z.ZodOptional<z.ZodBoolean>;
    mobileSummary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"accordion">;
    heading: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        markdown: z.ZodString;
        imageSrc: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"ctaStrip">;
    headline: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"quote">;
    text: z.ZodString;
    attribution: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"image">;
    src: z.ZodString;
    alt: z.ZodString;
    caption: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"columns">;
    columnCount: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>]>;
    columns: z.ZodArray<z.ZodObject<{
        markdown: z.ZodString;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"list">;
    heading: z.ZodOptional<z.ZodString>;
    ordered: z.ZodOptional<z.ZodBoolean>;
    items: z.ZodArray<z.ZodString>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"divider">;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"sectionHeader">;
    anchorId: z.ZodOptional<z.ZodString>;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    dek: z.ZodOptional<z.ZodString>;
    body: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<{
        h2: "h2";
        h3: "h3";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"twoUp">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodOptional<z.ZodString>;
    bodyMarkdown: z.ZodOptional<z.ZodString>;
    imageSrc: z.ZodOptional<z.ZodString>;
    imageAlt: z.ZodOptional<z.ZodString>;
    imageCaption: z.ZodOptional<z.ZodString>;
    imagePosition: z.ZodOptional<z.ZodEnum<{
        left: "left";
        right: "right";
    }>>;
    primaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    secondaryCta: z.ZodOptional<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
        external: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"statGrid">;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
    stats: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        value: z.ZodString;
        label: z.ZodString;
        note: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"timeline">;
    heading: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        phase: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        bodyMarkdown: z.ZodOptional<z.ZodString>;
        dateLabel: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"callout">;
    tone: z.ZodDefault<z.ZodEnum<{
        success: "success";
        neutral: "neutral";
        info: "info";
        warning: "warning";
    }>>;
    heading: z.ZodOptional<z.ZodString>;
    markdown: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"embed">;
    title: z.ZodString;
    src: z.ZodString;
    provider: z.ZodOptional<z.ZodString>;
    aspectRatio: z.ZodDefault<z.ZodEnum<{
        "16:9": "16:9";
        "4:3": "4:3";
        "1:1": "1:1";
        auto: "auto";
    }>>;
    caption: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"customHtml">;
    label: z.ZodOptional<z.ZodString>;
    html: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"spacer">;
    size: z.ZodDefault<z.ZodEnum<{
        small: "small";
        medium: "medium";
        large: "large";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"contactForm">;
    kicker: z.ZodOptional<z.ZodString>;
    heading: z.ZodString;
    subtext: z.ZodOptional<z.ZodString>;
    formId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"eventsList">;
    heading: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"eventsTeaser">;
    heading: z.ZodOptional<z.ZodString>;
    maxItems: z.ZodOptional<z.ZodNumber>;
    showViewAllLink: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"bioLinks">;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"donateEmbed">;
    heading: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    layout: z.ZodDefault<z.ZodObject<{
        width: z.ZodEnum<{
            contained: "contained";
            wide: "wide";
            full: "full";
        }>;
        background: z.ZodEnum<{
            accent: "accent";
            none: "none";
            card: "card";
            "brand-gradient": "brand-gradient";
        }>;
        spacing: z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>;
        align: z.ZodEnum<{
            left: "left";
            center: "center";
        }>;
        accent: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            alt: "alt";
            tertiary: "tertiary";
        }>>;
    }, z.core.$strip>>;
    type: z.ZodLiteral<"collectionGrid">;
    collectionId: z.ZodString;
    heading: z.ZodOptional<z.ZodString>;
    subheading: z.ZodOptional<z.ZodString>;
    columns: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
    categoryId: z.ZodOptional<z.ZodString>;
    showFeaturedOnly: z.ZodDefault<z.ZodBoolean>;
    maxItems: z.ZodOptional<z.ZodNumber>;
    container: z.ZodDefault<z.ZodObject<{
        gap: z.ZodDefault<z.ZodEnum<{
            tight: "tight";
            normal: "normal";
            loose: "loose";
        }>>;
        arrangement: z.ZodDefault<z.ZodEnum<{
            grid: "grid";
            list: "list";
        }>>;
        alignItems: z.ZodDefault<z.ZodEnum<{
            center: "center";
            start: "start";
            stretch: "stretch";
        }>>;
    }, z.core.$strip>>;
    cardStyle: z.ZodEnum<{
        summary: "summary";
        overlay: "overlay";
    }>;
}, z.core.$strip>], "type">;
export type PageBlock = z.infer<typeof pageBlockSchema>;
export type HeroBlock = z.infer<typeof heroBlockSchema>;
export type RichTextBlock = z.infer<typeof richTextBlockSchema>;
export type CardGridBlock = z.infer<typeof cardGridBlockSchema>;
export type TableBlock = z.infer<typeof tableBlockSchema>;
export type AccordionBlock = z.infer<typeof accordionBlockSchema>;
export type CtaStripBlock = z.infer<typeof ctaStripBlockSchema>;
export type QuoteBlock = z.infer<typeof quoteBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type ColumnsBlock = z.infer<typeof columnsBlockSchema>;
export type ListBlock = z.infer<typeof listBlockSchema>;
export type DividerBlock = z.infer<typeof dividerBlockSchema>;
export type SectionHeaderBlock = z.infer<typeof sectionHeaderBlockSchema>;
export type TwoUpBlock = z.infer<typeof twoUpBlockSchema>;
export type StatGridBlock = z.infer<typeof statGridBlockSchema>;
export type TimelineBlock = z.infer<typeof timelineBlockSchema>;
export type CalloutBlock = z.infer<typeof calloutBlockSchema>;
export type EmbedBlock = z.infer<typeof embedBlockSchema>;
export type CustomHtmlBlock = z.infer<typeof customHtmlBlockSchema>;
export type SpacerBlock = z.infer<typeof spacerBlockSchema>;
export type ContactFormBlock = z.infer<typeof contactFormBlockSchema>;
export type EventsListBlock = z.infer<typeof eventsListBlockSchema>;
export type EventsTeaserBlock = z.infer<typeof eventsTeaserBlockSchema>;
export type BioLinksBlock = z.infer<typeof bioLinksBlockSchema>;
export type DonateEmbedBlock = z.infer<typeof donateEmbedBlockSchema>;
export type CollectionGridBlock = z.infer<typeof collectionGridBlockSchema>;
export declare const pageDocPayloadSchema: z.ZodObject<{
    kind: z.ZodLiteral<"pageDoc">;
    version: z.ZodLiteral<1>;
    slug: z.ZodString;
    title: z.ZodString;
    dek: z.ZodOptional<z.ZodString>;
    enabled: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    showInNav: z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>;
    navLabel: z.ZodString;
    navOrder: z.ZodOptional<z.ZodNumber>;
    seoTitle: z.ZodString;
    seoDescription: z.ZodString;
    noindex: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
    ogImagePath: z.ZodOptional<z.ZodString>;
    blocks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"hero">;
        kicker: z.ZodOptional<z.ZodString>;
        heading: z.ZodString;
        headingAccent: z.ZodOptional<z.ZodString>;
        subhead: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        primaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        secondaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        tertiaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        portraitSrc: z.ZodOptional<z.ZodString>;
        portraitAlt: z.ZodOptional<z.ZodString>;
        backgroundSrc: z.ZodOptional<z.ZodString>;
        imagePosition: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
        }>>;
        mobileImagePosition: z.ZodOptional<z.ZodEnum<{
            top: "top";
            bottom: "bottom";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"richText">;
        markdown: z.ZodString;
        anchorId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"cardGrid">;
        heading: z.ZodOptional<z.ZodString>;
        subheading: z.ZodOptional<z.ZodString>;
        columns: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        cards: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            body: z.ZodOptional<z.ZodString>;
            expandBody: z.ZodOptional<z.ZodString>;
            iconSrc: z.ZodOptional<z.ZodString>;
            imageSrc: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        container: z.ZodDefault<z.ZodObject<{
            gap: z.ZodDefault<z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>>;
            arrangement: z.ZodDefault<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            alignItems: z.ZodDefault<z.ZodEnum<{
                center: "center";
                start: "start";
                stretch: "stretch";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"table">;
        heading: z.ZodOptional<z.ZodString>;
        headers: z.ZodArray<z.ZodString>;
        rows: z.ZodArray<z.ZodArray<z.ZodString>>;
        footnote: z.ZodOptional<z.ZodString>;
        mobileCollapse: z.ZodOptional<z.ZodBoolean>;
        mobileSummary: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"accordion">;
        heading: z.ZodOptional<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            markdown: z.ZodString;
            imageSrc: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"ctaStrip">;
        headline: z.ZodString;
        body: z.ZodOptional<z.ZodString>;
        primaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        secondaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"quote">;
        text: z.ZodString;
        attribution: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"image">;
        src: z.ZodString;
        alt: z.ZodString;
        caption: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"columns">;
        columnCount: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>]>;
        columns: z.ZodArray<z.ZodObject<{
            markdown: z.ZodString;
        }, z.core.$strip>>;
        container: z.ZodDefault<z.ZodObject<{
            gap: z.ZodDefault<z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>>;
            alignItems: z.ZodDefault<z.ZodEnum<{
                center: "center";
                start: "start";
                stretch: "stretch";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"list">;
        heading: z.ZodOptional<z.ZodString>;
        ordered: z.ZodOptional<z.ZodBoolean>;
        items: z.ZodArray<z.ZodString>;
        container: z.ZodDefault<z.ZodObject<{
            gap: z.ZodDefault<z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>>;
            alignItems: z.ZodDefault<z.ZodEnum<{
                center: "center";
                start: "start";
                stretch: "stretch";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"divider">;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"sectionHeader">;
        anchorId: z.ZodOptional<z.ZodString>;
        kicker: z.ZodOptional<z.ZodString>;
        heading: z.ZodString;
        dek: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        level: z.ZodOptional<z.ZodEnum<{
            h2: "h2";
            h3: "h3";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"twoUp">;
        kicker: z.ZodOptional<z.ZodString>;
        heading: z.ZodOptional<z.ZodString>;
        bodyMarkdown: z.ZodOptional<z.ZodString>;
        imageSrc: z.ZodOptional<z.ZodString>;
        imageAlt: z.ZodOptional<z.ZodString>;
        imageCaption: z.ZodOptional<z.ZodString>;
        imagePosition: z.ZodOptional<z.ZodEnum<{
            left: "left";
            right: "right";
        }>>;
        primaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        secondaryCta: z.ZodOptional<z.ZodObject<{
            label: z.ZodString;
            href: z.ZodString;
            external: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"statGrid">;
        heading: z.ZodOptional<z.ZodString>;
        subheading: z.ZodOptional<z.ZodString>;
        columns: z.ZodUnion<readonly [z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>;
        stats: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            value: z.ZodString;
            label: z.ZodString;
            note: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        container: z.ZodDefault<z.ZodObject<{
            gap: z.ZodDefault<z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>>;
            arrangement: z.ZodDefault<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            alignItems: z.ZodDefault<z.ZodEnum<{
                center: "center";
                start: "start";
                stretch: "stretch";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"timeline">;
        heading: z.ZodOptional<z.ZodString>;
        items: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            phase: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            bodyMarkdown: z.ZodOptional<z.ZodString>;
            dateLabel: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"callout">;
        tone: z.ZodDefault<z.ZodEnum<{
            success: "success";
            neutral: "neutral";
            info: "info";
            warning: "warning";
        }>>;
        heading: z.ZodOptional<z.ZodString>;
        markdown: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"embed">;
        title: z.ZodString;
        src: z.ZodString;
        provider: z.ZodOptional<z.ZodString>;
        aspectRatio: z.ZodDefault<z.ZodEnum<{
            "16:9": "16:9";
            "4:3": "4:3";
            "1:1": "1:1";
            auto: "auto";
        }>>;
        caption: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"customHtml">;
        label: z.ZodOptional<z.ZodString>;
        html: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"spacer">;
        size: z.ZodDefault<z.ZodEnum<{
            small: "small";
            medium: "medium";
            large: "large";
        }>>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"contactForm">;
        kicker: z.ZodOptional<z.ZodString>;
        heading: z.ZodString;
        subtext: z.ZodOptional<z.ZodString>;
        formId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"eventsList">;
        heading: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"eventsTeaser">;
        heading: z.ZodOptional<z.ZodString>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        showViewAllLink: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"bioLinks">;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"donateEmbed">;
        heading: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        id: z.ZodString;
        layout: z.ZodDefault<z.ZodObject<{
            width: z.ZodEnum<{
                contained: "contained";
                wide: "wide";
                full: "full";
            }>;
            background: z.ZodEnum<{
                accent: "accent";
                none: "none";
                card: "card";
                "brand-gradient": "brand-gradient";
            }>;
            spacing: z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>;
            align: z.ZodEnum<{
                left: "left";
                center: "center";
            }>;
            accent: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                alt: "alt";
                tertiary: "tertiary";
            }>>;
        }, z.core.$strip>>;
        type: z.ZodLiteral<"collectionGrid">;
        collectionId: z.ZodString;
        heading: z.ZodOptional<z.ZodString>;
        subheading: z.ZodOptional<z.ZodString>;
        columns: z.ZodDefault<z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<4>]>>;
        categoryId: z.ZodOptional<z.ZodString>;
        showFeaturedOnly: z.ZodDefault<z.ZodBoolean>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        container: z.ZodDefault<z.ZodObject<{
            gap: z.ZodDefault<z.ZodEnum<{
                tight: "tight";
                normal: "normal";
                loose: "loose";
            }>>;
            arrangement: z.ZodDefault<z.ZodEnum<{
                grid: "grid";
                list: "list";
            }>>;
            alignItems: z.ZodDefault<z.ZodEnum<{
                center: "center";
                start: "start";
                stretch: "stretch";
            }>>;
        }, z.core.$strip>>;
        cardStyle: z.ZodEnum<{
            summary: "summary";
            overlay: "overlay";
        }>;
    }, z.core.$strip>], "type">>;
}, z.core.$strip>;
export type PageDocPayload = z.infer<typeof pageDocPayloadSchema>;
export declare function createBlockId(prefix?: string): string;
export declare const BLOCK_TYPE_LABELS: Record<PageBlock['type'], string>;
export declare const LAYOUT_BLOCK_TYPES: readonly ["sectionHeader", "twoUp", "columns", "spacer", "divider"];
export declare const CONTENT_BLOCK_TYPES: readonly ["hero", "richText", "cardGrid", "statGrid", "table", "accordion", "timeline", "callout", "quote", "image", "list", "ctaStrip", "embed", "customHtml"];
/**
 * Blocks with behavior supplied by the consuming site. These remain part of
 * the shared, portable block catalog; "app" describes the renderer adapter
 * boundary, not ownership by a single product. Consumers should preserve and
 * expose these blocks even when they do not yet provide a public renderer.
 */
export declare const APP_BLOCK_TYPES: readonly ["contactForm", "eventsList", "eventsTeaser", "bioLinks", "donateEmbed", "collectionGrid"];
/**
 * Every block type in the pageBlock union, grouped order. Single source of
 * truth for registries (factory, renderer, settings, agent tools) — kept in
 * sync with the schema union by blockTypeSync.test.ts.
 */
export declare const ALL_BLOCK_TYPES: readonly ["sectionHeader", "twoUp", "columns", "spacer", "divider", "hero", "richText", "cardGrid", "statGrid", "table", "accordion", "timeline", "callout", "quote", "image", "list", "ctaStrip", "embed", "customHtml", "contactForm", "eventsList", "eventsTeaser", "bioLinks", "donateEmbed", "collectionGrid"];
