export type BuiltinSiteHealthData = {
    checkedAt: string;
    pagesChecked: number;
    checks: Array<{
        label: string;
        status: 'pass' | 'warning';
        detail: string;
    }>;
    issues: Array<{
        kind: string;
        entryId: string;
        title: string;
        message: string;
    }>;
};
export declare function BuiltinSiteHealthPanel({ data }: {
    data: BuiltinSiteHealthData;
}): import("react").JSX.Element;
