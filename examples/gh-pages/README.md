# GitHub Pages demo

Browser-based page builder demo — the real `EditorCanvas`, settings panel, and autosave UI from `@chester-hill-solutions/cms-react`. Drafts persist in `localStorage` (no D1, no server).

## Local dev

From the repo root:

```bash
npm install
npm run example:pages:dev
# → http://localhost:3002
```

## Production build (GitHub Pages)

Project pages are served under `/campaign-cms/`:

```bash
VITE_BASE=/campaign-cms/ npm run build -w campaign-cms-gh-pages
npm run preview -w campaign-cms-gh-pages
# → http://localhost:3002/campaign-cms/
```

**Publish** in the demo copies the draft to a second `localStorage` key. Open the external-link icon (or `?view=preview`) to see that published snapshot.

Pushes to `main` deploy automatically via [`.github/workflows/gh-pages.yml`](../../.github/workflows/gh-pages.yml).

**One-time repo setup:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
