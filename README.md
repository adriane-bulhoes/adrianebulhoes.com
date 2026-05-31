# adrianebulhoes.com

Personal site and **Field Notes** blog for Adriane Santana Bulhões — investigadora em
Ciências da Terra. Built with **Astro 6** (static, zero-JS-by-default) with React islands
for the interactive flourishes, Markdown content collections, and hand-authored CSS.

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md) for the project
rules and [`specs/`](specs/) for the spec-driven feature breakdown.

## Local development

Requires Node `>=20.3.0` (CI/Vercel use Node 22).

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # static build (Vercel Build Output) into .vercel/output
npm run check    # astro check — type + content-schema validation
```

## Adding content (no build tooling needed)

Content lives as Markdown files — add, edit, or remove a file and rebuild. A visual editor
(Keystatic) is planned in spec `002-keystatic-cms`; until then, edit the files directly.

### A new Field Note

Create `src/content/fieldnotes/<slug>.md` (the filename becomes the URL `/fieldnotes/<slug>`):

```markdown
---
title: "O título da nota"
date: 2025-05-31
location: "Oneroa, Waiheke Island — NZ"
tags: ["geologia costeira", "basalto"]
excerpt: "Uma frase de chamada para os cartões."
# cover: "./images/foto.jpg"   # optional — overrides the text-only card
# draft: true                   # optional — hidden in production
---

O corpo da nota em Markdown. **Negrito**, *itálico*, listas, e

> uma citação em destaque.
```

### A new Projeto

Create `src/content/projetos/<slug>.md` (URL `/projetos/<slug>`):

```markdown
---
title: "Nome"
subtitle: "do projeto"
eyebrow: "Projeto 03 · Localização"
coords: "00°00'S · 00°00'W · País"
summary: "Uma frase para o cartão da listagem."
status: "em desenvolvimento"   # | "concluído" | "planeado"
order: 3                        # display order (lowest first)
stats:
  - { value: "~60%", label: "Métrica" }
tools: ["Python", "Google Earth Engine"]
visual: "mangrove"              # mangrove | geothermal | satellite-grid | basalt-strata
# cover: "./images/foto.jpg"   # optional — overrides the preset visual
---

Descrição do projeto em Markdown.
```

## Project structure

```
src/
├── content.config.ts        # collection schemas (fieldnotes, projetos)
├── content/                 # ← Markdown content (edit here)
├── styles/global.css        # design tokens + shared chrome
├── layouts/BaseLayout.astro
├── components/              # Nav, Footer, Background, islands, cards…
└── pages/                   # routes (.astro)
reference/                   # archived original hand-coded HTML (not built)
specs/                       # spec-driven development docs
```

## Deployment (Vercel + GoDaddy)

The public site is static; Vercel auto-detects Astro and the `@astrojs/vercel` adapter
emits the Build Output — **no `vercel.json` needed**. One-time setup:

1. **Import** the repo at [vercel.com](https://vercel.com) signed in with Adriane's GitHub
   → New Project → select `adrianebulhoes.com`. Framework preset auto-detects as **Astro**.
   First deploy lands on a `*.vercel.app` URL.
2. **Custom domain**: Project → Settings → Domains → add `adrianebulhoes.com`. Vercel shows
   the exact DNS records.
3. **GoDaddy DNS** (Manage DNS): add what Vercel shows — typically an **A** record on host
   `@` → Vercel's IP (currently `76.76.21.21`, confirm in Vercel), and a **CNAME** on host
   `www` → `cname.vercel-dns.com`. Remove GoDaddy's parked-page A record and any forwarding.
4. Wait for DNS to propagate (minutes–48h). Vercel issues the HTTPS certificate automatically.

After this, **every push to `main` auto-deploys**. Once Keystatic (spec 002) is live, an
editor save commits to the repo and triggers the same auto-deploy.

### Post-deploy check

Run Lighthouse on the live `/` and an article page (Chrome DevTools or
[PageSpeed Insights](https://pagespeed.web.dev/)); target ≥ 95 across all categories.
