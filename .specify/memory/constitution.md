# Project Constitution — adrianebulhoes.com

**Project**: Personal site + Field Notes blog for Adriane Santana Bulhões (Earth-sciences researcher).
**Created**: 2026-05-31
**Status**: Active

This constitution is the set of non-negotiable rules every spec, plan, and task in this
repository must comply with. Specs include a "Constitution Check" gate that verifies
alignment before implementation begins. When a rule must be broken, the spec MUST document
the exception and its justification.

---

## I. Static-First, Zero-JS-by-Default

The public site MUST be statically generated and ship **no client-side JavaScript by
default**. Interactivity is added only as discrete Astro/React **islands** (`client:*`
directives) and only where it provides real value (animated background, custom cursor,
language toggle, scroll reveals). A page that needs no interactivity ships zero JS.

## II. Content Lives in Markdown Collections

All editorial content (Field Notes, Projetos) MUST live as Markdown files in Astro
**Content Collections** with type-safe, Zod-validated frontmatter. Content is decoupled
from layout: authors control *what* a page says; components/CSS control *how* it looks.
No editorial content is hard-coded into `.astro` pages.

## III. Hand-Authored CSS with Design Tokens — No Utility Framework

Styling uses **modern, hand-authored CSS** organized around the design tokens in
`src/styles/global.css` (the `:root` custom properties) plus Astro's built-in
**scoped `<style>`** blocks per component. **Tailwind and other utility/CSS-in-JS
frameworks are prohibited** — this is an art-directed site and utilities fight the
bespoke design. All colors/spacing/type reference tokens; no magic hex values in
component styles where a token exists.

## IV. Portuguese Now, Structured for English Later

Default and only shipped language is **Portuguese (`pt`)**. The architecture (routing,
content schema, the PT/EN toggle) MUST be built so English can be added later **without a
rewrite** — but EN content is explicitly out of scope until requested. The PT/EN toggle
stays in the UI; EN is non-functional for now.

## V. Accessibility & Motion (WCAG 2.1 AA)

Every page MUST meet WCAG 2.1 AA: sufficient color contrast, keyboard-navigable, correct
landmark/heading structure, `alt` text on meaningful images, visible focus states. All
animation MUST respect `prefers-reduced-motion`. The custom cursor MUST never break
keyboard or touch interaction (native cursor restored on touch/coarse pointers).

## VI. Performance Budget

Target **Lighthouse ≥ 95** across Performance, Accessibility, Best Practices, SEO on the
home and an article page. Fonts loaded with `display=swap`; images optimized via Astro's
image pipeline; no render-blocking third-party scripts.

## VII. Authoring is No-Code-Friendly

Content editing MUST be possible without writing code. The markdown model (and later
Keystatic) MUST let a non-technical author add/update/remove Field Notes and Projetos,
insert images inline, and pick from predefined layout blocks — without touching `.astro`,
CSS, or config.

## VIII. Git Discipline — Atomic Conventional Commits

- **One spec = one feature branch** named for the spec (e.g. `001-astro-site-rebuild`).
- **One task (`T-NNN`) = one atomic commit.** Each commit builds and is self-contained.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`,
  `test:`, `ci:`. The commit subject references the task where useful (e.g.
  `feat: scaffold Astro 6 project (T001)`).
- The git log MUST read as the task list — no mega-commits bundling unrelated changes.

## IX. Tenant of One — Ownership

The repository, deploys, and domain live under **Adriane's** GitHub/Netlify ownership.
Commits to this repo are authored as her (`user.email`/`user.name` set per-repo).

---

## Tech Stack (canonical)

| Concern | Choice |
|---|---|
| Framework | Astro 6 |
| Interactivity | React 19 islands (`@astrojs/react`) |
| Language | TypeScript (strict) |
| Content | Astro Content Collections (Markdown, `glob` loader) |
| Styling | Hand-authored CSS + design tokens + scoped styles |
| CMS (spec 002) | Keystatic (GitHub mode) |
| Hosting | Netlify (free tier); static `dist/` (Netlify adapter added in spec 002) |
| Registrar/DNS | GoDaddy (A `@` → Netlify `75.2.60.5`, CNAME `www`) |

## Amendments

Changes to this constitution require an explicit decision recorded in the relevant
spec's README or decision log, with date and rationale.
