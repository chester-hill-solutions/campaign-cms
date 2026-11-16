/** A stale editor must retain its local work and explicitly load the latest draft. */
export declare class CmsRevisionConflictError extends Error {
    constructor();
}
export declare function assertCmsRevision(expected: string | null, current: string | null): void;
