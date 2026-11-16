import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from 'react';
import { useCmsTranslate, useCmsUi } from './context';
import { AdminTextInput } from './ui';
import { useImageUpload } from './useImageUpload';
export function MediaPicker({ open, onClose, onSelect }) {
    const { mediaApi } = useCmsUi();
    const t = useCmsTranslate();
    const [assets, setAssets] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const { alt, setAlt, setFile, pending, error, fileInputRef, canUpload, uploadSelected } = useImageUpload({
        upload: async (input) => mediaApi ? mediaApi.upload(input) : { ok: false, error: t('cms.media.noBackend', 'No media backend configured.') },
        translate: t,
    });
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const visibleAssets = normalizedQuery
        ? assets.filter((asset) => `${asset.filename} ${asset.alt}`.toLocaleLowerCase().includes(normalizedQuery))
        : assets;
    const load = useCallback(async () => {
        if (!mediaApi)
            return;
        setLoading(true);
        setLoadError(false);
        try {
            setAssets(await mediaApi.list());
        }
        catch {
            setLoadError(true);
        }
        finally {
            setLoading(false);
        }
    }, [mediaApi]);
    useEffect(() => {
        if (open)
            void load();
    }, [open, load]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", role: "dialog", "aria-modal": "true", "aria-label": t('cms.media.dialog', 'Media picker'), children: _jsxs("div", { className: "max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-xl", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { className: "m-0 text-lg font-semibold text-ink", children: t('cms.media.title', 'Media library') }), _jsx("button", { type: "button", className: "focus-ring text-sm font-semibold underline", onClick: onClose, disabled: pending, children: t('cms.common.close', 'Close') })] }), !mediaApi ? (_jsx("p", { className: "text-sm text-ink-muted", children: t('cms.media.noBackend', 'No media backend configured. Enter image paths manually.') })) : (_jsxs("div", { className: "mb-4 grid gap-4", children: [_jsxs("fieldset", { disabled: pending, className: "m-0 grid min-w-0 gap-3 border-0 p-0", children: [_jsx(AdminTextInput, { label: t('cms.media.altTextRequired', 'Alt text (required for upload)'), value: alt, onChange: (e) => setAlt(e.target.value), maxLength: 300, hint: t('cms.media.altTextHint', 'Describe the image for readers who cannot see it.') }), _jsxs("label", { className: "grid gap-1 text-sm font-semibold text-ink-muted", children: [t('cms.media.chooseFile', 'Image file'), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/jpeg,image/png,image/webp,image/gif", className: "text-sm", onChange: (event) => setFile(event.target.files?.[0] ?? null) })] }), _jsx("button", { type: "button", className: "focus-ring self-start rounded-lg bg-surface-elevated px-4 py-2 text-sm font-semibold text-ink", disabled: pending || !canUpload, onClick: () => {
                                        void uploadSelected().then((asset) => {
                                            if (!asset)
                                                return;
                                            setAssets((current) => [asset, ...current.filter((item) => item.id !== asset.id)]);
                                            void load();
                                        });
                                    }, children: pending ? t('cms.media.uploading', 'Uploading…') : t('cms.media.upload', 'Upload') }), loadError ? _jsx("p", { className: "text-sm text-accent-red", role: "alert", children: t('cms.media.loadFailed', 'The media library could not be loaded. Check the connection and try again.') }) : null, error ? _jsx("p", { className: "text-sm text-accent-red", role: "alert", children: error }) : null] }), assets.length > 0 ? (_jsx(AdminTextInput, { label: t('cms.media.search', 'Search images'), placeholder: t('cms.media.searchPlaceholder', 'Filter by filename or alt text'), value: query, onChange: (e) => setQuery(e.target.value) })) : null] })), _jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: visibleAssets.map((asset) => (_jsxs("button", { type: "button", disabled: pending, className: "focus-ring grid gap-1 rounded-lg border border-border-subtle p-2 text-left", onClick: () => {
                            onSelect(asset.url, asset.alt);
                            onClose();
                        }, children: [_jsx("img", { src: asset.url, alt: asset.alt, className: "aspect-square w-full rounded object-cover", loading: "lazy" }), _jsx("span", { className: "truncate text-xs text-ink-muted", children: asset.filename })] }, asset.id))) }), loading ? _jsx("p", { className: "text-sm text-ink-muted", role: "status", children: t('cms.media.loading', 'Loading images…') }) : null, mediaApi && !loading && !loadError && assets.length === 0 ? (_jsx("p", { className: "text-sm text-ink-muted", children: t('cms.media.empty', 'No images yet. Upload one to add it to the library.') })) : null, normalizedQuery && visibleAssets.length === 0 ? (_jsx("p", { className: "text-sm text-ink-muted", role: "status", children: t('cms.media.noMatches', 'No images match this search.') })) : null] }) }));
}
