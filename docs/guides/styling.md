# Styling

CMS components use Tailwind utility classes backed by CSS custom properties.

## Tailwind content scanning

Package JSX lives outside your app source tree. Add a `@source` directive (Tailwind v4):

```css
@import "tailwindcss";

/* Installed via npm */
@source "../../node_modules/@campaign/cms-react/src";

/* Sibling repo checkout */
@source "../../../campaign-cms/packages/cms-react/src";
```

Without this, block layout classes won't generate and pages will look unstyled.

## Default tokens

Import the package defaults:

```css
@import "@campaign/cms-react/styles/cms-tokens.css";
```

Or define variables yourself in `@theme`:

| Variable | Default role |
|----------|--------------|
| `--ink` | Primary text |
| `--ink-muted` | Secondary text |
| `--accent-orange` | CTA / links |
| `--accent-red` | Alerts |
| `--accent-green` | Success |
| `--surface-page` | Page background |
| `--surface-card` | Card backgrounds |
| `--line-strong` | Borders |

## Host theme overrides

Override in your site's CSS after importing tokens:

```css
:root {
  --ink: #1a1a2e;
  --accent-orange: #e85d04;
}
```

Map to Tailwind colors:

```css
@theme {
  --color-ink: var(--ink);
  --color-accent-orange: var(--accent-orange);
}
```

## Editor chrome

Admin canvas components use neutral grays (`bg-zinc-900`, `border-zinc-700`) independent of campaign theme. Public block views use campaign tokens.

## Container queries

Block responsive layouts use `@sm:` / `@md:` container query variants, not viewport breakpoints. This keeps the admin viewport preview accurate.

## Typography plugin

Rich text blocks benefit from `@tailwindcss/typography`:

```css
@plugin "@tailwindcss/typography";
```

Markdown rendering in `CmsMarkdownBody` applies `prose` classes.

## Campaign-specific CSS

Host-specific layout (e.g. `frank-hero-stack--portrait`) belongs in the host stylesheet, not the package. Pass portrait dimensions via `CmsUiProvider.heroFallbackPortrait`.
