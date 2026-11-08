import type { CmsMediaStore } from './ports.js';
export declare function streamMedia(key: string, media: CmsMediaStore): Promise<Response | null>;
