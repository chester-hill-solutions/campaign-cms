# GitHub Pages demo

Static SPA that renders the seeded campaign About page with `@campaign/cms-react` — no D1, no editor, no server.

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

Pushes to `main` deploy automatically via [`.github/workflows/gh-pages.yml`](../../.github/workflows/gh-pages.yml).

**One-time repo setup:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
