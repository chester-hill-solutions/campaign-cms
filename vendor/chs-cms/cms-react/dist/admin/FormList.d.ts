export type FormDefinitionRow = {
    id: string;
    title: string;
    description: string | null;
    fields_json: string;
    settings_json: string;
    created_at: string;
    updated_at: string;
};
export type FormListProps = {
    forms: FormDefinitionRow[];
    onCreate: (input: {
        id: string;
        title: string;
        description?: string;
    }) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    onDelete: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    loading?: boolean;
    error?: string | null;
};
export declare function FormList({ forms, onCreate, onDelete, loading, error, }: FormListProps): import("react").JSX.Element;
