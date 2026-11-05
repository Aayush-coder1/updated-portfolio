import type { Platform, Social } from "@/lib/schema";
import { Icon } from "./Icon";

/* Shared building blocks for the public site. */

export function SectionHead({ id, title, eyebrow, children }: { id: string; title: string; eyebrow?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-col gap-2 sm:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-plasma">{eyebrow}</p>}
        <h2 id={`${id}-title`} className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      {children && <div className="max-w-md text-mute md:text-right">{children}</div>}
    </div>
  );
}

export function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function ExtLink({
  href,
  children,
  className = "",
  style,
  label,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  // Same-site paths (like /certificates/x.pdf) still open in a new tab.
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} aria-label={label}>
      {children}
    </a>
  );
}

export function Tags({ tags, max }: { tags: string[]; max?: number }) {
  if (!tags.length) return null;
  const shown = max ? tags.slice(0, max) : tags;
  const extra = tags.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <li key={t} className="rounded-md border border-line bg-void/50 px-2 py-0.5 font-mono text-[11px] text-mute">
          {t}
        </li>
      ))}
      {extra > 0 && <li className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-mute">+{extra}</li>}
    </ul>
  );
}

/** Brand colours, tuned to stay readable on the dark background. */
export const BRAND: Partial<Record<Platform, string>> = {
  github: "#f0f3f8",
  linkedin: "#3d9bff",
  x: "#f0f3f8",
  leetcode: "#ffa116",
  codolio: "#9b87ff",
  codechef: "#d0a27a",
  codeforces: "#4f8ff7",
  hackerrank: "#2ec866",
  gfg: "#2f8d46",
  kaggle: "#20beff",
  instagram: "#ff5fa2",
  youtube: "#ff4e45",
  email: "#3be8c4",
};

export const brandOf = (p: Platform) => BRAND[p] ?? "#9b87ff";

/**
 * Icon + handle with a little life on hover: the icon tilts and grows, the
 * text takes the brand colour and an underline draws in from the left.
 */
export function SocialChip({ s }: { s: Social }) {
  return (
    <ExtLink
      href={s.url}
      label={`${s.label}: ${s.handle || s.label}`}
      style={{ "--brand": brandOf(s.platform) } as React.CSSProperties}
      className="group inline-flex min-h-10 items-center gap-2 rounded-full font-mono text-[13px] text-mute transition-colors duration-200 hover:text-[var(--brand)] active:scale-95"
    >
      <Icon name={s.platform} className="size-4 transition-transform duration-200 ease-[var(--ease-snap)] group-hover:-rotate-6 group-hover:scale-125" />
      <span className="relative">
        {s.handle || s.label}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--brand)] transition-all duration-200 group-hover:w-full" />
      </span>
    </ExtLink>
  );
}
