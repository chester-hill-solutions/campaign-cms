import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { encodeJsStringLiteral, } from '@chester-hill-solutions/cms-core';
function CustomScriptTag({ script }) {
    if (script.src) {
        return (_jsx("script", { id: script.id, src: script.src, async: script.loadMode === 'async', defer: script.loadMode === 'defer', "data-label": script.label }, script.id));
    }
    if (script.inlineScript) {
        return (_jsx("script", { id: script.id, "data-label": script.label, dangerouslySetInnerHTML: { __html: script.inlineScript } }, script.id));
    }
    return null;
}
export function AnalyticsScripts({ config }) {
    const headScripts = [];
    const bodyScripts = [];
    if (config.cloudflare.enabled && config.cloudflare.siteTag) {
        const beacon = JSON.stringify({ token: config.cloudflare.siteTag });
        const script = (_jsx("script", { defer: true, src: "https://static.cloudflareinsights.com/beacon.min.js", "data-cf-beacon": beacon }, "cloudflare-analytics"));
        headScripts.push(script);
    }
    if (config.ga4.enabled && config.ga4.trackingId) {
        const trackingId = config.ga4.trackingId;
        // The tracking id is a JavaScript string literal, so it is encoded as one. Interpolated
        // raw it would close the argument and append a statement.
        const ga4Inline = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ${encodeJsStringLiteral(trackingId)});
    `;
        headScripts.push(_jsx("script", { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}` }, "ga4-script"), _jsx("script", { dangerouslySetInnerHTML: { __html: ga4Inline } }, "ga4-inline"));
    }
    if (config.gtm.enabled && config.gtm.containerId) {
        const containerId = config.gtm.containerId;
        const gtmInline = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${encodeJsStringLiteral(containerId)});`;
        headScripts.push(_jsx("script", { dangerouslySetInnerHTML: { __html: gtmInline } }, "gtm-inline"));
    }
    for (const script of config.customScripts) {
        const target = script.position === 'body_end' ? bodyScripts : headScripts;
        target.push(_jsx(CustomScriptTag, { script: script }, script.id));
    }
    return (_jsxs(_Fragment, { children: [headScripts.length > 0 ? _jsx(_Fragment, { children: headScripts }) : null, bodyScripts.length > 0 ? _jsx(_Fragment, { children: bodyScripts }) : null] }));
}
export function AnalyticsScriptsBody({ config }) {
    if (!config.gtm.enabled || !config.gtm.containerId) {
        return null;
    }
    return (_jsx("noscript", { children: _jsx("iframe", { src: `https://www.googletagmanager.com/ns.html?id=${config.gtm.containerId}`, height: "0", width: "0", style: { display: 'none', visibility: 'hidden' }, title: "gtm" }) }));
}
