import { defaultAnalyticsConfig } from '@chester-hill-solutions/cms-core';
const GLOBAL_KEY = '__cmsAnalyticsConfig';
export function setAnalyticsConfigOnWindow(config) {
    if (typeof window === 'undefined')
        return;
    window[GLOBAL_KEY] = config;
}
export function getAnalyticsConfigFromWindow() {
    if (typeof window === 'undefined')
        return undefined;
    return window[GLOBAL_KEY];
}
export function trackEvent(name, data) {
    if (typeof window === 'undefined')
        return;
    const win = window;
    const config = getAnalyticsConfigFromWindow() ?? defaultAnalyticsConfig;
    if (config.cloudflare.enabled && config.cloudflare.siteTag) {
        const beacon = win.__cfBeacon;
        if (beacon?.sendEvent) {
            beacon.sendEvent(name, data);
        }
    }
    if (config.ga4.enabled && config.ga4.trackingId && win.gtag) {
        win.gtag('event', name, data);
    }
    if (config.gtm.enabled && config.gtm.containerId && win.dataLayer) {
        win.dataLayer.push({ event: name, ...data });
    }
}
