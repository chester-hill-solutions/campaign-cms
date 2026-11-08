export type AdminSection = 'overview' | 'pages' | 'collections' | 'tags' | 'media' | 'analytics' | 'settings';
export type AdminLayoutProps = {
    children: React.ReactNode;
    activeSection: AdminSection;
    collectionCount?: number;
    tagCount?: number;
    overviewHref?: string;
    pagesHref?: string;
    collectionsHref?: string;
    tagsHref?: string;
    mediaHref?: string;
    analyticsHref?: string;
    /** Mount the host's protected settings route before exposing its navigation item. */
    settingsHref?: string;
};
export declare function AdminLayout({ children, activeSection, collectionCount, tagCount, overviewHref, pagesHref, collectionsHref, tagsHref, mediaHref, analyticsHref, settingsHref, }: AdminLayoutProps): import("react").JSX.Element;
