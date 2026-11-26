import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const discipline = z.enum(['AI Engineering', 'AI Automation', 'Data Analytics', 'Product Development']);
const publicUrl = z.url({ protocol: /^https$/ });

// Evidence states shown in the ledger. Every claim on a project page carries one.
const evidence = z.object({
  state: z.enum(['verified', 'live', 'by-design', 'private', 'limit']),
  text: z.string(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    category: z.string(),
    thesis: z.string(),
    summary: z.string(),
    year: z.string(),
    role: z.string(),
    status: z.string(),
    order: z.number().int(),
    flagship: z.boolean(),
    disciplines: z.array(discipline).min(1),
    technologies: z.array(z.string()),
    evidence: z.array(evidence).min(2),
    sourceUrl: publicUrl.optional(),
    liveUrl: publicUrl.optional(),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    coverCaption: z.string().optional(),
  }),
});
export const collections = { projects };
