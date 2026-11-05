import type { Content, Platform, Project, Social } from "@/lib/schema";
import type { LeetCodeStats } from "@/lib/live";
import { CertificateGallery } from "./CertificateGallery";
import { Icon } from "./Icon";
import { AiBotsDiagram } from "./Showcase";
import { ExtLink, Section, SectionHead, SocialChip, brandOf } from "./ui";

/* ───────────────────────────── hero ───────────────────────────── */

export function Hero({ content, showcaseProject }: { content: Content; showcaseProject?: Project }) {
  const { profile, socials, showcase } = content;
  const [first, ...rest] = profile.name.split(" ");
  const last = rest.at(-1) ?? "";
  const showDiagram = showcase.enabled && showcase.projectId === "ai-bots";

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-36">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-plasma/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-60 size-[28rem] rounded-full bg-ion/10 blur-[120px]" />

      <div className={`relative mx-auto grid max-w-6xl items-center gap-12 lg:gap-14 ${showDiagram ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
        <div className="min-w-0">
          {profile.openToWork && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-slate/60 px-3 py-1.5 text-sm text-mute">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ion opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-ion" />
              </span>
              Open to internships and collaborations
            </p>
          )}

          <h1 className="text-[clamp(3.6rem,15vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.022em]" style={{ fontStretch: "78%" }}>
            <span className="block">{first}</span>
            <span className="block bg-gradient-to-r from-ink via-ink to-mute bg-clip-text text-transparent">{last}</span>
          </h1>

          <p className="mt-6 text-xl font-semibold sm:text-2xl">
            {profile.role}
            {profile.education.school && <span className="text-mute"> at {profile.education.school}</span>}
          </p>
          <p className="mt-3 max-w-[36rem] whitespace-pre-line text-lg text-mute">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              See my work
            </a>
            {profile.resumeUrl && (
              <ExtLink href={profile.resumeUrl} className="btn btn-ghost">
                <Icon name="doc" className="size-4" /> Résumé
              </ExtLink>
            )}
          </div>

          {socials.length > 0 && (
            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-1" aria-label="Profiles">
              {socials.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <SocialChip s={s} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {showDiagram && (
          <div className="min-w-0">
            <AiBotsDiagram project={showcaseProject} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────── live widgets ───────────────────────────── */

function LiveBadge({ live, label }: { live: boolean; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-mute">
      <span className={`size-1.5 rounded-full ${live ? "bg-ion shadow-[0_0_8px_var(--color-ion)]" : "bg-mute"}`} />
      {label ?? (live ? "Live" : "Saved snapshot")}
    </span>
  );
}

function Ring({ stats }: { stats: LeetCodeStats }) {
  // Three arcs proportional to each difficulty's share of solved problems.
  const r = 52;
  const c = 2 * Math.PI * r;
  const total = Math.max(stats.easy + stats.medium + stats.hard, 1);
  const gap = 6;
  const segs = [
    { v: stats.easy, color: "var(--color-ion)" },
    { v: stats.medium, color: "var(--color-ember)" },
    { v: stats.hard, color: "var(--color-danger)" },
  ];
  let offset = 0;
  return (
    <svg viewBox="0 0 128 128" className="size-36 shrink-0 -rotate-90 sm:size-40" aria-hidden>
      <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-line)" strokeWidth="10" />
      {segs.map((s, i) => {
        const len = Math.max((s.v / total) * c - gap, 0);
        const el = (
          <circle
            key={i}
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${len} ${c}`}
            strokeDashoffset={-offset}
            style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
          />
        );
        offset += (s.v / total) * c;
        return el;
      })}
    </svg>
  );
}

function LeetCodeCard({ stats, username }: { stats: LeetCodeStats; username: string }) {
  const rows = [
    { label: "Easy", v: stats.easy, total: stats.totals?.easy, color: "bg-ion" },
    { label: "Medium", v: stats.medium, total: stats.totals?.medium, color: "bg-ember" },
    { label: "Hard", v: stats.hard, total: stats.totals?.hard, color: "bg-danger" },
  ];
  return (
    <div className="glass flex h-full flex-col p-6 sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Icon name="leetcode" className="size-5 text-ember" /> LeetCode
        </h3>
        <LiveBadge live={stats.live} />
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <Ring stats={stats} />
          <div className="absolute inset-0 grid place-content-center text-center">
            <span className="text-4xl font-extrabold tabular-nums tracking-tight">{stats.solved}</span>
            <span className="text-xs text-mute">solved</span>
          </div>
        </div>
        <dl className="w-full space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-sm">
                <dt className="text-mute">{r.label}</dt>
                <dd className="tabular-nums">
                  <span className="font-semibold">{r.v}</span>
                  {r.total ? <span className="text-mute"> / {r.total}</span> : null}
                </dd>
              </div>
              {r.total ? (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                  <div className={`h-full rounded-full ${r.color}`} style={{ width: `${Math.min((r.v / r.total) * 100, 100)}%` }} />
                </div>
              ) : null}
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-mute">
        <span>{stats.ranking ? `Global rank ${stats.ranking.toLocaleString("en-IN")}` : `@${username}`}</span>
        <ExtLink href={`https://leetcode.com/u/${username}/`} className="inline-flex items-center gap-1 text-ink hover:text-plasma">
          Profile <Icon name="arrow" className="size-4" />
        </ExtLink>
      </div>
    </div>
  );
}

const CODING: Platform[] = ["github", "leetcode", "codolio", "codechef", "codeforces", "hackerrank", "gfg", "kaggle"];

function ProfilesCard({ socials }: { socials: Social[] }) {
  const list = socials.filter((s) => CODING.includes(s.platform));
  if (!list.length) return null;
  return (
    <div className="glass flex h-full flex-col p-6 sm:p-7">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
        <Icon name="terminal" className="size-5 text-plasma" /> Coding profiles
      </h3>
      <ul className="space-y-2">
        {list.map((s) => (
          <li key={s.id}>
            <ProfileRow s={s} />
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-6 text-sm text-mute">Codolio pulls my stats from every platform into one profile.</p>
    </div>
  );
}

/** A row whose brand-tinted background sweeps in from the left on hover. */
function ProfileRow({ s, compact = false }: { s: Social; compact?: boolean }) {
  return (
    <ExtLink
      href={s.url}
      style={{ "--brand": brandOf(s.platform) } as React.CSSProperties}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line px-4 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--brand)_55%,transparent)] ${compact ? "min-h-14" : "min-h-16"}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)] transition-transform duration-500 ease-[var(--ease-snap)] group-hover:scale-x-100"
      />
      <span className="relative grid size-9 shrink-0 place-items-center rounded-lg bg-void/60 text-mute transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-[var(--brand)]">
        <Icon name={s.platform} className="size-[18px]" />
      </span>
      <span className="relative font-semibold">{s.label}</span>
      <span className="relative ml-auto truncate font-mono text-xs text-mute transition-colors group-hover:text-ink">{s.handle}</span>
      <Icon
        name="arrow"
        className="relative size-4 shrink-0 text-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]"
      />
    </ExtLink>
  );
}

export function LiveActivity({ content, leetcode }: { content: Content; leetcode: LeetCodeStats | null }) {
  const { widgets, socials } = content;
  const showLc = widgets.showLeetcode && leetcode;
  const showProfiles = widgets.showGithub && socials.some((s) => CODING.includes(s.platform));
  if (!showLc && !showProfiles) return null;
  return (
    <Section id="live">
      <SectionHead id="live" title="Activity">
        LeetCode stats are pulled live and refresh every few minutes.
      </SectionHead>
      <div className={`grid gap-5 ${showLc && showProfiles ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
        {showLc && <LeetCodeCard stats={leetcode!} username={widgets.leetcodeUsername} />}
        {showProfiles && <ProfilesCard socials={socials} />}
      </div>
    </Section>
  );
}

/* ───────────────────────────── skills ───────────────────────────── */

export function Skills({ skills }: { skills: Content["skills"] }) {
  if (!skills.length) return null;
  return (
    <Section id="skills">
      <SectionHead id="skills" title="Toolbox" />
      <dl className="border-t border-line">
        {skills.map((g) => (
          <div key={g.id} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[12rem_1fr] sm:items-baseline">
            <dt className="text-mute">{g.name}</dt>
            <dd className="flex flex-wrap gap-x-6 gap-y-2 text-[clamp(1.15rem,2.4vw,1.5rem)] font-semibold tracking-tight">
              {g.items.map((s) => (
                <span key={s} className="cursor-default transition-colors duration-200 hover:text-plasma">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* ───────────────────────────── hackathons + certificates ───────────────────────────── */

export function Hackathons({ hackathons, certificates }: { hackathons: Content["hackathons"]; certificates: Content["certificates"] }) {
  if (!hackathons.length && !certificates.length) return null;
  return (
    <Section id="hackathons">
      <SectionHead id="hackathons" title="Hackathons & certificates">
        Where most of my projects started.
      </SectionHead>

      {hackathons.length > 0 && (
        <ol className="relative grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {hackathons.map((h) => {
            const inner = (
              <>
                <span className="mt-1.5 grid size-8 shrink-0 place-items-center rounded-full border border-line bg-slate text-mute transition-all duration-300 group-hover:border-plasma/60 group-hover:text-plasma">
                  <Icon name="trophy" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-bold tracking-tight transition-colors group-hover:text-plasma">{h.name}</span>
                    {h.year && <span className="shrink-0 font-mono text-xs tabular-nums text-mute">{h.year}</span>}
                  </span>
                  {h.organizer && <span className="block text-sm text-mute">{h.organizer}</span>}
                  {h.note && <span className="mt-1 block text-sm text-ink/80">{h.note}</span>}
                </span>
                {h.url && (
                  <Icon name="arrow" className="mt-2 size-4 shrink-0 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plasma" />
                )}
              </>
            );
            return (
              <li key={h.id} className="border-b border-line">
                {h.url ? (
                  <ExtLink href={h.url} className="group flex gap-4 py-4">
                    {inner}
                  </ExtLink>
                ) : (
                  <div className="group flex gap-4 py-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {certificates.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-mute">
            <Icon name="award" className="size-5" /> Certificates
          </h3>
          <CertificateGallery items={certificates} />
        </div>
      )}
    </Section>
  );
}

/* ───────────────────────────── contact / footer ───────────────────────────── */

export function Contact({ content }: { content: Content }) {
  const { profile, socials } = content;
  const linkedin = socials.find((s) => s.platform === "linkedin");
  return (
    <Section id="contact" className="pb-10">
      <div className="glass overflow-hidden p-6 sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="contact-title" className="text-[clamp(2.4rem,7vw,4.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em]" style={{ fontStretch: "82%" }}>
              Have an idea worth building?
            </h2>
            <p className="mt-4 max-w-md text-lg text-mute">{profile.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="btn btn-primary">
                  <Icon name="email" className="size-4" /> Email me
                </a>
              ) : (
                linkedin && (
                  <ExtLink href={linkedin.url} className="btn btn-primary">
                    <Icon name="linkedin" className="size-4" /> Message me on LinkedIn
                  </ExtLink>
                )
              )}
              {profile.resumeUrl && (
                <ExtLink href={profile.resumeUrl} className="btn btn-ghost">
                  <Icon name="doc" className="size-4" /> Résumé
                </ExtLink>
              )}
            </div>
          </div>

          <ul className="space-y-2 self-end">
            {socials.map((s) => (
              <li key={s.id}>
                <ProfileRow s={s} compact />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-10 flex flex-col gap-2 text-sm text-mute sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          {profile.education.degree}
          {profile.education.graduation && `, class of ${profile.education.graduation}`}
        </p>
      </footer>
    </Section>
  );
}
