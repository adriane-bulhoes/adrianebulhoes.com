# Implementation Plan: Astro Site Rebuild

**Branch**: `001-astro-site-rebuild` | **Date**: 2026-05-31 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `specs/001-astro-site-rebuild/spec.md`

## Summary

Replace the hand-coded static HTML site with an Astro 6 project. The shared "geology" design
(reconstructed in `style.css`) becomes a token-driven `global.css` plus a reusable component
layer composed by a `BaseLayout`. The five pages are ported to `.astro` at visual parity.
Field Notes and Projetos become Markdown **Content Collections** with Zod-validated
frontmatter, rendered statically via `getStaticPaths`. Interactivity (animated wave canvas,
custom cursor, scroll reveals, PT/EN toggle) ships only as React/Astro islands. The output is
a static site deployed on Netlify and served at adrianebulhoes.com.

## Technical Context

**Language/Version**: TypeScript (strict); Node LTS
**Framework**: Astro 6.4.x (static output)
**Integrations**: `@astrojs/react` 5.x (islands); no platform adapter — static output to `dist/` (Netlify adapter added in spec 002)
**Dependencies**: react 19.2, react-dom 19.2; no UI/CSS framework
**Content**: Astro Content Collections via `glob` loader; config in `src/content.config.ts`
**Styling**: Hand-authored CSS + `:root` design tokens (`src/styles/global.css`) + scoped
component `<style>`. No Tailwind (Constitution III).
**Fonts**: Cormorant Garamond, DM Mono, Syne via Google Fonts `display=swap`
**Testing/Verification**: `npm run build` (type + schema gate); `astro check`; preview server
+ screenshot parity at 1280px and 375px; Lighthouse on `/` and an article page.
**Target Platform**: Static site on Netlify; responsive desktop-first
**Project Type**: Static content site (low logic)
**Performance Goals**: Lighthouse ≥ 95 all categories; zero JS on pages with no island
**Constraints**: PT-only content; EN-ready structure; WCAG AA; reduced-motion respected

## Constitution Check

_GATE: must pass before implementation; re-check after foundation phase._

- [x] **I. Static-first / zero-JS**: static output; islands only for canvas/cursor/reveal/toggle.
- [x] **II. Markdown collections**: fieldnotes + projetos collections with Zod schemas.
- [x] **III. No Tailwind**: tokens + scoped CSS only.
- [x] **IV. PT now / EN later**: pt content; toggle + schema leave room for en.
- [x] **V. Accessibility & motion**: landmarks, focus, alt, reduced-motion, cursor fallback.
- [x] **VI. Performance**: static, font-swap, image pipeline.
- [x] **VIII. Git**: branch per spec; one atomic Conventional Commit per task.

## Project Structure

### Documentation (this feature)

```text
specs/001-astro-site-rebuild/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
astro.config.mjs
tsconfig.json
package.json
src/
├── content.config.ts            # fieldnotes + projetos collections
├── styles/
│   └── global.css               # design tokens + base/shared styles
├── layouts/
│   └── BaseLayout.astro         # head + Nav + Background + Footer + <slot/>
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── Background.astro         # grain + tectonic + #bg-canvas markup
│   ├── StratumDivider.astro
│   ├── WaveCanvas.tsx           # island (client:load)
│   ├── Cursor.tsx               # island (client:idle)
│   ├── Reveal.astro             # scroll-reveal wrapper
│   ├── FieldNoteCard.astro
│   ├── ProjetoCard.astro
│   └── ProjetoVisual.astro      # preset SVG visuals + cover override
├── content/
│   ├── fieldnotes/*.md
│   └── projetos/*.md
└── pages/
    ├── index.astro
    ├── sobre.astro
    ├── projetos.astro
    ├── contato.astro
    ├── 404.astro
    └── fieldnotes/
        ├── index.astro
        └── [slug].astro
public/
└── (favicon, og image, static assets)
reference/
└── first-version.html           # archived earlier design (not built)
```

## Phasing

1. **Setup** — scaffold + config + fonts (US0 prerequisite).
2. **Foundational** — global.css + BaseLayout + shared components + islands (US0).
3. **Static pages** — Home, Sobre, Contato, 404 (US1, MVP).
4. **Field Notes** — collection + listing + article + home teaser (US2).
5. **Projetos** — collection + render + hybrid visuals (US3).
6. **Deploy** — static `dist/` + Netlify import + DNS + Lighthouse (operator steps flagged).

Tour the detailed task list in [./tasks.md](./tasks.md).
