import { type AnalyticsConfig } from '@chester-hill-solutions/cms-core';
export type AnalyticsWindow = Window & {
    gtag?: (command: 'event', name: string, data?: Record<string, unknown>) => void;
    dataLayer?: Array<Record<string, unknown>>;
    __cfBeacon?: {
        token?: string;
        sendEvent?: (name: string, data?: Record<string, unknown>) => void;
    };
};
export declare function setAnalyticsConfigOnWindow(config: AnalyticsConfig): void;
export declare function getAnalyticsConfigFromWindow(): AnalyticsConfig | undefined;
export declare function trackEvent(name: string, data?: Record<string, unknown>): void;
