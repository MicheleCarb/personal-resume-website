import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

// Prose shown on the page exists in every language (ADR 0004).
const localized = z.object({ en: z.string().min(1), it: z.string().min(1) });

const profile = defineCollection({
  loader: file("src/content/profile.yaml"),
  schema: z.object({
    name: z.string().min(1),
    headline: z.string().min(1),
    location: localized,
    intro: localized,
    links: z.object({
      linkedin: z.url(),
      github: z.url(),
      cv: z.string().startsWith("/"),
    }),
    repository: z.url(),
  }),
});

export const collections = { profile };
