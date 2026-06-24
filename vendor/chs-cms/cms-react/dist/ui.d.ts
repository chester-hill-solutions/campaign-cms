/** Labeled text input matching the host admin theme (`admin-field` tokens). */
export declare function AdminTextInput({ label, hint, id: idProp, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    hint?: React.ReactNode;
}): import("react").JSX.Element;
export declare function AdminTextArea({ label, hint, id: idProp, className, rows, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    hint?: React.ReactNode;
}): import("react").JSX.Element;
export declare function AdminCheckbox({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}): import("react").JSX.Element;
