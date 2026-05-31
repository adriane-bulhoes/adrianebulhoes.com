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
    }),
});

export const collections = { fieldnotes };
