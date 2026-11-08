import type { BlockFactoryDefaults } from '@chester-hill-solutions/cms-core';
/** A resolved media choice for the editor. The host owns URL and storage policy. */
export type CmsMediaItem = {
    id: string;
    url: string;
    filename: string;
    alt: string;
};
/**
 * Host-provided media library API. The host owns auth/CSRF; the package only
 * calls these methods.
 */
export type CmsMediaApi = {
    list: () => Promise<CmsMediaItem[]>;
    upload: (input: {
        filename: string;
        mime: string;
        base64: string;
        alt: string;
        width?: number;
        height?: number;
    }) => Promise<{
        ok: true;
        asset: CmsMediaItem;
    } | {
        ok: false;
        error: string;
    }>;
};
export type HeroFallbackPortrait = {
    src: string;
    alt: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
};
/** Host-owned geometry and responsive sources for an existing image URL. */
export type CmsImageAttributes = {
    width?: number;
    height?: number;
    srcSet?: string;
    sizes?: string;
};
export type CmsImageUsage = 'hero' | 'image' | 'split' | 'card' | 'icon';
/** Host localization hook for shared UI labels. Untranslated keys use fallback text. */
export type CmsUiTranslate = (key: string, fallback: string, values?: Record<string, string | number>) => string;
export type CmsUiConfig = {
    /** Media library backend; without it the picker only accepts manual paths. */
    mediaApi?: CmsMediaApi;
    /** Portrait shown by hero blocks that have no explicit portraitSrc. */
    heroFallbackPortrait?: HeroFallbackPortrait;
    /** Resolve delivery attributes without replacing the CMS URL, alt text or loading policy. */
    resolveImageAttributes?: (src: string, usage: CmsImageUsage) => CmsImageAttributes | undefined;
    /** Defaults applied when inserting fresh blocks in the editor. */
    blockDefaults?: BlockFactoryDefaults;
    /** Localize shared editor and block UI while keeping the package framework-agnostic. */
    translate?: CmsUiTranslate;
};
export declare function CmsUiProvider({ config, children, }: {
    config: CmsUiConfig;
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function useCmsUi(): CmsUiConfig;
export declare function useCmsTranslate(): CmsUiTranslate;
/** Stable fallback-derived key for reusable control labels and placeholders. */
export declare function cmsUiTextKey(fallback: string): string;
export declare function useCmsText(): (fallback: string, values?: Record<string, string | number>) => string;
