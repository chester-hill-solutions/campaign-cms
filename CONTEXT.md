# CONTEXT.md — domain model

The shared language of this codebase. Use these terms precisely.

## Content model

- **Entry** (`content_entries` row): one piece of content, e.g. a page. Identified by `entryId` (convention: `page-{slug}`). Carries two revision pointers: `draft_revision_id` and `published_revision_id`.
- **Revision** (`content_revisions` row): an immutable snapshot of an entry's payload, with `version`, `created_at`, `created_by` (audit author — `admin`, `agent`, …), and `message` (audit note — agent writes use `agent:{toolName}`).
- **Draft / publish model:** all edits create a new revision and move `draft_revision_id` forward. Nothing is visible publicly until `publishEntry` copies the draft pointer into `published_revision_id`. Publishing never destroys history; `restoreRevisionAsDraft` rolls the draft back to any prior revision.
- **Listing snapshot:** every revision includes immutable collection/tag metadata. Publication exposes that revision snapshot and payload; draft metadata and draft slugs do not change public listings or URLs.
- **PageDoc payload:** `{ kind: 'pageDoc', version: 1, slug, title, enabled, showInNav, navLabel, seo*, blocks[] }`. `PageMeta` is the payload without the `kind`/`version` envelope (the editable shape).
- **Block:** discriminated-union member of `pageBlockSchema` (typed layout / content / app variants). All blocks share `id`, `type`, `layout`. App blocks (`contactForm`, `eventsList`, …) are rendered by the host, not by `cms-react`.
- **Media asset** (`media_assets` row + R2 object): uploaded image, served at `/media/{r2_key}`.

## Agent layer

- **Tool:** a semantic operation (`add_block`, `publish_page`, …) defined in `@chester-hill-solutions/cms-agent`. Tools validate input with Zod, enforce auth hooks, and return `ToolResult` — they never throw.
- **Write pipeline:** every mutating tool runs fresh-load → concurrency check → pure mutation → full-page validation → save (`applyDraftMutation` in `pipeline.ts`).
- **Optimistic concurrency:** editor saves/publishes require the opened `expectedDraftRevisionId`. The agent pipeline also guards its freshly loaded draft, and a supplied stale caller revision fails with `CONFLICT`. A conflict preserves local editor content; it never silently advances the guard.

## Error taxonomy

| Code | Meaning |
|------|---------|
| `NOT_FOUND` | Entry, block, revision, media, or tool does not exist |
| `VALIDATION` | Tool input or page content failed schema validation (`fieldErrors` lists specifics) |
| `CONFLICT` | Slug already taken, or draft moved under the caller |
| `FORBIDDEN` | Host auth hook (`assertCanRead` / `assertCanMutate`) denied the call |
| `PRECONDITION` | Operation invalid in the current state (publish with no draft, remove last block) |
| `INTERNAL` | Unexpected failure; `retryable: true` |

Full integrator guidance: [docs/guides/agent-api.md](./docs/guides/agent-api.md).
