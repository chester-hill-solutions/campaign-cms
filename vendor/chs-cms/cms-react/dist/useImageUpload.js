import { useRef, useState } from 'react';
const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const maximumBytes = 5 * 1024 * 1024;
/** Upload mechanics shared by media libraries and image fields; no form names. */
export function useImageUpload({ upload, translate }) {
    const [file, setFileValue] = useState(null);
    const [alt, setAltValue] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    const [uploaded, setUploaded] = useState(null);
    const fileInputRef = useRef(null);
    const pendingRef = useRef(false);
    function fileError(next) {
        if (!next)
            return null;
        if (!acceptedTypes.has(next.type))
            return translate('cms.media.unsupportedType', 'Use JPEG, PNG, WebP, or GIF.');
        if (next.size > maximumBytes)
            return translate('cms.media.fileTooLarge', 'File too large (max 5 MB).');
        if (!next.size)
            return translate('cms.media.emptyFile', 'Choose an image that is not empty.');
        return null;
    }
    function setFile(next) {
        if (pendingRef.current)
            return;
        setFileValue(next);
        setUploaded(null);
        setError(fileError(next));
    }
    function setAlt(next) {
        if (pendingRef.current)
            return;
        setAltValue(next);
        setError(fileError(file));
    }
    async function uploadSelected() {
        if (pendingRef.current)
            return null;
        const problem = fileError(file);
        if (!file || problem || !alt.trim()) {
            setError(problem ?? translate('cms.media.altTextMissing', 'Choose an image and add alternative text before uploading.'));
            return null;
        }
        pendingRef.current = true;
        setPending(true);
        setError(null);
        setUploaded(null);
        try {
            const bytes = new Uint8Array(await file.arrayBuffer());
            let binary = '';
            for (let offset = 0; offset < bytes.length; offset += 0x8000) {
                binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
            }
            const result = await upload({ filename: file.name, mime: file.type, base64: btoa(binary), alt: alt.trim() });
            if (!result.ok) {
                setError(result.error);
                return null;
            }
            setUploaded(result.asset);
            setFileValue(null);
            setAltValue('');
            if (fileInputRef.current)
                fileInputRef.current.value = '';
            return result.asset;
        }
        catch {
            setError(translate('cms.media.uploadFailed', 'The image could not be uploaded. Check the connection and try again.'));
            return null;
        }
        finally {
            pendingRef.current = false;
            setPending(false);
        }
    }
    const validFile = Boolean(file && !fileError(file));
    return { file, alt, setFile, setAlt, pending, error, uploaded, fileInputRef, uploadSelected, validFile, canUpload: Boolean(validFile && alt.trim()) };
}
