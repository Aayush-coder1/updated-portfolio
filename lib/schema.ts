import { z } from "zod";

/** Accepts "" (unset) or a real http(s) URL. Blocks javascript: and data: links. */
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "Must start with http:// or https://");

const requiredUrl = optionalUrl.refine((v) => v !== "", "A URL is required");

/** Image or file: "" (unset), an http(s) URL, or a path inside /public such as /projects/app.jpg. */
const assetUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//i.test(v) || /^\/(?!\/)[\w\-./%]+$/.test(v), "Use https://… or a path like /projects/app.jpg");

const id = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes");

const shortText = (max = 120) => z.string().trim().max(max);

export const PLATFORMS = [
  "github",
  "linkedin",
  "x",
  "leetcode",
  "codolio",
  "codechef",
  "codeforces",
  "hackerrank",
  "gfg",
  "kaggle",
  "devto",
  "medium",
  "instagram",
  "youtube",
  "email",
  "website",
  "other",
] as const;

export const ProjectSchema = z.object({
  id,
  title: shortText(80).min(1, "Title is required"),
  summary: shortText(400).min(1, "Summary is required"),
  tags: z.array(shortText(40).min(1)).max(12),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean(),
  /** Preview image. Empty shows a generated cover instead. */
  image: assetUrl.default(""),
  /** Hackathon or context, shown as a badge on the card. */
  event: shortText(60).default(""),
  /** Private repos link to the GitHub profile instead of a 404. */
  repoPrivate: z.boolean().default(false),
});

export const SkillGroupSchema = z.object({
  id,
  name: shortText(40).min(1),
  items: z.array(shortText(40).min(1)).max(40),
});

export const SocialSchema = z.object({
  id,
  platform: z.enum(PLATFORMS),
  label: shortText(40).min(1),
  handle: shortText(80),
  url: requiredUrl.or(z.string().regex(/^mailto:[^\s]+$/)),
});

export const HackathonSchema = z.object({
  id,
  name: shortText(100).min(1),
  note: shortText(300),
  year: shortText(30),
  url: optionalUrl,
  organizer: shortText(100).default(""),
});

export const CertificateSchema = z.object({
  id,
  title: shortText(100).min(1),
  issuer: shortText(100),
  date: shortText(40),
  image: assetUrl,
  url: assetUrl,
});

const FeatureSchema = z.object({
  id,
  title: shortText(60).min(1),
  body: shortText(300),
});

export const ShowcaseSchema = z.object({
  enabled: z.boolean(),
  projectId: shortText(80),
  eyebrow: shortText(60),
  title: shortText(120),
  summary: shortText(600),
  features: z.array(FeatureSchema).max(12),
  stack: z.array(shortText(40).min(1)).max(30),
});

export const ContentSchema = z.object({
  profile: z.object({
    name: shortText(80).min(1),
    shortName: shortText(40).min(1),
    role: shortText(80).min(1),
    tagline: shortText(200),
    bio: shortText(1200),
    location: shortText(80),
    education: z.object({
      school: shortText(100),
      degree: shortText(100),
      graduation: shortText(20),
    }),
    email: z.union([z.literal(""), z.string().trim().email().max(120)]),
    resumeUrl: optionalUrl,
    openToWork: z.boolean(),
  }),
  socials: z.array(SocialSchema).max(30),
  projects: z.array(ProjectSchema).max(60),
  skills: z.array(SkillGroupSchema).max(20),
  hackathons: z.array(HackathonSchema).max(60),
  certificates: z.array(CertificateSchema).max(60).default([]),
  showcase: ShowcaseSchema.default({ enabled: false, projectId: "", eyebrow: "", title: "", summary: "", features: [], stack: [] }),
  widgets: z.object({
    githubUsername: shortText(39),
    leetcodeUsername: shortText(40),
    showGithub: z.boolean(),
    showLeetcode: z.boolean(),
    leetcodeFallback: z.object({
      solved: z.number().int().min(0),
      easy: z.number().int().min(0),
      medium: z.number().int().min(0),
      hard: z.number().int().min(0),
    }),
  }),
});

export type Content = z.infer<typeof ContentSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export type Social = z.infer<typeof SocialSchema>;
export type Hackathon = z.infer<typeof HackathonSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type Showcase = z.infer<typeof ShowcaseSchema>;
export type Feature = Showcase["features"][number];
export type Platform = (typeof PLATFORMS)[number];
