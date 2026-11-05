import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Aayush Wanve: Tech & AI builder", template: "%s · Aayush Wanve" },
  description:
    "Aayush Ajay Wanve, Computer Engineering student at VESIT, Mumbai, building practical tools powered by AI: agents, developer tools and full-stack web apps.",
  openGraph: {
    title: "Aayush Wanve: Tech & AI builder",
    description: "AI agents, developer tools, full-stack web apps and hackathon builds.",
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@aayucooldev" },
};

export const viewport: Viewport = {
  themeColor: "#06080d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
