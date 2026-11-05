import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ContentSchema } from "@/lib/schema";
import { getContent, saveContent } from "@/lib/store";
import { sameOrigin } from "@/lib/auth";

// Auth is enforced by middleware.ts for every /api/admin/* route.

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Bad origin." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = ContentSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.slice(0, 5).map((i) => `${i.path.join(".")}: ${i.message}`);
    return NextResponse.json({ error: "Some fields need fixing.", issues }, { status: 400 });
  }

  const ids = (arr: { id: string }[]) => new Set(arr.map((x) => x.id)).size === arr.length;
  const c = parsed.data;
  if (![c.projects, c.skills, c.socials, c.hackathons].every(ids)) {
    return NextResponse.json({ error: "Two items share the same ID. IDs must be unique." }, { status: 400 });
  }

  try {
    await saveContent(c);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
