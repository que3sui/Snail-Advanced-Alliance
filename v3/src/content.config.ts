import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    tag: z.enum(["talk", "workshop", "hackathon", "forum", "camp", "visit"]),
    guest: z.string().optional(),
    guestTitle: z.string().optional(),
    venue: z.string().optional(),
    summary: z.string(),
    image: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .optional(),
    featured: z.boolean().default(false),
  }),
});

const dialogues = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dialogues" }),
  schema: z.object({
    title: z.string(),
    interviewee: z.string(),
    intervieweeTitle: z.string(),
    date: z.date(),
    summary: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    links: z
      .array(z.object({ label: z.string(), url: z.string().url() }))
      .optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { events, dialogues };
