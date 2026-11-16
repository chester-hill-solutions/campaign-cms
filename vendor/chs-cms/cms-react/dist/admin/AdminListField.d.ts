export type AdminListItemEditorProps<T> = {
    item: T;
    index: number;
    onChange: (item: T) => void;
};
export type AdminListFieldProps<T> = {
    label: string;
    itemLabel: string;
    value: readonly T[];
    onChange: (value: T[]) => void;
    createItem: () => T;
    getItemKey: (item: T, index: number) => string;
    getItemLabel?: (item: T, index: number) => string;
    renderItem: (props: AdminListItemEditorProps<T>) => React.ReactNode;
    hint?: string;
    name?: string;
    addLabel?: string;
    emptyLabel?: string;
    moveUpLabel?: (label: string) => string;
    moveDownLabel?: (label: string) => string;
    removeLabel?: (label: string) => string;
};
/** Controlled repeater for host-defined structured lists. */
export declare function AdminListField<T>({ label, itemLabel, value, onChange, createItem, getItemKey, getItemLabel, renderItem, hint, name, addLabel, emptyLabel, moveUpLabel, moveDownLabel, removeLabel, }: AdminListFieldProps<T>): import("react").JSX.Element;
