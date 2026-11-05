import { NextResponse } from "next/server";
import { checkPassword, createSession, sameOrigin, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth";

// Best-effort brute-force throttle (per server instance): 5 attempts / 10 min / IP.
const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin." }, { status: 403 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.reset > now && entry.count >= LIMIT) {
    const mins = Math.ceil((entry.reset - now) / 60000);
    return NextResponse.json({ error: `Too many attempts. Try again in ${mins} min.` }, { status: 429 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD isn't set on the server." }, { status: 500 });
  }

  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  const password = typeof body.password === "string" ? body.password.slice(0, 256) : "";

  if (!(await checkPassword(password))) {
    const e = entry && entry.reset > now ? entry : { count: 0, reset: now + WINDOW };
    e.count++;
    attempts.set(ip, e);
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    return NextResponse.json({ error: "That password isn't right." }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
