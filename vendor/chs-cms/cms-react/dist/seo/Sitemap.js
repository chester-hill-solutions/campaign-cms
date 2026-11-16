export function generateSitemapXml({ baseUrl, entries, }) {
    const base = baseUrl.replace(/\/+$/, '');
    const lines = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ];
    for (const entry of entries) {
        if (entry.noindex)
            continue;
        const slug = entry.slug.replace(/^\/+/g, '');
        const loc = slug === '' ? `${base}/` : `${base}/${slug}`;
        const lastMod = entry.publishedAt || entry.updatedAt;
        const changefreq = slug === '' ? 'weekly' : 'monthly';
        const priority = slug === '' ? '1.0' : '0.8';
        lines.push(`  <url>`);
        lines.push(`    <loc>${escapeXml(loc)}</loc>`);
        if (lastMod) {
            lines.push(`    <lastmod>${escapeXml(lastMod.slice(0, 10))}</lastmod>`);
        }
        lines.push(`    <changefreq>${changefreq}</changefreq>`);
        lines.push(`    <priority>${priority}</priority>`);
        lines.push(`  </url>`);
    }
    lines.push(`</urlset>`);
    return lines.join('\n');
}
export function generateRobotsTxt({ baseUrl, sitemapPath, }) {
    const path = sitemapPath
        ? sitemapPath.startsWith('/')
            ? sitemapPath
            : `/${sitemapPath}`
        : '/sitemap.xml';
    return `User-agent: *\nAllow: /\nSitemap: ${baseUrl.replace(/\/+$/, '')}${path}`;
}
function escapeXml(value) {
    return value.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case "'":
                return '&apos;';
            case '"':
                return '&quot;';
            default:
                return c;
        }
    });
}
