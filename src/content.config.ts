import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    summary: z.string(),
    problem: z.string(),
    approach: z.string(),
    verifiedOutput: z.string(),
    order: z.number().int(),
    featured: z.boolean(),
    technologies: z.array(z.string()),
    sourceUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    scope: z.string(),
  }),
});
export const collections = { projects };
