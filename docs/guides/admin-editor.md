# Admin editor

The page builder UI lives in `@campaign/cms-react`. The host provides routes, authentication, and server functions.

## Components

| Component | Role |
|-----------|------|
| `EditorCanvas` | Drag-and-drop block list, inline editing, insert menu |
| `EditorTopBar` | Title, save status, undo/redo, viewport toggle, publish |
| `BlockSettingsPanel` | Floating panel for selected block settings |
| `PageSettingsDrawer` | Slug, SEO, nav, enabled, revision history |
| `useAutosave` | Debounced draft saves |
| `useDocHistory` | Undo/redo stack |

## Editor route skeleton

```tsx
import {
  CmsUiProvider,
  EditorCanvas,
  EditorTopBar,
  BlockSettingsPanel,
  PageSettingsDrawer,
  useAutosave,
  useDocHistory,
} from '@campaign/cms-react'
import { validatePageDoc, updateBlockInPage, removeBlockFromPage } from '@campaign/cms-core'
import { cmsUiConfig } from '../lib/cms/cmsUi'
import { adminCmsMediaApi } from '../components/admin/cmsMediaApi'

export function AdminPageEditor({ entryId }: { entryId: string }) {
  const [state, setState] = useState<EditorState | null>(null)
  // load getPageDocEditorState(entryId) on mount …

  const { content, pushHistory, undo, redo, canUndo, canRedo } = useDocHistory(initialContent)
  const { status, markDirty, saveNow } = useAutosave({
    onSave: (payload) => adminSavePageDocFn({ data: { entryId, payload, csrfToken } }),
  })

  return (
    <CmsUiProvider config={{ ...cmsUiConfig, mediaApi: adminCmsMediaApi }}>
      <EditorTopBar
        title={content.title}
        meta={state.meta}
        saveStatus={status}
        onPublish={() => adminPublishFn({ data: { entryId, csrfToken } })}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <EditorCanvas
        content={content}
        onChange={(next) => { pushHistory(next); markDirty() }}
        onUpdateBlock={(id, block) => onChange(updateBlockInPage(content, id, block))}
        onRemoveBlock={(id) => onChange(removeBlockFromPage(content, id))}
        validation={validatePageDoc({ ...content, kind: 'pageDoc', version: 1 })}
      />
      <BlockSettingsPanel /* selected block + onUpdate */ />
      <PageSettingsDrawer /* SEO, slug, revisions */ />
    </CmsUiProvider>
  )
}
```

## Media API

`MediaPicker` requires `CmsMediaApi`:

```ts
export const adminCmsMediaApi: CmsMediaApi = {
  list: async () => {
    const res = await adminListMediaFn()
    return res.ok ? res.assets : []
  },
  upload: async (input) => {
    const boot = await adminBootstrapFn()
    if (!boot.authenticated || !boot.csrfToken) {
      return { ok: false, error: 'Not signed in' }
    }
    return adminUploadMediaFn({ data: { csrfToken: boot.csrfToken, ...input } })
  },
}
```

## Authentication

Campaign CMS intentionally does not ship admin auth. Before any mutating server function:

1. Verify session cookie
2. Validate CSRF token (recommended for cookie-based auth)
3. Call store method

The [minimal-site example](../../examples/minimal-site/) omits auth for clarity — **do not deploy that pattern to production**.

## App blocks in the editor

App blocks (`contactForm`, `eventsList`, …) render as placeholders in the canvas. They show the block label and a note that the live component renders on the public site. Register real views only in `BlockRenderer.appBlocks`.

## Validation

Call `validatePageDoc` before publish. It returns field-level errors mapped to block ids. The canvas highlights invalid blocks.

## Viewport preview

`EditorTopBar` supports `desktop` / `tablet` / `mobile` viewport modes. Blocks use container queries (`@sm`, `@md`) — not viewport breakpoints — so preview stays accurate inside the narrow admin frame.
