import * as React from 'react';
import { type AnalyticsConfig } from '@chester-hill-solutions/cms-core';
export type AnalyticsScriptsProps = {
    config: AnalyticsConfig;
};
export declare function AnalyticsScripts({ config }: AnalyticsScriptsProps): React.JSX.Element;
export declare function AnalyticsScriptsBody({ config }: AnalyticsScriptsProps): React.JSX.Element | null;
