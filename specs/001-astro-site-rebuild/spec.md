# Feature Specification: Astro Site Rebuild

**Feature Branch**: `001-astro-site-rebuild`
**Created**: 2026-05-31
**Status**: Draft
**Input**: Migrate the existing hand-coded static HTML site (5 pages, "basalt/glacier/lava"
geology theme) to a maintainable Astro 6 project with Markdown-driven content collections,
deployed live on Netlify at adrianebulhoes.com.

## User Scenarios & Testing _(mandatory)_

### User Story 0 — Design System & Shared Chrome Foundation (Priority: P0)

The project has a single Astro design-token stylesheet and a reusable component layer
(layout, nav, footer, animated background, custom cursor, scroll reveals, strata dividers)
that every page composes from. This is the substrate all pages depend on.

**Why this priority**: Every page reuses the same chrome and tokens. Nothing can be ported
at visual parity until the shared layer exists and matches the reconstructed `style.css`.

**Independent Test**: Run `npm run build` and `npm run dev`; a throwaway page that uses
`BaseLayout` renders the dark theme, nav, footer, grain, animated canvas, and custom cursor
identically to the current static site.

**Acceptance Scenarios**:

1. **Given** the global stylesheet, **When** any page loads, **Then** `body` background is
   `#0a0e0f`, text is glacier-blue, and the Cormorant Garamond + DM Mono + Syne fonts load.
2. **Given** `BaseLayout.astro`, **When** a page wraps its content in it, **Then** the nav
   (logo, links, PT/EN toggle), footer, grain, tectonic SVG, and `#bg-canvas` are present
   without the page re-declaring them.
3. **Given** the `WaveCanvas` and `Cursor` islands, **When** the page hydrates, **Then** the
   animated waves draw and the custom cursor tracks the pointer — and on a coarse-pointer
   device the native cursor is used instead.
4. **Given** `prefers-reduced-motion: reduce`, **When** the page loads, **Then** animations
   are suppressed.

---

### User Story 1 — Visitor Browses the Core Site (Priority: P1) 🎯 MVP

A visitor lands on the site and navigates the Home, Sobre, Projetos, and Contacto pages,
seeing the same content and design as the original static site, fully responsive.

**Why this priority**: This is the site itself — the primary public value. At this point the
broken-without-CSS HTML is fully replaced by a working, deployable Astro site.

**Independent Test**: Visit `/`, `/sobre`, `/contato` (and `/projetos` shell); each renders
at visual parity with the original HTML on desktop and mobile, with working nav links.

**Acceptance Scenarios**:

1. **Given** the Home page, **When** it loads, **Then** the hero, intro strip, project
   teaser, Field Notes teaser, and contact mini-section render at parity with `index.html`.
2. **Given** the nav, **When** a visitor clicks a link, **Then** they navigate to the
   corresponding page (`/sobre`, `/projetos`, `/fieldnotes`, `/contato`).
3. **Given** any page on a 375px-wide viewport, **When** it renders, **Then** layout reflows
   without horizontal scroll and the nav remains usable.
4. **Given** a request for an unknown path, **When** it 404s, **Then** a themed 404 page is
   shown with a link back home.

---

### User Story 2 — Read Field Notes from Markdown (Priority: P2)

A visitor reads the Field Notes blog: a listing of entries and a full page per entry. Each
entry is a Markdown file with structured frontmatter.

**Why this priority**: The blog is the content Adriane will grow over time; it must be
Markdown-driven so she can add entries without code.

**Independent Test**: With 3 migrated Markdown notes present, `/fieldnotes` lists them
newest-first, and each `/fieldnotes/<slug>` renders the note's title, date, location, tags,
and body. The Home teaser shows the latest 3.

**Acceptance Scenarios**:

1. **Given** the `fieldnotes` collection with 3 entries, **When** `/fieldnotes` loads,
   **Then** all 3 appear as cards ordered by `date` descending.
2. **Given** a note's Markdown file, **When** its `/fieldnotes/<slug>` page loads, **Then**
   the title, formatted date, location, tags, and rendered Markdown body display.
3. **Given** a note with an inline image in its body, **When** the page renders, **Then** the
   image appears in the content flow.
4. **Given** the Home page, **When** it loads, **Then** the Field Notes teaser shows the 3
   most recent notes with working links to their pages (replacing the hard-coded `#` links).
5. **Given** frontmatter with an invalid `date` or missing `title`, **When** the build runs,
   **Then** the build fails with a clear schema error (content is never silently broken).

---

### User Story 3 — Browse Editable Projetos (Priority: P3)

A visitor browses the Projetos page, where each project is a Markdown entry with structured
fields (status, coordinates, stats, tools, visual). Adriane can add/revise projects herself.

**Why this priority**: Project content is still draft; it must be author-editable like the
blog rather than hard-coded.

**Independent Test**: With the 2 migrated project entries, `/projetos` renders them ordered
by `order`, each showing title, status badge, stats, tools, and its chosen visual.

**Acceptance Scenarios**:

1. **Given** the `projetos` collection with 2 entries, **When** `/projetos` loads, **Then**
   both render ordered by `order` with title, status, stats, and tool pills.
2. **Given** a project with `visual: "mangrove"` and no cover image, **When** it renders,
   **Then** the predefined `mangrove` SVG visual is shown.
3. **Given** a project with an uploaded `cover` image, **When** it renders, **Then** the
   cover image overrides the preset visual.

### Edge Cases

- **No Field Notes / no Projetos**: listing pages show a themed empty state, not an error.
- **Note with fewer/more than expected tags**: renders all tags without layout break.
- **Missing cover image**: falls back to the preset visual (Projetos) or omits gracefully.
- **Very long title/location**: truncates or wraps without breaking the card grid.
- **JS disabled**: all content remains readable; only the canvas/cursor/reveal enhancements
  are absent (content is never reveal-gated to the point of being hidden without JS).
- **Reduced motion**: canvas + reveal + cursor animations suppressed.

## Constitution Alignment _(mandatory)_

- **I. Static-first / zero-JS**: All pages prerendered static. Only `WaveCanvas`, `Cursor`,
  scroll-reveal, and the PT/EN toggle are islands.
- **II. Markdown collections**: Field Notes and Projetos are `glob`-loaded collections with
  Zod schemas; no editorial content hard-coded in pages.
- **III. Hand-authored CSS / no Tailwind**: Reconstructed tokens become `global.css`;
  components use scoped `<style>`. No utility framework added.
- **IV. PT now, EN later**: All copy in `pt`; routing/toggle/schema leave room for `en`;
  no EN content shipped.
- **V. Accessibility & motion**: Landmarks, focus states, alt text, `prefers-reduced-motion`,
  touch-pointer cursor fallback.
- **VI. Performance**: Static output, `display=swap` fonts, Astro image pipeline.
- **VIII. Git**: Branch `001-astro-site-rebuild`; one atomic Conventional Commit per task.

## Requirements _(mandatory)_

### Functional Requirements

**Project & Foundation**
- **FR-001**: The project MUST be an Astro 6 + TypeScript (strict) app with the
  `@astrojs/react` integration (static output; no platform adapter — Netlify serves `dist/`).
- **FR-002**: The design tokens and shared base styles MUST live in `src/styles/global.css`
  and reproduce the reconstructed `style.css` palette/typography.
- **FR-003**: A `BaseLayout.astro` MUST provide `<head>` (meta, fonts, title), the nav,
  footer, and background layers, exposing a `<slot/>` for page content.
- **FR-004**: Shared components MUST exist for `Nav`, `Footer`, `Background`, and
  `StratumDivider`; interactive `WaveCanvas` and `Cursor` MUST be React islands.

**Pages**
- **FR-005**: The site MUST provide pages at `/` (Home), `/sobre`, `/projetos`, `/contato`,
  `/fieldnotes`, `/fieldnotes/<slug>`, and a 404 page.
- **FR-006**: Each ported page MUST match the original HTML's content and visual design.
- **FR-007**: All pages MUST be responsive with no horizontal scroll at 375px width.
- **FR-008**: The nav PT/EN toggle MUST be present; EN is non-functional (per Constitution IV).

**Field Notes**
- **FR-009**: A `fieldnotes` content collection MUST be defined with a Zod schema (see Key
  Data Types) loaded from `src/content/fieldnotes/*.md`.
- **FR-010**: The 3 existing Field Notes MUST be migrated into Markdown files.
- **FR-011**: `/fieldnotes` MUST list entries ordered by `date` descending.
- **FR-012**: `/fieldnotes/<slug>` MUST render each entry's frontmatter + Markdown body via
  `getStaticPaths` (one static page per entry).
- **FR-013**: The Home Field Notes teaser MUST render the 3 most recent entries with links
  to their pages.

**Projetos**
- **FR-014**: A `projetos` content collection MUST be defined with a Zod schema (see Key
  Data Types) loaded from `src/content/projetos/*.md`.
- **FR-015**: The 2 existing projects MUST be migrated into Markdown files.
- **FR-016**: `/projetos` MUST render entries ordered by `order`, each showing title,
  status badge, stats, tools, and its visual.
- **FR-017**: Project visuals MUST use a named preset by default and an uploaded `cover`
  image when present (hybrid).

**Deploy**
- **FR-018**: The site MUST build to static `dist/` and deploy on Netlify from the repo.
- **FR-019**: The custom domain `adrianebulhoes.com` MUST resolve to the Netlify deployment
  with automatic HTTPS. _(DNS/import are manual operator steps, documented in tasks.)_

### Key Data Types

```ts
// fieldnotes collection
FieldNote = {
  title: string;
  date: Date;
  location: string;            // e.g. "Oneroa, Waiheke Island — NZ"
  tags: string[];              // default []
  cover?: ImageMetadata;       // optional cover/visual
  excerpt?: string;            // optional teaser override
  draft?: boolean;             // default false; drafts excluded from prod listing
}

// projetos collection
Projeto = {
  title: string;
  subtitle?: string;
  coords?: string;             // "12°57'S · 38°37'W"
  status: 'em desenvolvimento' | 'concluído' | 'planeado';
  order: number;               // display order (default 0)
  stats: { value: string; label: string }[];   // default []
  tools: string[];             // default []
  visual?: 'mangrove' | 'geothermal' | 'satellite-grid' | 'basalt-strata';
  cover?: ImageMetadata;       // overrides `visual` when present
  draft?: boolean;             // default false
}
```

## Assumptions

- Content is Portuguese only; the 3 Field Notes and 2 Projetos come from the existing HTML.
- `index_1.html` is a duplicate and will be dropped; `first-version.html` is an older design
  and will be moved to `reference/` (not part of the live site).
- Slugs derive from filenames (kebab-case) unless a frontmatter slug is added.
- The PT/EN toggle remains visual-only until a future EN spec.
- Netlify project + GoDaddy DNS are configured by the operator (Matt) using Adriane's
  accounts; the spec provides exact records but cannot perform those external steps.

## Success Criteria _(mandatory)_

- **SC-001**: `npm run build` completes with zero type errors and zero schema errors.
- **SC-002**: Home, Sobre, Contato, Projetos, and Field Notes pages render at visual parity
  with the originals on desktop (1280px) and mobile (375px), verified by screenshot.
- **SC-003**: Adding a new Markdown file to `src/content/fieldnotes/` makes a new note appear
  on `/fieldnotes` and (if newest) in the Home teaser, with no code changes.
- **SC-004**: Lighthouse ≥ 95 for Performance, Accessibility, Best Practices, SEO on `/` and
  one article page.
- **SC-005**: No page produces horizontal scroll at 375px; keyboard navigation reaches all
  links; reduced-motion suppresses animation.
- **SC-006**: The site is reachable at `https://adrianebulhoes.com` over HTTPS (post-deploy).
