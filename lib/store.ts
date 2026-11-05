import "server-only";
import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/content.json";
import { ContentSchema, type Content } from "./schema";

/**
 * Content storage with two backends:
 *  1. Upstash Redis over its REST API — used whenever credentials are set
 *     (works on Vercel and any serverless host; free tier is plenty).
 *  2. data/content.json on disk — the local/dev fallback, and the seed
 *     used the first time Redis is empty.
 */

const KEY = "portfolio:content:v1";
const FILE = path.join(process.cwd(), "data", "content.json");

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function storageMode(): "redis" | "file" {
  return redisConfig() ? "redis" : "file";
}

async function redis<T>(command: (string | number)[]): Promise<T> {
  const cfg = redisConfig()!;
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const json = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || json.error) throw new Error(`Redis error: ${json.error ?? res.status}`);
  return json.result as T;
}

function parse(raw: unknown): Content {
  const result = ContentSchema.safeParse(raw);
  if (result.success) return result.data;
  console.error("Stored content failed validation, using seed:", result.error.issues.slice(0, 3));
  return ContentSchema.parse(seed);
}

export async function getContent(): Promise<Content> {
  try {
    if (redisConfig()) {
      const value = await redis<string | null>(["GET", KEY]);
      if (value) return parse(JSON.parse(value));
      return ContentSchema.parse(seed); // Empty database: serve the seed until first save.
    }
    const file = await fs.readFile(FILE, "utf8");
    return parse(JSON.parse(file));
  } catch (err) {
    console.error("getContent failed, using seed:", err);
    return ContentSchema.parse(seed);
  }
}

export async function saveContent(content: Content): Promise<void> {
  const data = ContentSchema.parse(content);
  if (redisConfig()) {
    await redis(["SET", KEY, JSON.stringify(data)]);
    return;
  }
  try {
    const tmp = `${FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
    await fs.rename(tmp, FILE);
  } catch (err) {
    throw new Error(
      "Couldn't write data/content.json. On Vercel and other serverless hosts the disk is read-only — add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
      { cause: err },
    );
  }
}
