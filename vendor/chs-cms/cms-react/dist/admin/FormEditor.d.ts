import type { FormFieldDefinition, FormSettings } from '@chester-hill-solutions/cms-core';
export type FormEditorProps = {
    formId: string;
    initialTitle: string;
    initialDescription: string | null;
    initialFields: FormFieldDefinition[];
    initialSettings: FormSettings;
    onSave: (input: {
        title: string;
        description?: string;
        fields: FormFieldDefinition[];
        settings: FormSettings;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    saving?: boolean;
    error?: string | null;
};
export declare function FormEditor({ formId, initialTitle, initialDescription, initialFields, initialSettings, onSave, saving, error, }: FormEditorProps): import("react").JSX.Element;
