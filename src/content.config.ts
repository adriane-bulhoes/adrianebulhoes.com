import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Field Notes — the Markdown-driven blog. One `.md` file per entry in
 * src/content/fieldnotes/. Frontmatter is Zod-validated, so a malformed entry
 * fails the build instead of shipping broken.
 */
const fieldnotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fieldnotes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      location: z.string(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      excerpt: z.string().optional(),
      draft: z.boolean().default(false),
      lang: z.enum(['pt', 'en']).default('pt'),
    }),
});

/**
 * Projetos — research projects. One `.md` file per project. The `visual` enum
 * picks a preset SVG; an optional `cover` image overrides it (hybrid visuals).
 */
const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      eyebrow: z.string().optional(),
      coords: z.string().optional(),
      summary: z.string().optional(),
      status: z.enum(['em desenvolvimento', 'concluído', 'planeado', 'in development', 'completed', 'planned']),
      lang: z.enum(['pt', 'en']).default('pt'),
      order: z.number().default(0),
      stats: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .default([]),
      tools: z.array(z.string()).default([]),
      visual: z.enum(['mangrove', 'geothermal', 'satellite-grid', 'basalt-strata']).optional(),
      cover: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { fieldnotes, projetos };
