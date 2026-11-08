export async function streamMedia(key, media) {
    const object = await media.get(key);
    if (!object)
        return null;
    const headers = new Headers();
    if (object.contentType) {
        headers.set('Content-Type', object.contentType);
    }
    if (object.etag) {
        headers.set('ETag', object.etag);
    }
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return new Response(object.body, { headers });
}
