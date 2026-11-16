import type { SiteSettings } from '@chester-hill-solutions/cms-core';
export type SiteSettingsPanelProps = {
    settings: SiteSettings;
    onChange: (settings: SiteSettings) => void;
    onSave: () => void | Promise<void>;
    saving?: boolean;
    dirty?: boolean;
    error?: string | null;
    statusMessage?: string | null;
};
export declare function SiteSettingsPanel({ settings, onChange, onSave, saving, dirty, error, statusMessage }: SiteSettingsPanelProps): import("react").JSX.Element;
