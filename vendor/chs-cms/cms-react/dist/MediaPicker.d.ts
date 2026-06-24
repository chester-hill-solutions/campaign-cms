type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (path: string, alt: string) => void;
};
export declare function MediaPicker({ open, onClose, onSelect }: Props): import("react").JSX.Element | null;
export {};
