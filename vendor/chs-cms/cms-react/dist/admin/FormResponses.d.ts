import type { FormFieldDefinition } from '@chester-hill-solutions/cms-core';
export type FormResponseRow = {
    id: string;
    form_id: string;
    data_json: string;
    submitted_at: string;
    ip: string | null;
    spam: number;
};
export type FormResponsesProps = {
    formId: string;
    formTitle: string;
    fields: FormFieldDefinition[];
    responses: FormResponseRow[];
    onDeleteResponse: (id: string) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    /**
     * Produce the CSV the operator downloads.
     *
     * `escapeFormulas` is declared here rather than imported, so this package does not gain a
     * dependency on the store. The component asks for an escaped export: the file it hands to
     * the operator is opened in a spreadsheet, and a response value is visitor-supplied text.
     */
    onExportCsv: (options?: {
        escapeFormulas?: boolean;
    }) => Promise<string>;
    loading?: boolean;
    error?: string | null;
};
export declare function FormResponses({ formId, formTitle, fields, responses, onDeleteResponse, onExportCsv, loading, error, }: FormResponsesProps): import("react").JSX.Element;
