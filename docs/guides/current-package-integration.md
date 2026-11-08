# Current CMS package integration

This harness consumes six checked-in canonical artifacts: core 0.8.1, react 0.9.1,
store 0.10.1, store-d1 0.10.0, agent 0.6.0 and setup 0.6.0. Exact source/tarball/file
hashes and the recorded sibling dependency rewrites are in
[`vendor/chs-cms/provenance.json`](../../vendor/chs-cms/provenance.json).

The source snapshot is b0e82399081cf1b52f7d23456cdb2de637f21163; the six CMS package
trees match the originally selected e35f6d857e5fac5171fa6645d95da843e28e859a. The
libraries are immutable artifacts here; changes belong in canonical source. Run
`npm run check:vendor` to validate the installed snapshot. Installation may add
ignored node_modules inside local packages; those are not source artifacts.

## Installation and release boundary

The examples and root overrides use local file dependencies. No private registry
target or package publication is required to install this harness. The CMS update
requires Zod ^4.6.7 and core's htmlparser2 ^12 dependency closure; other compatible
external versions remain locked. The harness does not publish CMS packages.

The old cms-server package has been removed. D1/R2 hosts import
`createCmsStoreD1` from `@chester-hill-solutions/cms-store-d1`; shared types and
revision errors come from `@chester-hill-solutions/cms-store`. Bindings are lazy.
Both editor and agent stores preserve the example's parse/default-page/slug policy;
agent-created revisions still record `created_by: agent`.

## Editor and publication

Load `state.entry.draft_revision_id` together with the draft content. Send it as
`expectedDraftRevisionId` on save and publish. Only a successful save advances that
editor's guard to the returned revisionId. Null means no draft yet; a missing guard
is invalid. Metadata refresh after publication does not authorize overwriting a
newer draft. Conflicts retain local edits, pause autosave and disable Publish until
the user explicitly reloads and discards local changes.

Public URLs follow the published payload, not the draft slug. The host's public
page link therefore uses state.published.slug. Canvas and settings selection now
use structured BlockSelection and reconcile selection after content/history changes.

## Schema and local seed

Applied migrations 0001 and 0002 are retained. Added canonical migrations 0003–0009
provide taxonomy/forms/settings, immutable listing snapshots, localization/domain
content and the form rate-limit index. Migration 0007 backfills the provable current
snapshot, then refuses new revisions without a complete listing snapshot. The local
About seed includes its empty listing snapshot and validates the payload first.

Run `npm run example:setup` before `npm run example:seed`; both target local D1.
Tests exercise the same migrations/seed against isolated real Workers D1/R2.
For any real deployment, an operator must back up the database and coordinate the
schema/code rollout. Old writers are incompatible after the snapshot migration;
reverting code alone is not a database rollback. This dependency refresh performs
no live migration, provisioning or deployment.

The existing minimal-site agent kill switch remains off by default. It is a local
demo policy, not production authentication; a real host supplies its own access
control and publication approval. No product role vocabulary is invented here.
