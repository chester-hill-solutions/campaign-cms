import { createD1Analytics } from './builtin-analytics.js';
import { createCmsStore, } from '@chester-hill-solutions/cms-store';
import { createD1Persistence } from './d1-persistence.js';
import { createD1DomainPersistence } from './d1-domain-persistence.js';
import { createR2MediaStore } from './r2-media.js';
export function createCmsStoreD1(getBindings, config) {
    return Object.assign(createCmsStore(() => {
        const bindings = getBindings();
        return {
            db: createD1Persistence(() => bindings.db),
            domain: createD1DomainPersistence(() => bindings.db),
            media: bindings.media ? createR2MediaStore(() => bindings.media) : undefined,
        };
    }, config), { analytics: createD1Analytics(() => getBindings().db) });
}
export { createD1Persistence } from './d1-persistence.js';
export { createD1DomainPersistence } from './d1-domain-persistence.js';
export { createR2MediaStore } from './r2-media.js';
export { createD1Analytics, createAnalyticsHandler, analyticsPath, analyticsReferrer } from './builtin-analytics.js';
