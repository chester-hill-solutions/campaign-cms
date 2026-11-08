import type { expect as bunExpect, test as bunTest } from 'bun:test';
import type { CmsDomainStore, DomainStoreConfig } from '../domainStore.js';
/**
 * The behaviour every `CmsDomainPersistence` adapter must show through
 * `createDomainStore`.
 *
 * Written once and run against each adapter, for the reason the page store's
 * conformance suite exists: three adapters with three hand-written suites agree
 * on whatever each of them happened to test, and disagree on everything else. The
 * memory adapter runs this to define the behaviour; the D1 and Postgres adapters
 * run it to prove they match. A scenario that only one adapter can pass is a
 * scenario about that adapter, and belongs in that adapter's own test file.
 *
 * `createStore` must return a store over a **fresh, empty** database each call, and
 * accept config overrides so a scenario can tighten one hook.
 */
/** The payload shape these scenarios use. Deliberately not a tour. */
export type ConformancePayload = {
    title: string;
    trip?: string;
};
export type ConformanceStoreFactory = (overrides?: Partial<DomainStoreConfig<ConformancePayload>>) => CmsDomainStore<ConformancePayload>;
/**
 * The config under test: two content types, a dependency rule and a publication
 * check. The dependency stands in for the host-owned rules (a stop needs its tour)
 * without pulling tour domain knowledge into the store's package.
 */
export declare function domainConformanceConfig(overrides?: Partial<DomainStoreConfig<ConformancePayload>>): DomainStoreConfig<ConformancePayload>;
export declare function runDomainStoreConformance(createStore: ConformanceStoreFactory, harness: {
    test: typeof bunTest;
    expect: typeof bunExpect;
}): void;
