import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    date: z.date(),
    type: z.enum(["talk", "hackathon", "workshop", "camp", "visit", "other"]),
    series: z.enum(["talks", "camp", "hackathon", "workshop", "other"]),
    guest: z.string().optional(),
    guestTitle: z.string().optional(),
    guestTitleEn: z.string().optional(),
    summary: z.string(),
    summaryEn: z.string().optional(),
    image: z.string().optional(),
    venue: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    featured: z.boolean().default(false),
  }),
});

const dialogues = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/dialogues" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    interviewee: z.string(),
    intervieweeTitle: z.string(),
    intervieweeTitleEn: z.string().optional(),
    date: z.date(),
    summary: z.string(),
    summaryEn: z.string().optional(),
    image: z.string().optional(),
    wordCount: z.number().optional(),
    tags: z.array(z.string()).optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { events, dialogues };
