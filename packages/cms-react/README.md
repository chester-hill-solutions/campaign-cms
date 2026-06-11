# @campaign/cms-react

React UI for Campaign CMS: public block rendering and the admin page-builder canvas.

## Install

```bash
npm install @campaign/cms-react @campaign/cms-core
```

Peer dependencies: `react` ^19, `react-dom` ^19, `@tanstack/react-router`

## Public rendering

```tsx
import { BlockRenderer, CmsUiProvider } from '@campaign/cms-react'

<CmsUiProvider config={{ heroFallbackPortrait: { src: '/portrait.webp', alt: '…' } }}>
  <BlockRenderer blocks={page.blocks} appBlocks={appBlocks} appContext={ctx} />
</CmsUiProvider>
```

## Admin editor

```tsx
import {
  EditorCanvas,
  EditorTopBar,
  BlockSettingsPanel,
  PageSettingsDrawer,
  useAutosave,
  useDocHistory,
} from '@campaign/cms-react'
```

Wrap with `CmsUiProvider` including `mediaApi` for the media library.

## Styles

```css
@import "@campaign/cms-react/styles/cms-tokens.css";
@source "../../node_modules/@campaign/cms-react/src";
```

See [Styling guide](../../docs/guides/styling.md).

## Exports overview

- **Rendering:** `BlockRenderer`, `CmsMarkdownBody`, block view components
- **Editing:** `EditorCanvas`, `BlockChrome`, `InsertMenu`, `InlineRichTextEditor` (internal)
- **Context:** `CmsUiProvider`, `useCmsUi`, `CmsMediaApi`, `CmsUiConfig`
- **Primitives:** `AdminTextInput`, `AdminTextArea`, `AdminCheckbox`
- **Hooks:** `useAutosave`, `useDocHistory`

## Tests

```bash
npm test --workspace @campaign/cms-react
```

Uses jsdom + `@testing-library/react`.
