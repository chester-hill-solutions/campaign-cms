import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const CmsUiContext = createContext({});
export function CmsUiProvider({ config, children, }) {
    return _jsx(CmsUiContext.Provider, { value: config, children: children });
}
export function useCmsUi() {
    return useContext(CmsUiContext);
}
export function useCmsTranslate() {
    const { translate } = useCmsUi();
    return (key, fallback, values) => translate?.(key, fallback, values) ?? fallback;
}
/** Stable fallback-derived key for reusable control labels and placeholders. */
export function cmsUiTextKey(fallback) {
    const slug = fallback.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `cms.ui.${slug || 'label'}`;
}
export function useCmsText() {
    const translate = useCmsTranslate();
    return (fallback, values) => {
        const translated = translate(cmsUiTextKey(fallback), fallback, values);
        if (translated !== fallback || !values)
            return translated;
        return fallback.replace(/\{\{(\w+)\}\}/g, (match, name) => Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match);
    };
}
