import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/notes"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    readingTime: z.string().default("5 分钟阅读"),
    category: z.string().default("笔记"),
    kicker: z.string().default("研究笔记"),
    excerpt: z.string().default(""),
    tags: z.array(z.string()).min(1),
    related: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { notes };
