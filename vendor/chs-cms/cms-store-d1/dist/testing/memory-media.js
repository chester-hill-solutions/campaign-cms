export function createInMemoryR2Bucket() {
    const objects = new Map();
    return {
        async put(key, bytes, options) {
            objects.set(key, { bytes, httpMetadata: options?.httpMetadata ?? {} });
            return {};
        },
        async get(key) {
            const obj = objects.get(key);
            if (!obj)
                return null;
            return {
                body: new ReadableStream({
                    start(controller) {
                        controller.enqueue(new Uint8Array(obj.bytes));
                        controller.close();
                    },
                }),
                httpEtag: `"${key}"`,
                writeHttpMetadata(headers) {
                    for (const [k, v] of Object.entries(obj.httpMetadata)) {
                        headers.set(k, v);
                    }
                },
            };
        },
    };
}
