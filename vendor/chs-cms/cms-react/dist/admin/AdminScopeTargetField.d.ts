export type AdminScopeOption = {
    value: string;
    label: string;
    targetLabel?: string;
    chooseTargetLabel?: string;
    emptyTargetsLabel?: string;
    targets?: readonly {
        value: string;
        label: string;
    }[];
};
export type AdminScopeTargetFieldProps = {
    label: string;
    scopeLabel: string;
    scopes: readonly AdminScopeOption[];
    scope: string;
    target: string;
    onScopeChange: (scope: string) => void;
    onTargetChange: (target: string) => void;
    scopeName?: string;
    targetName?: string;
    hint?: string;
    searchable?: boolean;
    searchLabel?: string;
    searchPlaceholder?: string;
};
/** Select a scope and, when that scope requires one, its target record. */
export declare function AdminScopeTargetField({ label, scopeLabel, scopes, scope, target, onScopeChange, onTargetChange, scopeName, targetName, hint, searchable, searchLabel, searchPlaceholder, }: AdminScopeTargetFieldProps): import("react").JSX.Element;
