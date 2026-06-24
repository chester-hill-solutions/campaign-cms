import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const CmsUiContext = createContext({});
export function CmsUiProvider({ config, children, }) {
    return _jsx(CmsUiContext.Provider, { value: config, children: children });
}
export function useCmsUi() {
    return useContext(CmsUiContext);
}
