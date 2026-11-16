const commonBot = /bot|crawler|spider|headless|slurp|facebookexternalhit/i;
function assertSuccess(result, operation) {
    if (result.success === false)
        throw new Error(`Analytics ${operation} failed`);
}
const initialized = new WeakMap();
const table = `CREATE TABLE IF NOT EXISTS cms_analytics_daily (
  day TEXT NOT NULL, path TEXT NOT NULL, referrer TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day,path,referrer)
)`;
async function ready(db) {
    let pending = initialized.get(db);
    if (!pending) {
        pending = db.prepare(table).run().then((result) => {
            assertSuccess(result, 'schema initialization');
        });
        initialized.set(db, pending);
        pending.catch(() => initialized.delete(db));
    }
    return pending;
}
export function analyticsPath(raw) {
    if (!raw.startsWith('/') || raw.startsWith('//'))
        return null;
    const path = raw.split(/[?#]/)[0];
    if (path.length > 300 || /[\\\x00-\x1f\x7f]/.test(path) || /^\/(admin|api|media|_serverFn|assets)(\/|$)/.test(path))
        return null;
    return path.replace(/\/$/, '') || '/';
}
export function analyticsReferrer(raw, siteOrigin) {
    if (!raw)
        return 'Direct';
    try {
        const url = new URL(raw);
        if (!['https:', 'http:'].includes(url.protocol))
            return 'Direct';
        return url.origin === new URL(siteOrigin).origin ? 'Internal' : url.hostname.slice(0, 200);
    }
    catch {
        return 'Direct';
    }
}
export function createD1Analytics(getDatabase) {
    async function recordPageView(input) {
        const path = analyticsPath(input.path);
        if (!path)
            return false;
        const db = getDatabase();
        await ready(db);
        const day = new Date().toISOString().slice(0, 10);
        const result = await db.prepare(`INSERT INTO cms_analytics_daily (day,path,referrer,views) VALUES (?,?,?,1)
      ON CONFLICT(day,path,referrer) DO UPDATE SET views=views+1`)
            .bind(day, path, analyticsReferrer(input.referrer ?? '', input.siteOrigin)).run();
        assertSuccess(result, 'write');
        return true;
    }
    async function getSummary(days = 7) {
        const count = days === 30 ? 30 : 7;
        const db = getDatabase();
        await ready(db);
        // Retain aggregates for 90 days; there are no individual visitor records.
        const now = new Date();
        const since = new Date(now.getTime() - (count - 1) * 86400000).toISOString().slice(0, 10);
        const until = now.toISOString().slice(0, 10);
        const cutoff = new Date(now.getTime() - 89 * 86400000).toISOString().slice(0, 10);
        assertSuccess(await db.prepare('DELETE FROM cms_analytics_daily WHERE day < ?').bind(cutoff).run(), 'retention cleanup');
        const [daily, pages, referrers] = await db.batch([
            db.prepare('SELECT day,SUM(views) AS views FROM cms_analytics_daily WHERE day BETWEEN ? AND ? GROUP BY day ORDER BY day').bind(since, until),
            db.prepare('SELECT path,SUM(views) AS views FROM cms_analytics_daily WHERE day BETWEEN ? AND ? GROUP BY path ORDER BY views DESC,path LIMIT 10').bind(since, until),
            db.prepare("SELECT referrer AS host,SUM(views) AS views FROM cms_analytics_daily WHERE day BETWEEN ? AND ? AND referrer <> 'Internal' GROUP BY referrer ORDER BY views DESC,host LIMIT 10").bind(since, until),
        ]);
        for (const result of [daily, pages, referrers])
            assertSuccess(result, 'summary query');
        const counts = new Map(daily.results.map((row) => [row.day, row.views]));
        const series = Array.from({ length: count }, (_, index) => {
            const day = new Date(now.getTime() - (count - 1 - index) * 86400000).toISOString().slice(0, 10);
            return { day, views: counts.get(day) ?? 0 };
        });
        return { days: count, totalPageViews: series.reduce((sum, row) => sum + row.views, 0), daily: series,
            pages: pages.results, referrers: referrers.results };
    }
    return { recordPageView, getSummary };
}
/** Same-origin ingestion; only the host's public pages are accepted. Never a reporting endpoint. */
export function createAnalyticsHandler(options) {
    return async (request) => {
        const url = new URL(request.url);
        if (request.method !== 'POST')
            return new Response(null, { status: 405 });
        if (request.headers.get('origin') !== url.origin)
            return new Response(null, { status: 403 });
        if (request.headers.get('dnt') === '1' || (options.isBot ?? ((agent) => commonBot.test(agent)))(request.headers.get('user-agent') ?? ''))
            return new Response(null, { status: 204 });
        if (!request.body)
            return new Response(null, { status: 400 });
        const reader = request.body.getReader();
        const chunks = [];
        let size = 0;
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            size += value.length;
            if (size > 2048) {
                await reader.cancel();
                return new Response(null, { status: 413 });
            }
            chunks.push(value);
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.length;
        }
        let payload;
        try {
            payload = JSON.parse(new TextDecoder().decode(bytes));
        }
        catch {
            return new Response(null, { status: 400 });
        }
        if (!payload || typeof payload.path !== 'string' || (payload.referrer != null && typeof payload.referrer !== 'string'))
            return new Response(null, { status: 400 });
        const path = analyticsPath(payload.path);
        if (!path || !(await options.isPublicPath(path)))
            return new Response(null, { status: 204 });
        await options.analytics.recordPageView({ path, referrer: typeof payload.referrer === 'string' ? payload.referrer : undefined, siteOrigin: url.origin });
        return new Response(null, { status: 204 });
    };
}
