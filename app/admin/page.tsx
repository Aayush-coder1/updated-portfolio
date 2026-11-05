import type { Metadata } from "next";
import { getContent, storageMode } from "@/lib/store";
import { Dashboard } from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

// Access is enforced by middleware.ts (redirects to /admin/login without a valid session).
export default async function AdminPage() {
  const content = await getContent();
  return <Dashboard initial={content} storage={storageMode()} isProd={process.env.NODE_ENV === "production"} />;
}
