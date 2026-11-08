export function createR2MediaStore(getBucket) {
    return {
        async put(key, bytes, meta) {
            await getBucket().put(key, bytes, {
                httpMetadata: { contentType: meta.contentType },
            });
        },
        async get(key) {
            const object = await getBucket().get(key);
            if (!object)
                return null;
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            return {
                body: object.body,
                contentType: headers.get('Content-Type') ?? undefined,
                etag: object.httpEtag,
            };
        },
    };
}
