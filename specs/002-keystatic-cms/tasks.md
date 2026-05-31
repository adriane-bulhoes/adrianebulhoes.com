# Tasks: Keystatic CMS

**Input**: `specs/002-keystatic-cms/spec.md`
**Prerequisites**: Spec `001` merged + deployed (collections + schemas exist).

## Format: `[ID] [P?] Description`

- Each `T-NNN` = **one atomic Conventional Commit** (Constitution VIII)
- Branch: `002-keystatic-cms`

---

## Phase 1: Setup

- [ ] T001 Add `@keystatic/core`, `@keystatic/astro`, and Markdoc support; enable the
  Keystatic + React integration in `astro.config.mjs` (server/hybrid output for the admin).

## Phase 2: Config (schema mirror)

- [ ] T002 Create `keystatic.config.ts` with the `fieldnotes` collection mirroring the `001`
  Zod schema (title, date, location, tags, cover, body), slug from title.
- [ ] T003 Add the `projetos` collection to `keystatic.config.ts` (title, subtitle, coords,
  status enum, order, stats array, tools array, visual enum, cover, body).
- [ ] T004 Configure inline image upload (public image dir) and custom content blocks:
  image-with-caption, pull-quote, callout — matched to the site's published styling.

## Phase 3: Local mode

- [ ] T005 Wire the `/keystatic` admin route (`storage: { kind: 'local' }` for dev) and the
  Keystatic API route handler.
- [ ] T006 Verification: `npm run dev`, open `/keystatic`, create + edit a Field Note and a
  Projeto, confirm correct Markdown is written and the Astro build still passes.

## Phase 4: GitHub mode (prod auth)

- [ ] T007 **[operator]** Create/connect the GitHub App for the repo and set the required
  Keystatic env vars in Netlify (client id/secret, secret) under Adriane's accounts.
- [ ] T008 Switch storage to `kind: 'github'` (repo `adriane-bulhoes/adrianebulhoes.com`) with
  local-mode fallback for dev; ensure `/api/keystatic/[...params]` routes deploy as functions.
- [ ] T009 Verification: on the deployed site, log in at `/keystatic` with GitHub, Save an
  edit, confirm the commit lands and Netlify auto-rebuilds.

## Phase 5: Verify & handoff

- [ ] T010 Verification: full author walkthrough (create note w/ inline image + a block →
  Save → live), confirm SC-001..SC-004; write a short authoring guide for Adriane.

---

## Dependencies

- T002/T003 must mirror the `001` schemas exactly (Edge Case: schema mismatch breaks builds).
- T007 (operator GitHub App + env vars) gates T008/T009.
- T008 depends on the Netlify deploy from `001` (Phase 6).
