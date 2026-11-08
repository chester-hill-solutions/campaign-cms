import type { CmsMediaApi, CmsMediaItem, CmsUiTranslate } from './context';
/** Upload mechanics shared by media libraries and image fields; no form names. */
export declare function useImageUpload({ upload, translate }: {
    upload: CmsMediaApi['upload'];
    translate: CmsUiTranslate;
}): {
    file: File | null;
    alt: string;
    setFile: (next: File | null) => void;
    setAlt: (next: string) => void;
    pending: boolean;
    error: string | null;
    uploaded: CmsMediaItem | null;
    fileInputRef: import("react").RefObject<HTMLInputElement | null>;
    uploadSelected: () => Promise<CmsMediaItem | null>;
    validFile: boolean;
    canUpload: boolean;
};
