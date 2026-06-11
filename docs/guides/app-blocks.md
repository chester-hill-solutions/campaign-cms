# App blocks

Five block types require host-provided React components. Generic blocks (hero, richText, cardGrid, …) render inside `@campaign/cms-react`; app blocks delegate to your campaign site.

## Block types

| Type | Typical use |
|------|-------------|
| `contactForm` | Volunteer / contact form |
| `eventsList` | Full events calendar |
| `eventsTeaser` | Home page events strip |
| `bioLinks` | Link-in-bio page |
| `donateEmbed` | Donation widget (Stripe, Donorbox, …) |

## Registry

```tsx
import type { AppBlockRenderers } from '@campaign/cms-react'
import { ContactFormBlockView } from './ContactFormBlockView'

export type AppBlockContext = {
  volunteerCode?: string
  eventsPayload?: EventsPayload
  bioLinksPayload?: BioLinksPayload
}

export const appBlocks: AppBlockRenderers<AppBlockContext> = {
  contactForm: ({ block, context }) => (
    <ContactFormBlockView block={block} volunteerCode={context?.volunteerCode} />
  ),
  eventsList: ({ block, context }) =>
    context?.eventsPayload ? (
      <EventsListBlockView block={block} eventsPayload={context.eventsPayload} />
    ) : null,
  eventsTeaser: ({ block, context }) =>
    context?.eventsPayload ? (
      <EventsTeaserBlockView block={block} eventsPayload={context.eventsPayload} />
    ) : null,
  bioLinks: ({ block, context }) =>
    context?.bioLinksPayload ? (
      <BioLinksBlockView block={block} bioLinksPayload={context.bioLinksPayload} />
    ) : null,
  donateEmbed: ({ block }) => <DonateEmbedBlockView block={block} />,
}
```

## Usage

```tsx
<BlockRenderer
  blocks={page.blocks}
  appBlocks={appBlocks}
  appContext={{ eventsPayload, volunteerCode }}
/>
```

## Schema

App block schemas in `@campaign/cms-core` define editable fields (headings, labels, embed URLs). The host view component receives the parsed block + optional context.

Example `donateEmbed` block fields: `heading`, `embedUrl`, `disclaimer`.

## Editor behavior

In `EditorCanvas`, app blocks show `AppBlockPlaceholder` — a dashed outline with the block type label. Editors configure fields in `BlockSettingsPanel`; live widgets appear only on the public site.

## Adding a new app block type

1. Add Zod schema + type to `@campaign/cms-core` `blockSchemas.ts` (upstream PR)
2. Add to `APP_BLOCK_TYPES` and `pageBlockSchema` union
3. Register renderer in host `appBlocks`
4. Add settings UI in `blockTypeSettings.tsx` (upstream PR) or fork

For campaign-only blocks without upstreaming, extend schemas in the host and fork `BlockRenderer` dispatch — not recommended long-term.

## Pages without app blocks

If your site only uses generic blocks (hero, richText, image, ctaStrip), omit `appBlocks` entirely. Unused app block types in stored payloads simply render null.
