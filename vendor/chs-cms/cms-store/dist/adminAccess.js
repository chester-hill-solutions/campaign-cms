function deny(message, status, challenge = false) {
    return new Response(message, {
        status,
        headers: {
            'Cache-Control': 'no-store',
            ...(challenge ? { 'WWW-Authenticate': 'Basic realm="CMS admin", charset="UTF-8"' } : {}),
        },
    });
}
/** Check every admin page, private server function and admin API before doing any work. */
export async function checkCmsAdminAccess(request, options) {
    const url = new URL(request.url);
    const local = options.localDevelopment === true && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    const username = options.username ?? 'admin';
    if (!local && (!options.password?.trim() || !username || /[:\r\n]/.test(username))) {
        return deny('Admin access is not configured.', 503);
    }
    if (!local && url.protocol !== 'https:')
        return deny('HTTPS is required.', 403);
    // Credentialed mutations must carry the site's exact origin, including in local mode.
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.headers.get('origin') !== url.origin) {
        return deny('Cross-origin admin requests are not allowed.', 403);
    }
    if (local)
        return null;
    let supplied = '';
    const authorization = request.headers.get('authorization') ?? '';
    if (/^Basic /i.test(authorization) && authorization.length <= 8192) {
        try {
            const bytes = Uint8Array.from(atob(authorization.slice(6)), (char) => char.charCodeAt(0));
            supplied = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
        catch { /* malformed credentials fail closed */ }
    }
    const encoder = new TextEncoder();
    const [actual, expected] = await Promise.all([
        crypto.subtle.digest('SHA-256', encoder.encode(supplied)),
        crypto.subtle.digest('SHA-256', encoder.encode(`${username}:${options.password}`)),
    ]);
    const a = new Uint8Array(actual);
    const b = new Uint8Array(expected);
    let mismatch = 0;
    for (let index = 0; index < a.length; index++)
        mismatch |= a[index] ^ b[index];
    return mismatch ? deny('Sign in to manage the site.', 401, true) : null;
}
