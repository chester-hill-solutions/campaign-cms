/** A stale editor must retain its local work and explicitly load the latest draft. */
export class CmsRevisionConflictError extends Error {
    constructor() {
        super('This draft has changed since you opened it.');
        this.name = 'CmsRevisionConflictError';
    }
}
export function assertCmsRevision(expected, current) {
    if (expected === undefined || expected !== current)
        throw new CmsRevisionConflictError();
}
