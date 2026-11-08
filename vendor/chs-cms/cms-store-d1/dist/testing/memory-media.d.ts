/**
 * An in-memory R2 bucket, for the media path only.
 *
 * ## This is still a double, and it is not the same defect
 *
 * The mock #99 removed was a fake **database**: it pattern-matched SQL substrings and
 * never executed a query, so a suite asserting on it proved the mock was
 * self-consistent. Object storage is a different kind of boundary — R2 has no local
 * emulator in this repository, and there is no SQL to execute against — so a double is
 * the only option short of running a real R2 in CI.
 *
 * What this double does cover: key selection, byte round-tripping, and
 * `writeHttpMetadata`. What it does not cover: R2's own semantics, multipart uploads, or
 * its consistency model. A conformance suite green against this says the media adapter's
 * code path runs, which is worth having and is not the same as saying the media
 * integration is correct.
 *
 * It is kept in its own file, separate from the database shim, so that "the D1 suite runs
 * against a double" cannot be read as "the D1 suite runs against a fake query engine".
 */
export type InMemoryR2Bucket = {
    put(key: string, bytes: ArrayBuffer, options?: {
        httpMetadata?: Record<string, string>;
    }): Promise<unknown>;
    get(key: string): Promise<{
        body: ReadableStream;
        httpEtag: string;
        writeHttpMetadata(headers: Headers): void;
    } | null>;
};
export declare function createInMemoryR2Bucket(): InMemoryR2Bucket;
