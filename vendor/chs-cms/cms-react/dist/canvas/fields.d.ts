import type { BlockCta } from '@chester-hill-solutions/cms-core';
/** Titled group of fields inside the settings panel. */
export declare function PanelSection({ title, children, }: {
    title: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
type SegOption<T> = {
    value: T;
    label: string;
};
/** Compact segmented control for small enum fields. */
export declare function SegmentedControl<T extends string | number>({ label, hint, options, value, onChange, }: {
    label: string;
    hint?: string;
    options: ReadonlyArray<SegOption<T>>;
    value: T;
    onChange: (value: T) => void;
}): import("react").JSX.Element;
/** Keep partial CTA edits intact; removing a button is an explicit action. */
export declare function CtaFields({ label, cta, onChange, }: {
    label: string;
    cta: BlockCta | undefined;
    onChange: (cta: BlockCta | undefined) => void;
}): import("react").JSX.Element;
/** Image field with thumbnail, media library picker, and manual path entry. */
export declare function MediaField({ label, value, onSelect, onClear, }: {
    label: string;
    value: string;
    /** alt is provided when the image was picked from the media library. */
    onSelect: (path: string, alt?: string) => void;
    onClear: () => void;
}): import("react").JSX.Element;
export {};
