import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Files starting with "_" are templates and are never published.
const md = (dir: string) => glob({ pattern: '**/[^_]*.md', base: `./content/${dir}` });

const url = z.string().url();

const home = defineCollection({
  loader: md('home'),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string(),
    lead: z.string(),
    pillars: z
      .array(
        z.object({
          piece: z.string(),
          title: z.string(),
          text: z.string(),
          link_text: z.string(),
          href: z.string(),
        }),
      )
      .min(1),
    support_title: z.string(),
    support_text: z.string(),
  }),
});

const pages = defineCollection({
  loader: md('pages'),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    source_url: url.optional(),
  }),
});

const coaches = defineCollection({
  loader: md('coaches'),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    title: z.string().optional(),
    rating: z.number().int().positive().optional(),
    photo: z.string().optional(),
    order: z.number().int(),
    source_url: url.optional(),
  }),
});

const performances = defineCollection({
  loader: md('performances'),
  schema: z.object({
    title: z.string(),
    year: z.number().int().min(2014),
    category: z.string(),
    result: z.string(),
    order: z.number().int(),
    featured: z.boolean().default(false),
    source_url: url.optional(),
  }),
});

const galleries = defineCollection({
  loader: md('galleries'),
  schema: z
    .object({
      title: z.string(),
      year: z.number().int(),
      location: z.string().optional(),
      cover_image: z.string(),
      source_url: url.optional(),
      photos: z.array(z.object({ file: z.string(), alt: z.string().min(3) })).default([]),
      album_url: url.optional(),
      album_count: z.number().int().positive().optional(),
    })
    .refine((g) => g.photos.length > 0 || g.album_url, {
      message: 'Un album are nevoie de fotografii locale sau de album_url.',
    }),
});

const news = defineCollection({
  loader: md('news'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().min(10),
    cover_image: z.string().optional(),
    category: z.enum(['istoria-clubului', 'lectii', 'premii']).default('istoria-clubului'),
    tags: z.array(z.string()).default([]),
    source_url: url.optional(),
    source_photos: z.number().int().nonnegative().optional(),
    album_url: url.optional(),
    lichess_url: url.optional(),
  }),
});

export const collections = { home, pages, coaches, performances, galleries, news };
