import type { AnalyticsConfig } from '@chester-hill-solutions/cms-core';
export type AnalyticsPanelProps = {
    config: AnalyticsConfig;
    onChange: (config: AnalyticsConfig) => void;
    privileged?: boolean;
    auditNote?: string;
    onAuditNoteChange?: (note: string) => void;
};
export declare function AnalyticsPanel({ config, onChange, privileged, auditNote, onAuditNoteChange, }: AnalyticsPanelProps): import("react").JSX.Element;
