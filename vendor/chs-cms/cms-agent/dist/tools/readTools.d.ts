import type { CmsAgentConfig, CmsAgentStore } from '../types';
import { type CmsAgentTool } from './makeTool';
/** Field metadata derived from the Zod schemas — never hand-maintained. */
declare function describeBlockTypes(): {
    type: "sectionHeader" | "twoUp" | "columns" | "spacer" | "divider" | "hero" | "richText" | "cardGrid" | "statGrid" | "table" | "accordion" | "timeline" | "callout" | "quote" | "image" | "list" | "ctaStrip" | "embed" | "customHtml" | "contactForm" | "eventsList" | "eventsTeaser" | "bioLinks" | "donateEmbed";
    label: string;
    category: string;
    fields: {
        name: string;
        required: boolean;
    }[];
}[];
export declare function createReadTools(store: CmsAgentStore, config: CmsAgentConfig): CmsAgentTool[];
export { describeBlockTypes };
