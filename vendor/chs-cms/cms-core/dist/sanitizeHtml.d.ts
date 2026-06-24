/**
 * Sanitizes admin-authored custom HTML before public render.
 * Strips scripts, inline event handlers, and javascript: URLs.
 */
export declare function sanitizeCustomHtml(html: string): string;
