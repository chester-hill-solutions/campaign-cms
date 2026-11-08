import type { ReactNode } from 'react';
export type AdminOverviewProps = {
    title?: string;
    /** Use h2 when embedding beneath an existing screen heading. */
    headingLevel?: 1 | 2;
    settingsHref?: string;
    summary?: {
        domain?: string;
        setupComplete?: boolean;
        lastRunAt?: string | null;
        issues?: {
            error?: number;
            warn?: number;
            info?: number;
        };
        topIssues?: Array<{
            type: string;
            severity: string;
            description: string;
            url?: string;
        }>;
    } | null;
    submissions?: {
        count: number;
        latestLabel: string | null;
    };
    children?: ReactNode;
};
export declare function AdminOverview({ title, headingLevel, settingsHref, summary, submissions, }: AdminOverviewProps): import("react").JSX.Element;
