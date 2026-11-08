import type { ReactNode } from 'react';
export type SiteHealthSettingsPanelProps = {
    site?: {
        id: string;
        domain: string;
        homepageUrl?: string | null;
        cfWebAnalyticsSiteTag?: string | null;
        cfZoneId?: string | null;
        createdAt?: string;
        updatedAt?: string | null;
    } | null;
    domain: string;
    homepageUrl: string;
    cfWebAnalyticsSiteTag: string;
    cfZoneId: string;
    onDomainChange: (value: string) => void;
    onHomepageUrlChange: (value: string) => void;
    onCfWebAnalyticsSiteTagChange: (value: string) => void;
    onCfZoneIdChange: (value: string) => void;
    canConfigure: boolean;
    saving?: boolean;
    collecting?: boolean;
    error?: string | null;
    statusMessage?: string | null;
    onSave: () => void | Promise<void>;
    onCollect?: () => void | Promise<void>;
    children?: ReactNode;
};
export declare function SiteHealthSettingsPanel({ site, domain, homepageUrl, cfWebAnalyticsSiteTag, cfZoneId, onDomainChange, onHomepageUrlChange, onCfWebAnalyticsSiteTagChange, onCfZoneIdChange, canConfigure, saving, collecting, error, statusMessage, onSave, onCollect, }: SiteHealthSettingsPanelProps): import("react").JSX.Element;
