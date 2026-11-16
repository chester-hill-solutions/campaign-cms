/** Content checks are distinct from live HTTP crawling or Lighthouse measurements. */
export function analyzeCmsHealth(pages, options) {
    const visible = pages.filter((page) => page.payload.enabled === 1);
    const publicPaths = new Set(visible.map(({ payload }) => payload.slug ? `/${payload.slug.replace(/^\/+|\/+$/g, '')}` : '/'));
    publicPaths.add('/robots.txt');
    publicPaths.add('/sitemap.xml');
    const media = new Set(options.mediaPaths ?? []);
    const assets = options.staticAssetPaths ? new Set(options.staticAssetPaths) : null;
    const issues = [];
    let uncheckedImages = 0;
    for (const { entryId, payload } of visible) {
        const add = (kind, message) => {
            if (!issues.some((issue) => issue.entryId === entryId && issue.kind === kind && issue.message === message))
                issues.push({ kind, entryId, title: payload.title, message });
        };
        if (!payload.seoTitle?.trim() && !payload.title.trim())
            add('metadata', 'Missing search title');
        if (!payload.seoDescription?.trim() && !payload.dek?.trim())
            add('metadata', 'Missing search description');
        function reference(raw, image) {
            if (!raw || raw.startsWith('#') || /^(mailto:|tel:|data:)/i.test(raw))
                return;
            let url;
            try {
                url = new URL(raw, `${options.publicOrigin}/${payload.slug}`);
            }
            catch {
                add(image ? 'image' : 'link', `Invalid reference: ${raw}`);
                return;
            }
            if (url.origin !== new URL(options.publicOrigin).origin) {
                if (image)
                    uncheckedImages++;
                return;
            }
            const path = url.pathname.replace(/\/$/, '') || '/';
            if (image) {
                if (path.startsWith('/media/')) {
                    if (!media.has(path))
                        add('image', `Image is absent from the media library: ${path}`);
                }
                else if (assets) {
                    if (!assets.has(path))
                        add('image', `Image is absent from site assets: ${path}`);
                }
                else
                    uncheckedImages++;
            }
            else if (!publicPaths.has(path) && !media.has(path) && !assets?.has(path))
                add('link', `Internal link has no published destination: ${path}`);
        }
        function walk(value) {
            if (!value || typeof value !== 'object')
                return;
            for (const [key, item] of Object.entries(value)) {
                if (typeof item === 'string') {
                    if (key === 'href')
                        reference(item, false);
                    if (['src', 'portraitSrc', 'imageSrc', 'imagePath', 'ogImagePath', 'mediaPath', 'thumbnail'].includes(key))
                        reference(item, true);
                    if (key === 'markdown') {
                        for (const match of item.matchAll(/(!?)\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g))
                            reference(match[2].replace(/^<|>$/g, ''), match[1] === '!');
                    }
                }
                else
                    walk(item);
            }
        }
        walk(payload);
    }
    const check = (kind, label, detail) => {
        const count = issues.filter((issue) => issue.kind === kind).length;
        return { label, status: count ? 'warning' : 'pass', detail: count ? `${count} issue${count === 1 ? '' : 's'} found` : detail };
    };
    const checks = [
        { label: 'Published content', status: visible.length ? 'pass' : 'warning', detail: `${visible.length} visible published pages checked` },
        check('metadata', 'Search metadata', 'Visible pages have search titles and descriptions'),
        check('link', 'Internal links', 'Page destinations match published content'),
        check('image', 'Image references', `References match the CMS library and known site assets${uncheckedImages ? `; ${uncheckedImages} external or unregistered images not checked` : ''}`),
    ];
    if (options.contactEmailConfigured !== undefined)
        checks.push({ label: 'Contact email', status: options.contactEmailConfigured ? 'pass' : 'warning', detail: options.contactEmailConfigured ? 'Sending credentials configured; delivery has not been tested' : 'Sending credentials not configured' });
    if (options.adminProtected !== undefined)
        checks.push({ label: 'Admin access', status: options.adminProtected ? 'pass' : 'warning', detail: options.adminProtected ? 'Owner access configured' : 'Owner access not configured' });
    return { checkedAt: new Date().toISOString(), pagesChecked: visible.length, checks, issues };
}
export async function loadCmsHealth(store, options) {
    const [entries, media] = await Promise.all([store.listContentEntries(), store.listMediaAssets(1000)]);
    const pages = [];
    for (const entry of entries.filter((row) => row.type === 'page_doc')) {
        const payload = await store.getPublishedPageDoc(entry.id);
        if (payload)
            pages.push({ entryId: entry.id, payload });
    }
    return analyzeCmsHealth(pages, { ...options, mediaPaths: media.map((asset) => `/media/${asset.r2_key}`) });
}
