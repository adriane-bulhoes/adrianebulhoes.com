# Tasks: Astro Site Rebuild

**Input**: Design documents from `specs/001-astro-site-rebuild/`
**Prerequisites**: spec.md (user stories), plan.md (structure)

**Tests**: This is a low-logic static site; "verification" tasks use `npm run build` /
`astro check` and screenshot parity rather than unit tests. Each user story ends with a
verification task and a checkpoint.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency)
- **[Story]**: US0 (foundation), US1 (pages), US2 (field notes), US3 (projetos)
- Each `T-NNN` = **one atomic Conventional Commit** (Constitution VIII)

## Path Conventions

- Repo root holds `astro.config.mjs`, `tsconfig.json`, `package.json`
- App code under `src/`, static assets under `public/`, archived originals under `reference/`

---

## Phase 1: Setup

**Purpose**: Stand up the Astro project and tooling.

- [ ] T001 Scaffold Astro 6 + TypeScript (strict) project: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, minimal `src/pages/index.astro` placeholder; install dependencies.
- [ ] T002 Add `@astrojs/react` and `@astrojs/vercel` integrations and wire them in `astro.config.mjs` (static output + Vercel adapter); add `react`/`react-dom`.
- [ ] T003 [P] Archive originals: move `first-version.html` to `reference/`, delete duplicate `index_1.html`, and relocate the legacy root `*.html` out of the build path.
- [ ] T004 [P] Add `.claude/launch.json` dev-server config for `npm run dev` and update `.gitignore` for Astro (`.astro/`, `.vercel/`).
- [ ] T005 Verification: `npm run build` and `astro check` pass on the placeholder; commit captures clean output.

**Checkpoint**: Astro builds; integrations and adapter configured.

---

## Phase 2: Foundational — Design System & Shared Chrome (US0)

**Goal**: Token stylesheet + reusable layout/components/islands matching the current site.

**Independent Test**: A page using `BaseLayout` renders dark theme, nav, footer, grain,
animated canvas, and cursor at parity; reduced-motion suppresses animation.

- [ ] T006 [US0] Port reconstructed `style.css` into `src/styles/global.css` (tokens + reset + base + nav/footer/reveal/divider/clink + responsive + reduced-motion).
- [ ] T007 [US0] Implement `src/layouts/BaseLayout.astro`: `<head>` (meta, fonts `display=swap`, `<title>`/description props), imports `global.css`, renders `Nav` + `Background` + `<slot/>` + `Footer`.
- [ ] T008 [P] [US0] Implement `src/components/Nav.astro` (logo, links, PT/EN toggle markup) with `aria-current` on the active link.
- [ ] T009 [P] [US0] Implement `src/components/Footer.astro`.
- [ ] T010 [P] [US0] Implement `src/components/Background.astro` (grain + tectonic SVG + `#bg-canvas` element) and `src/components/StratumDivider.astro`.
- [ ] T011 [US0] Implement `src/components/WaveCanvas.tsx` React island (port the canvas wave animation; guard on `prefers-reduced-motion`) and mount it `client:load` in `Background`.
- [ ] T012 [US0] Implement `src/components/Cursor.tsx` React island (custom dot+ring cursor; disabled on coarse pointers) mounted `client:idle`; implement `Reveal.astro` scroll-reveal (IntersectionObserver, `.on`).
- [ ] T013 [US0] Implement the PT/EN toggle island behavior (visual toggle only, no nav break) and active-state handling.
- [ ] T014 [US0] Verification: build + preview; screenshot a `BaseLayout` demo at 1280px and 375px and confirm parity with the current site; confirm reduced-motion suppresses animation.

**Checkpoint**: Shared design layer complete; any page can compose from it.

---

## Phase 3: Static Pages (US1) 🎯 MVP

**Goal**: Port Home, Sobre, Contato, and a 404 at visual parity; responsive nav.

**Independent Test**: `/`, `/sobre`, `/contato`, and an unknown path render at parity on
desktop and mobile with working nav links.

- [ ] T015 [US1] Implement `src/pages/index.astro` (hero, intro strip, project teaser, Field Notes teaser placeholder, contact mini) using `BaseLayout` + scoped styles.
- [ ] T016 [P] [US1] Implement `src/pages/sobre.astro` at parity with `sobre.html`.
- [ ] T017 [P] [US1] Implement `src/pages/contato.astro` at parity with `contato.html`.
- [ ] T018 [P] [US1] Implement `src/pages/404.astro` (themed, link home).
- [ ] T019 [US1] Implement a static `src/pages/projetos.astro` shell (structure + section label) to be populated by US3.
- [ ] T020 [US1] Verification: build + screenshot `/`, `/sobre`, `/contato`, `/404` at 1280px and 375px; confirm parity and no horizontal scroll.

**Checkpoint**: Core public site is browsable and deployable.

---

## Phase 4: Field Notes Blog (US2)

**Goal**: Markdown-driven Field Notes listing + article pages + Home teaser.

**Independent Test**: 3 migrated notes list newest-first; each article renders; Home teaser
shows latest 3.

- [ ] T021 [US2] Define the `fieldnotes` collection + Zod schema in `src/content.config.ts` (`glob` loader over `src/content/fieldnotes/*.md`).
- [ ] T022 [US2] Migrate the 3 existing Field Notes from `fieldnotes.html` into `src/content/fieldnotes/*.md` with frontmatter (title, date, location, tags, excerpt).
- [ ] T023 [US2] Implement `src/components/FieldNoteCard.astro` and `src/pages/fieldnotes/index.astro` (listing ordered by `date` desc, empty state).
- [ ] T024 [US2] Implement `src/pages/fieldnotes/[slug].astro` via `getStaticPaths` + `render()` (title, date, location, tags, body, inline images).
- [ ] T025 [US2] Wire the Home Field Notes teaser to the latest 3 entries with real links (replace hard-coded `#`).
- [ ] T026 [US2] Verification: build (schema gate); screenshot `/fieldnotes` and one article; add a throwaway 4th note and confirm it appears, then remove it.

**Checkpoint**: Field Notes are fully Markdown-driven.

---

## Phase 5: Projetos Collection (US3)

**Goal**: Markdown-driven Projetos with hybrid visuals.

**Independent Test**: 2 migrated projects render ordered by `order` with status/stats/tools
and the correct preset visual or cover override.

- [ ] T027 [US3] Add the `projetos` collection + Zod schema to `src/content.config.ts`.
- [ ] T028 [US3] Migrate the 2 existing projects from `projetos.html` into `src/content/projetos/*.md`.
- [ ] T029 [US3] Implement `src/components/ProjetoVisual.astro` (preset SVG visuals: mangrove / geothermal / satellite-grid / basalt-strata; cover-image override).
- [ ] T030 [US3] Implement `src/components/ProjetoCard.astro` and populate `src/pages/projetos.astro` from the collection (ordered by `order`).
- [ ] T031 [US3] Verification: build; screenshot `/projetos`; confirm preset-vs-cover behavior.

**Checkpoint**: Projetos are author-editable Markdown.

---

## Phase 6: Deploy (US1)

**Goal**: Live on Vercel at adrianebulhoes.com.

- [ ] T032 [US1] Confirm `@astrojs/vercel` static build output and add any needed `vercel.json`; verify `npm run build` produces a deployable output.
- [ ] T033 [US1] **[operator]** Import the repo on Vercel using Adriane's GitHub; confirm first deploy on the `*.vercel.app` URL.
- [ ] T034 [US1] **[operator]** Add `adrianebulhoes.com` in Vercel and configure GoDaddy DNS (A `@` → Vercel IP; CNAME `www` → `cname.vercel-dns.com`); remove GoDaddy parking/forwarding.
- [ ] T035 [US1] Verification: site loads over HTTPS at the domain; run Lighthouse on `/` and an article page and record ≥ 95 across categories.

**Checkpoint**: Site is live and meets the performance/a11y budget.

---

## Dependencies

- Phase 1 → everything. Phase 2 (US0) → Phases 3–5.
- Phase 4 (Home teaser, T025) depends on T015 (home) + T021–T024 (collection/pages).
- Phase 5 depends on the US0 components and T019 (projetos shell).
- Phase 6 depends on Phases 3–5 being built; T033–T034 are manual operator steps.
