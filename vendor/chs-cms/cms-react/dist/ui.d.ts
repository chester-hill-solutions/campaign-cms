/** Labeled text input matching the host admin theme (`admin-field` tokens). */
export declare function AdminTextInput({ label, hint, id: idProp, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: React.ReactNode;
}): import("react").JSX.Element;
export declare function AdminTextArea({ label, hint, id: idProp, className, rows, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    hint?: React.ReactNode;
}): import("react").JSX.Element;
/** Labeled select matching the host admin theme (`admin-field` tokens). */
export declare function AdminSelect({ label, hint, id: idProp, className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    hint?: React.ReactNode;
}): import("react").JSX.Element;
export declare function AdminCheckbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}): import("react").JSX.Element;
export type AdminTagInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'defaultValue' | 'onChange' | 'type'> & {
    label: string;
    hint?: React.ReactNode;
    name?: string;
    value: string[];
    onChange: (value: string[]) => void;
    addLabel?: string;
    emptyLabel?: string;
};
/** Reusable tag/string-list editor for small, editor-managed vocabularies. */
export declare function AdminTagInput({ label, hint, name, value, onChange, addLabel, emptyLabel, id: idProp, className, placeholder, maxLength, onKeyDown, ...inputProps }: AdminTagInputProps): import("react").JSX.Element;
