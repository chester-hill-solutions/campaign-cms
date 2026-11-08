export type AdminRelationshipOption = {
    id: string;
    label: string;
    description?: string;
    disabled?: boolean;
};
export type AdminRelationshipFieldProps = {
    label: string;
    hint?: string;
    options: readonly AdminRelationshipOption[];
    value: readonly string[];
    onChange: (value: string[]) => void;
    name?: string;
    addLabel?: string;
    searchLabel?: string;
    searchPlaceholder?: string;
    availableLabel?: string;
    chooseLabel?: string;
    selectedLabel?: string;
    emptyLabel?: string;
    unavailableLabel?: string;
    moveUpLabel?: (label: string) => string;
    moveDownLabel?: (label: string) => string;
    removeLabel?: (label: string) => string;
};
/** Searchable multi-relationship picker with an ordered, removable selection. */
export declare function AdminRelationshipField({ label, hint, options, value, onChange, name, addLabel, searchLabel, searchPlaceholder, availableLabel, chooseLabel, selectedLabel, emptyLabel, unavailableLabel, moveUpLabel, moveDownLabel, removeLabel, }: AdminRelationshipFieldProps): import("react").JSX.Element;
