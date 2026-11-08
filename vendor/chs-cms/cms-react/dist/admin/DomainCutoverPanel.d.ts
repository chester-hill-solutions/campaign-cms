export type DomainCutoverPanelProps = {
    siteName: string;
    currentDomain: string | null;
    workersDomain: string;
    status: 'parallel_running' | 'cutover_complete' | 'cutover_failed';
    checks: {
        label: string;
        passed: boolean;
    }[];
    onInitiateCutover: () => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    loading?: boolean;
};
export declare function DomainCutoverPanel({ siteName, currentDomain, workersDomain, status, checks, onInitiateCutover, loading, }: DomainCutoverPanelProps): import("react").JSX.Element;
