import type { CollectionFieldConfig, CollectionFieldType } from '@chester-hill-solutions/cms-core';
export type FieldFormValues = {
    key: string;
    label: string;
    type: CollectionFieldType;
    required: 0 | 1;
    config: CollectionFieldConfig;
};
export type CollectionFieldEditorProps = {
    initial?: Partial<{
        key: string;
        label: string;
        type: CollectionFieldType;
        required: 0 | 1;
        config: CollectionFieldConfig;
    }>;
    onSave: (data: FieldFormValues) => Promise<void>;
    onCancel: () => void;
    saving?: boolean;
};
export declare function CollectionFieldEditor({ initial, onSave, onCancel, saving, }: CollectionFieldEditorProps): import("react").JSX.Element;
