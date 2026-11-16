export type RichTextEditorProps = {
    value: string;
    onChange: (markdown: string) => void;
    label?: string;
    disabled?: boolean;
    toolbar?: 'floating' | 'inline';
};
export default function InlineRichTextEditor({ value, onChange, label, disabled, toolbar }: RichTextEditorProps): import("react").JSX.Element;
