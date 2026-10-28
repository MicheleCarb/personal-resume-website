import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { localizable, localized, stageSchema } from "./content/stage-rules";

const profile = defineCollection({
  loader: file("src/content/profile.yaml"),
  schema: z.object({
    name: z.string().min(1),
    handle: z.string().min(1),
    headline: z.string().min(1),
    location: localized,
    intro: localized,
    links: z.object({
      linkedin: z.url(),
      github: z.url(),
      website: z.url(),
      cv: z.string().startsWith("/").optional(),
    }),
    repository: z.url(),
    skills: z.array(
      z.object({ group: localized, items: z.array(localizable).min(1) }),
    ),
    certifications: z.array(z.string().min(1)),
    languages: z.array(z.object({ name: localized, level: localized })),
  }),
});

// One file per career stage; collection-wide rules live in stage-rules.ts.
const stages = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "src/content/stages" }),
  schema: stageSchema,
});

export const collections = { profile, stages };
