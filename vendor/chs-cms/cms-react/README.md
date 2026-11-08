# @chester-hill-solutions/cms-react

React UI for Campaign CMS: public block rendering and the admin page-builder canvas.

## Install

```bash
npm install @chester-hill-solutions/cms-react @chester-hill-solutions/cms-core
```

Peer dependencies: `react` ^19, `react-dom` ^19, `@tanstack/react-router`

Use a browser or SSR bundler for the public root export. Direct native Node ESM
imports currently fail on extensionless internal module paths; this package is
not part of the server packages' native Node runtime guarantee.

## Public rendering

```tsx
import { BlockRenderer, CmsUiProvider } from '@chester-hill-solutions/cms-react'

<CmsUiProvider config={{ heroFallbackPortrait: { src: '/portrait.webp', alt: '…' } }}>
  <BlockRenderer blocks={page.blocks} appBlocks={appBlocks} appContext={ctx} />
</CmsUiProvider>
```

Hosts with a responsive image manifest or image service can supply
`config.resolveImageAttributes(src, usage)` to return `width`, `height`, `srcSet`
and `sizes` for the existing URL. Usage is `hero`, `image`, `split`, `card` or
`icon`; return `undefined` for URLs the host does not manage. Block URLs, alt text
and loading policy remain owned by their existing fields and renderers. Explicit
hero portraits never inherit the fallback portrait's dimensions or source set.

## Admin editor

```tsx
import {
  BlockListSidebar,
  EditorCanvas,
  EditorTopBar,
  PageSettingsDrawer,
  useAutosave,
  useDocHistory,
  type BlockSelection,
} from '@chester-hill-solutions/cms-react'

const [selection, setSelection] = useState<BlockSelection | null>(null)

<BlockListSidebar
  content={page}
  selection={selection}
  onSelect={setSelection}
  onChange={setPage}
  errorsByBlock={errors}
/>
<EditorCanvas
  content={page}
  onChange={setPage}
  selectedId={selection?.blockId ?? null}
  onSelect={(id) => setSelection(id ? { blockId: id } : null)}
  onOpenSettings={openSettings}
  onDelete={deleteBlock}
  errorsByBlock={errors}
  appBlocks={appBlocks}
  appContext={ctx}
/>
```

Pass `appBlocks` (and optional `appContext`) so app blocks like contact forms and collection grids preview live on the canvas. Without them, those blocks show a placeholder.

Admin shells can also use `AdminOverview` and `SiteHealthSettingsPanel` for dogfood dashboards.

Wrap with `CmsUiProvider` including `mediaApi` for the media library.

`useDocHistory(initial)` records immutable document snapshots with up to 80 undo
steps. Edits within 600 ms of a group's first edit share one step. Undo, redo,
and `reset(next)` start a fresh group; reset also clears both history stacks.
Setting the same snapshot by `Object.is` is a no-op and preserves redo.

Version 0.6.2 fixes lost undo steps when React StrictMode replays queued updates,
including edits after a document load. History and coalescing timestamps now
advance together in pure state updates; the hook's public API is unchanged.

The shared media dialog filters uploaded assets by filename and alt text,
requires alternative text on upload, and reports library or upload failures.

`useImageUpload({ upload, translate })` supplies the same upload mechanics to
standalone media libraries and structured image fields. It accepts the host
media API, keeps the original image bytes (JPEG/PNG/WebP/GIF, up to 5 MB), guards
duplicate submissions, and preserves the chosen file and alt text on failure.
Its controls are unnamed so hosts may use it inside a draft form.
`uploadSelected()` returns the stored `CmsMediaItem` on success; the host chooses
whether to select it or refresh a library. `fileInputRef` clears the native file
control only after success. Hosts own UI primitives and upload/navigation state.

### Block catalog compatibility

`EditorTopBar.publishDisabled` blocks publication independently of an active request,
such as after a stale-revision conflict; `publishPending` is only for work in progress.
`cmsHeadingId(text)` is shared with `CmsMarkdownBody` heading IDs so host table-of-contents
links match public rich-text rendering.

`@chester-hill-solutions/cms-core` owns the shared block catalog. Keep
`ALL_BLOCK_TYPES`, its schemas, defaults, and generic renderers as a
cross-project superset; a consuming site should not remove blocks simply
because it does not use them yet. Generic blocks render without host code.
App blocks retain their data and settings in the editor and show a placeholder
until the host provides a renderer. Hosts should reject publishing an app block
that has no integration rather than silently dropping it. Add reusable block
capabilities to the shared packages, and keep product-specific behavior in the
host adapter.

### Localizing shared UI

The package does not depend on a localization framework. Hosts can pass a
`translate(key, fallback, values)` function through `CmsUiProvider`; the editor,
media picker, and reusable controls use that callback and fall back to English
when a key is not present. This keeps package UI translatable without coupling
consumers to i18next or another runtime.

Explicit editor messages use stable `cms.*` keys. Generic labels and
placeholders use `cmsUiTextKey(fallback)`, which normalizes the English fallback
to a `cms.ui.*` key. Keep that fallback unchanged when possible so host catalogs
remain stable. The default remains readable English when the host has not added
a translation yet.

### Reusable admin fields

Use the shared relationship picker for ordered links such as stops attached to a trip or businesses attached to a stop. Use the scope/target field for site-wide, tour, stop, or business notices, and the list field for ordered repeatable records such as sources or review items.

```tsx
import {
  AdminListField,
  AdminRelationshipField,
  AdminScopeTargetField,
} from '@chester-hill-solutions/cms-react'
```

These are controlled components. Hosts provide their domain options, labels, item editor, and persistence; the package supplies consistent search, ordering, add/remove, and accessible controls.

## Styles

```css
@import "@chester-hill-solutions/cms-react/styles/cms-tokens.css";
@source "../../node_modules/@chester-hill-solutions/cms-react/src";
```

Per-site tokens (from `store.getSiteTheme()`):

```tsx
import { ThemeStyle, ThemeSettingsPanel } from '@chester-hill-solutions/cms-react'

<head>
  <ThemeStyle theme={theme} />
</head>
```

See [Styling guide](../../docs/guides/styling.md).

## Exports overview

- **Rendering:** `BlockRenderer`, `CmsMarkdownBody`, block view components, `ThemeStyle`
- **Editing:** `EditorCanvas`, `BlockListSidebar`, `BlockChrome`, `InsertMenu`, `InlineRichTextEditor` (internal)
- **Admin:** `AdminOverview`, `SiteHealthSettingsPanel`, `ThemeSettingsPanel`, `AdminListField`, `AdminRelationshipField`, `AdminScopeTargetField`, form/collection panels
- **Context:** `CmsUiProvider`, `useCmsUi`, `CmsMediaApi`, `CmsMediaItem`, `CmsUiConfig`. The host returns resolved public `url` values so one picker can show both uploaded assets and built-in/static media without coupling the UI package to an R2 key format.
- **Primitives:** `AdminTextInput`, `AdminTextArea`, `AdminCheckbox`
- **Hooks:** `useAutosave`, `useDocHistory`
- **Types:** `BlockSelection`, `Viewport`, `AutosaveStatus`

## Tests

```bash
npm test --workspace @chester-hill-solutions/cms-react
```

Uses jsdom + `@testing-library/react`.

### Searchable relationships

`AdminRelationshipField` provides a searchable selector and an ordered list of linked records. The host owns its record schema and persistence; the field reports selected IDs and can serialize them as JSON in a form.

```tsx
<AdminRelationshipField
  label="Stops in this tour"
  name="stopIds"
  options={stops.map((stop) => ({ id: stop.id, label: stop.title, description: stop.slug }))}
  value={stopIds}
  onChange={setStopIds}
  hint="Choose stops and arrange them in itinerary order."
/>
```

Labels, placeholders, empty states, and action aria labels can be supplied by the host app, so the field works with localized admin interfaces. `AdminScopeTargetField` uses the same approach for records that can target a site or a specific entity:

```tsx
<AdminScopeTargetField
  label="Alert destination"
  scopeLabel="Show this alert on"
  scopes={[
    { value: 'site', label: 'Entire site' },
    { value: 'tour', label: 'One tour', targetLabel: 'Tour', targets: tours },
    { value: 'stop', label: 'One stop', targetLabel: 'Stop', targets: stops },
    { value: 'business', label: 'One business', targetLabel: 'Business', targets: businesses },
  ]}
  scope={scope}
  target={target}
  onScopeChange={setScope}
  onTargetChange={setTarget}
  searchable
  searchLabel="Find a destination"
  searchPlaceholder="Search tours, stops, or businesses"
/>
```

The CMS package provides the selection mechanics only. Scope values, target records, validation, persistence, and public rendering remain defined by the host app. Target search is optional and useful for large collections.

### Tags and small string lists

Use `AdminTagInput` for short editor-managed vocabularies such as topic tags. It supports comma or Enter to add, prevents case-insensitive duplicates, and reports the full value array to the host.

```tsx
<AdminTagInput
  label="Story tags"
  name="tags"
  value={tags}
  onChange={setTags}
  hint="Used to group related stories."
/>
```

The control serializes the array as JSON when `name` is supplied. The host owns the meaning and persistence of each tag.

### Block outline and settings

`BlockListSidebar` combines the reusable block catalog, sortable outline, nested-item selection, insertion menu, and block settings in one docked panel. It retains every shared content, layout, and app block in the insert menu. Set `showSettings={false}` when the application renders `BlockSettingsPanel` as a separate or floating inspector; the outline retains selection, insertion and ordering controls without duplicating settings.

Button settings retain both the label and link while either field is being
replaced. Incomplete buttons fail page validation rather than silently losing
their other fields. Use **Remove button** to remove an optional CTA explicitly.

`PageSettingsDrawer` uses a native modal dialog for keyboard focus containment,
Escape dismissal, and focus return. Hosts can supply `publicPath` when the actual
route differs from the slug-derived URL and `slugLocked` for fixed route records.
Enforce any slug restriction in the host's save and restore handlers as well.
Pass `revisionNotice` to show host-specific restoration guidance directly above
the revision list, including limits on history imported from older installations.

### Structured repeatable lists

`AdminListField` handles add, remove, reorder, item labels, and optional JSON form serialization. The host defines each item shape and its editor controls.

```tsx
<AdminListField
  label="Nearby businesses"
  itemLabel="Business"
  name="businesses"
  value={businesses}
  onChange={setBusinesses}
  createItem={() => ({ id: crypto.randomUUID(), name: '', website: '' })}
  getItemKey={(item) => item.id}
  getItemLabel={(item) => item.name}
  renderItem={({ item, onChange }) => (
    <AdminTextInput label="Name" value={item.name} onChange={(event) => onChange({ ...item, name: event.currentTarget.value })} />
  )}
/>
```

Relationship and structured-list reorder/remove actions use 44px targets. Relationship actions move below their record label on narrow screens; list actions occupy a separate row so long legends and item editors remain readable. Hosts should preserve these dimensions when theming admin fields.

### Known saved autosave baseline

Pass `initialSavedContent` to `useAutosave` when the initial document is already
persisted. Keep the host editor keyed by entry identity. Advance its revision
token only after a successful write, set `paused: true` on a revision conflict, and
call `markSaved`/reset history from an explicit restore or reload action. Loader
revalidation alone must not replace unsaved content.

## Built-in aggregate analytics

Use the site's existing CMS D1 binding through `createD1Analytics` and `createAnalyticsHandler` from `@chester-hill-solutions/cms-store-d1`. No analytics service account or external key is required. See that package's README for the POST route and authenticated reporting integration.

```tsx
import {
  BuiltinAnalyticsTracker,
  BuiltinAnalyticsPanel,
  type BuiltinAnalyticsData,
} from '@chester-hill-solutions/cms-react'

// Mount once in the site's public router shell; pass the current pathname.
<BuiltinAnalyticsTracker path={location.pathname} />

// On a protected admin screen, use the server's getSummary(7) or getSummary(30).
<BuiltinAnalyticsPanel data={summary satisfies BuiltinAnalyticsData} />
```

The tracker defaults to `/api/cms/analytics`; pass `endpoint` only when the host mounts another same-origin route. It records each public pathname navigation, including returning to a previously visited page. Repeated effects and query/hash changes do not create extra counts. Keep it mounted across client navigation so its per-mount deduplication state survives. Remounts and full reloads can count new page views. Admin, API, media, server-function and asset routes are skipped. The server must still validate that the path is published.

It uses a small beacon with a keepalive fetch fallback, honors Do Not Track, sends only a pathname and referrer origin, and introduces no cookies or visitor profiles. The first navigation uses `document.referrer` with its path/query removed; subsequent navigation is internal. Transport failures are best-effort and do not block navigation; a rejected beacon is not retried indefinitely. The reporting panel shows page views, daily counts, popular pages and referrer hosts, with an explicit empty state. It does not claim unique visitors.

The bounded navigation-state and server-rendered panel tests run without a DOM dependency:

```bash
bun test packages/cms-react/src/analytics/BuiltinAnalytics.test.tsx
```

These tests run with the existing Bun component suite under `src/` and use the same navigation state function as the tracker. They do not replace browser integration QA.

`BuiltinSiteHealthPanel` renders the report from `cms-store`'s `loadCmsHealth`. It displays
checks and links issues to the existing page editor, while making the audit's scope clear.

## Basic site settings

`SiteSettingsPanel` provides a controlled, accessible identity form using the existing media picker. Pass `settings`, `onChange`, `onSave`, `saving`, `dirty`, `error`, and `statusMessage`. Use the protected store settings methods in the host's route. `AdminLayout` accepts `settingsHref` and `activeSection="settings"`; the item remains hidden until that route is mounted.

Hosts must load public settings into the site shell and document head: site name/logo, footer tagline, favicon link, and search/sharing defaults. Page-specific SEO can override the defaults. Revalidate the host router after saving; no deployment is required.

## Standalone rich-text editing

`RichTextEditor` uses the page builder's existing markdown editor outside a
block canvas. It is controlled through `value` and `onChange`, lazy-loads the
editing engine, and accepts an accessible `label`, `disabled`, and
`toolbar="inline"` for a persistent formatting toolbar. The default toolbar
remains floating for existing canvas consumers.

Render the saved string with `CmsMarkdownBody`; formatting stays within the
same supported markdown subset. The host owns form serialization, validation,
and preview controls.
