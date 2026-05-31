# Feature Specification: Keystatic CMS

**Feature Branch**: `002-keystatic-cms`
**Created**: 2026-05-31
**Status**: Draft (blocked on 001)
**Input**: Add a no-code, Git-based visual editor (Keystatic) over the Field Notes and
Projetos Markdown collections so Adriane can add/update/remove content from the browser,
with changes committed to the repo and auto-deployed.

> Lightweight SDD (spec + tasks only), per the `010`/`014` precedent: this layers an editor
> over collections that already exist in spec `001`. No new data model, no plan/research/
> contracts ceremony.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Edit Content in the Browser (Priority: P1)

Adriane opens the site's `/keystatic` editor, logs in with her GitHub account, and
adds/edits/removes Field Notes and Projetos through forms — no code, no terminal.

**Why this priority**: This is the whole point — a non-technical author maintaining the site.

**Independent Test**: At the deployed `/keystatic`, log in via GitHub, create a new Field
Note (title, date, location, tags, body with an inline image), Save; confirm a commit lands
in the repo and the note appears on the live `/fieldnotes` after the auto-rebuild.

**Acceptance Scenarios**:

1. **Given** the deployed `/keystatic`, **When** Adriane logs in with GitHub, **Then** she
   sees **Field Notes** and **Projetos** collections in the sidebar.
2. **Given** the Field Note editor, **When** she fills the fields and clicks Save, **Then** a
   Markdown file is committed to `src/content/fieldnotes/` and a Vercel rebuild publishes it.
3. **Given** the editor body, **When** she inserts an image inline, **Then** the image is
   uploaded into the repo and renders in the article flow.
4. **Given** the editor body, **When** she inserts a predefined block (image+caption,
   pull-quote, callout), **Then** it renders with the site's styling on the published page.
5. **Given** a Projeto entry, **When** she edits status/stats/tools/visual and Saves, **Then**
   the project updates on `/projetos` after rebuild.
6. **Given** local development (`npm run dev`), **When** she opens `/keystatic` in local mode,
   **Then** edits write directly to the working tree without authentication.

### Edge Cases

- **Schema mismatch**: Keystatic field config MUST match the `001` Zod schemas so a Keystatic
  save never produces frontmatter that fails the Astro build.
- **Required field left empty**: the editor blocks saving (e.g. missing title/date).
- **Auth not configured in prod**: `/keystatic` must not expose write access without GitHub
  auth; misconfiguration fails closed.

## Constitution Alignment _(mandatory)_

- **II. Markdown collections**: Keystatic reads/writes the same Markdown collections; the
  repo remains the single source of truth.
- **VII. No-code authoring**: forms, inline images, predefined blocks — no code required.
- **IX. Ownership**: GitHub mode authenticates against Adriane's account; commits are hers.
- **VIII. Git**: feature branch `002-keystatic-cms`; one atomic commit per task.

## Requirements _(mandatory)_

- **FR-001**: Add `@keystatic/core` + `@keystatic/astro` (and Markdoc support) to the project.
- **FR-002**: `keystatic.config.ts` MUST define `fieldnotes` and `projetos` collections whose
  fields exactly mirror the `001` Zod schemas (title, date, location, tags, cover, body for
  notes; title/subtitle/coords/status/order/stats/tools/visual/cover/body for projetos).
- **FR-003**: The Field Note + Projeto body MUST support inline image upload and a small set
  of custom blocks: image-with-caption, pull-quote, callout.
- **FR-004**: A `/keystatic` admin route MUST be served by the Astro Keystatic integration.
- **FR-005**: **Local mode** MUST work for on-disk editing during `npm run dev` with no auth.
- **FR-006**: **GitHub mode** MUST be configured for the deployed site: a GitHub App, the
  required env vars, and the `/api/keystatic/[...params]` routes, so Adriane logs in with
  GitHub and saves commit to the repo.
- **FR-007**: Saving in GitHub mode MUST trigger the Vercel auto-rebuild (commit-to-deploy).

## Assumptions

- Spec `001` is merged and deployed; the collections and their schemas exist.
- Adriane has a GitHub account with write access to the repo (already arranged).
- The deployment runs the Keystatic API routes server-side (Vercel functions) — the public
  pages remain static; only `/keystatic` and `/api/keystatic/*` are dynamic.

## Success Criteria _(mandatory)_

- **SC-001**: Adriane creates a Field Note end-to-end in the browser and it appears live
  within ~2 minutes of Save, with no code or terminal use.
- **SC-002**: A Keystatic-authored entry always passes the Astro build (schemas match).
- **SC-003**: Inline images and at least the three custom blocks render correctly published.
- **SC-004**: `/keystatic` in production never allows writes without GitHub authentication.
