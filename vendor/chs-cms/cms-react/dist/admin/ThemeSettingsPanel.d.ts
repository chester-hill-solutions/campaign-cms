import type { SiteTheme } from '@chester-hill-solutions/cms-core';
export type ThemeSettingsPanelProps = {
    theme: SiteTheme;
    onChange: (theme: SiteTheme) => void;
    onSave: () => void | Promise<void>;
    saving?: boolean;
    error?: string | null;
    statusMessage?: string | null;
};
export declare function ThemeSettingsPanel({ theme, onChange, onSave, saving, error, statusMessage, }: ThemeSettingsPanelProps): import("react").JSX.Element;
