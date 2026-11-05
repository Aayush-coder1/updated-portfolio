import type { Content, Project } from "@/lib/schema";
import { Icon, type IconName } from "./Icon";
import { ExtLink, Section } from "./ui";

/* ───────────────── ai-bots architecture card (hero) ───────────────── */

type NodeTone = "client" | "control" | "worker" | "sandbox" | "data" | "telemetry";

const TONE: Record<NodeTone, string> = {
  client: "border-indigo-400/40 text-indigo-300",
  control: "border-zinc-400/30 text-zinc-300",
  worker: "border-violet-400/60 text-violet-300 shadow-[0_0_30px_-12px_#a78bfa]",
  sandbox: "border-sky-400/40 text-sky-300",
  data: "border-emerald-400/40 text-emerald-300",
  telemetry: "border-dashed border-rose-400/50 text-rose-300",
};

function Node({ tone, icon, title, sub }: { tone: NodeTone; icon: IconName; title: string; sub: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 rounded-xl border bg-slate-2/70 px-3 py-2.5 ${TONE[tone]}`}>
      <Icon name={icon} className="size-4 shrink-0" />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-ink">{title}</p>
        <p className="truncate font-mono text-[10.5px] text-mute">{sub}</p>
      </div>
    </div>
  );
}

function Flow({ label, delay = 0 }: { label?: string; delay?: number }) {
  return (
    <div className="relative flex h-7 items-center justify-center" aria-hidden>
      <span className="flow-v" style={{ "--d": `${delay}s` } as React.CSSProperties} />
      {label && <span className="absolute left-1/2 ml-3 font-mono text-[10px] text-mute">{label}</span>}
    </div>
  );
}

/** How one chat turn moves through ai-bots, drawn from its README. */
export function AiBotsDiagram({ project }: { project?: Project }) {
  return (
    <div className="glass group/diagram relative overflow-hidden p-4 sm:p-5">
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-violet-500/20 blur-3xl transition-opacity duration-500 group-hover/diagram:opacity-70" />

      <div className="relative mb-4 flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-xs text-mute">ai-bots · one chat turn</span>
        {project?.liveUrl && (
          <ExtLink
            href={project.liveUrl}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-mute transition-colors hover:border-ion/50 hover:text-ion"
          >
            <span className="size-1.5 rounded-full bg-ion shadow-[0_0_8px_var(--color-ion)]" /> Live
          </ExtLink>
        )}
      </div>

      <figure className="relative" aria-label="Architecture of ai-bots: the browser gets a scoped token, a Trigger.dev worker runs Gemini with tools, tools run in Daytona and E2B sandboxes or on the worker, and the transcript and usage are stored in Neon Postgres, with telemetry to Sentry.">
        <Node tone="client" icon="chat" title="Browser · Next.js 16" sub="Clerk session + plan check" />
        <Flow label="token scoped to one chat" />
        <Node tone="worker" icon="spark" title="Trigger.dev worker" sub="chat.agent → Gemini via AI SDK" />
        <Flow label="tool calls" delay={0.6} />
        <div className="grid grid-cols-2 gap-2">
          <Node tone="sandbox" icon="terminal" title="Daytona" sub="bash + files" />
          <Node tone="sandbox" icon="monitor" title="E2B Desktop" sub="live noVNC screen" />
          <Node tone="sandbox" icon="play" title="Code Interpreter" sub="internet-enabled code" />
          <Node tone="control" icon="website" title="Web tools" sub="search + fetch, SSRF-guarded" />
        </div>
        <Flow label="persist + meter" delay={1.2} />
        <div className="grid grid-cols-[1.4fr_1fr] gap-2">
          <Node tone="data" icon="meter" title="Neon Postgres" sub="transcripts · usage ledger" />
          <Node tone="telemetry" icon="spark" title="Sentry" sub="errors · traces" />
        </div>
      </figure>

      <a
        href="#showcase"
        className="relative mt-4 flex items-center justify-between rounded-xl border border-line px-3 py-2.5 text-sm transition-colors hover:border-plasma/50 hover:bg-slate-2"
      >
        <span>
          <span className="text-mute">Latest build:</span> <span className="font-semibold">ai-bots</span>
        </span>
        <span className="inline-flex items-center gap-1 text-mute">
          How it works <Icon name="arrow" className="size-4 rotate-90" />
        </span>
      </a>
    </div>
  );
}

/* ───────────────── showcase section ───────────────── */

const FEATURE_ICONS: Record<string, IconName> = {
  "agentic-chat": "chat",
  "live-desktop": "monitor",
  sandboxes: "terminal",
  memory: "brain",
  "group-chats": "users",
  billing: "meter",
};

export function ShowcaseSection({ showcase, project }: { showcase: Content["showcase"]; project?: Project }) {
  if (!showcase.enabled) return null;
  const githubProfile = project?.repoUrl.match(/^https:\/\/github\.com\/[^/]+/)?.[0];

  return (
    <Section id="showcase">
      <div className="glass overflow-hidden">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="flex flex-col">
            {showcase.eyebrow && (
              <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 font-mono text-xs text-violet-200">
                <Icon name="spark" className="size-3.5" /> {showcase.eyebrow}
              </p>
            )}
            <h2 id="showcase-title" className="text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.04] tracking-[-0.03em]">
              {showcase.title}
            </h2>
            <p className="mt-4 text-ink/80">{showcase.summary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project?.liveUrl && (
                <ExtLink href={project.liveUrl} className="btn btn-primary">
                  Open the app <Icon name="arrow" className="size-4" />
                </ExtLink>
              )}
              {project?.repoUrl &&
                (project.repoPrivate ? (
                  <ExtLink href={githubProfile ?? project.repoUrl} className="btn btn-ghost" label="Repository is private. Opens GitHub profile.">
                    <Icon name="lock" className="size-4" /> Repo is private for now
                  </ExtLink>
                ) : (
                  <ExtLink href={project.repoUrl} className="btn btn-ghost">
                    <Icon name="github" className="size-4" /> Source
                  </ExtLink>
                ))}
            </div>

            {showcase.stack.length > 0 && (
              <div className="mt-auto pt-8">
                <p className="mb-2 text-sm text-mute">Built with</p>
                <ul className="flex flex-wrap gap-1.5">
                  {showcase.stack.map((s) => (
                    <li key={s} className="rounded-md border border-line bg-void/60 px-2 py-1 font-mono text-xs text-ink/85">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <ul className="grid gap-px self-start overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {showcase.features.map((f) => (
              <li key={f.id} className="group bg-slate/95 p-5 transition-colors hover:bg-slate-2">
                <span className="mb-3 grid size-9 place-items-center rounded-lg border border-line bg-void/60 text-plasma transition-all duration-200 group-hover:-rotate-6 group-hover:scale-110 group-hover:border-plasma/50">
                  <Icon name={FEATURE_ICONS[f.id] ?? "spark"} className="size-[18px]" />
                </span>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-mute">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
