import type { Project } from "@/lib/schema";
import { Icon } from "./Icon";
import { Spotlight } from "./Spotlight";
import { ExtLink, Section, SectionHead, Tags } from "./ui";

function githubProfile(url: string) {
  return url.match(/^https:\/\/github\.com\/[^/]+/)?.[0] ?? url;
}

/** Where a click on the card goes: the repo, the GitHub profile for private repos, else the live site. */
function primaryHref(p: Project) {
  if (p.repoUrl) return p.repoPrivate ? githubProfile(p.repoUrl) : p.repoUrl;
  return p.liveUrl;
}

function repoLabel(url: string) {
  return url.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "");
}

/** Deterministic hue per project so generated covers differ but never change between builds. */
function hueOf(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

/** Shown when a project has no screenshot yet. */
function GeneratedCover({ p }: { p: Project }) {
  const h = hueOf(p.id);
  return (
    <div
      className="relative grid size-full place-items-center overflow-hidden"
      style={{
        background: `radial-gradient(60% 80% at 25% 20%, hsl(${h} 70% 55% / .28), transparent 70%), radial-gradient(50% 70% at 85% 90%, hsl(${(h + 60) % 360} 70% 55% / .22), transparent 70%), var(--color-slate-2)`,
      }}
    >
      <div aria-hidden className="grid-bg absolute inset-0 opacity-70 [mask-image:none]" />
      <div className="relative px-6 text-center transition-transform duration-500 group-hover:scale-[1.04]">
        <p className="font-mono text-xs text-mute">~/{p.repoUrl ? repoLabel(p.repoUrl) : p.id}</p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink/90" style={{ fontStretch: "82%" }}>
          {p.title}
        </p>
        {p.tags[0] && <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: `hsl(${h} 80% 75%)` }}>{p.tags[0]}</p>}
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const href = primaryHref(p);
  return (
    <li className="h-full min-w-0">
      <Spotlight className="glass group relative flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_var(--color-plasma)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[18px] border-b border-line bg-slate-2">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt={`Screenshot of ${p.title}`}
              loading="lazy"
              decoding="async"
              width={1200}
              height={750}
              className="size-full object-cover object-top transition-transform duration-500 ease-[var(--ease-snap)] group-hover:scale-[1.04]"
            />
          ) : (
            <GeneratedCover p={p} />
          )}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate/90 to-transparent" />
          {p.event && (
            <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-void/75 px-2.5 py-1 font-mono text-[11px] text-ink/90 backdrop-blur">
              {p.event}
            </span>
          )}
          {p.liveUrl && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-void/75 px-2.5 py-1 font-mono text-[11px] text-ion backdrop-blur">
              <span className="size-1.5 rounded-full bg-ion shadow-[0_0_8px_var(--color-ion)]" /> live
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-xl font-bold tracking-tight">
            {href ? (
              <ExtLink href={href} className="after:absolute after:inset-0 after:z-[1] after:content-[''] group-hover:text-plasma">
                {p.title}
              </ExtLink>
            ) : (
              p.title
            )}
          </h3>
          <p className="text-sm text-ink/75">{p.summary}</p>
          <Tags tags={p.tags} max={5} />

          <div className="mt-auto flex items-center gap-3 pt-3 text-sm">
            {p.repoUrl && (
              <span className="flex min-w-0 items-center gap-1.5 text-mute">
                <Icon name={p.repoPrivate ? "lock" : "github"} className="size-4 shrink-0" />
                <span className="truncate font-mono text-xs">{p.repoPrivate ? "private repo" : repoLabel(p.repoUrl)}</span>
              </span>
            )}
            {p.liveUrl && (
              <ExtLink
                href={p.liveUrl}
                className="relative z-[2] ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-ion/60 hover:text-ion"
              >
                Live demo <Icon name="arrow" className="size-3.5" />
              </ExtLink>
            )}
          </div>
        </div>
      </Spotlight>
    </li>
  );
}

export function Projects({ projects, githubUrl, hideId }: { projects: Project[]; githubUrl?: string; hideId?: string }) {
  const list = projects.filter((p) => p.id !== hideId);
  const featured = list.filter((p) => p.featured);
  const more = list.filter((p) => !p.featured);

  return (
    <Section id="work">
      <SectionHead id="work" title="Things I've built">
        AI tools, developer tools and web apps, most of them started at a hackathon. Click a card to open its code on GitHub.
      </SectionHead>

      {featured.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </ul>
      )}

      {more.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold text-mute">Also built</h3>
          <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {more.map((p) => {
              const href = primaryHref(p);
              const body = (
                <>
                  <span className="flex items-center gap-2 font-semibold">
                    {p.title}
                    {href && (
                      <Icon
                        name="arrow"
                        className="size-4 text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-plasma"
                      />
                    )}
                    {p.liveUrl && href !== p.liveUrl && (
                      <ExtLink href={p.liveUrl} className="ml-auto rounded-full border border-line px-2 py-0.5 font-mono text-[11px] font-normal text-mute hover:border-ion/60 hover:text-ion">
                        live
                      </ExtLink>
                    )}
                  </span>
                  <span className="mt-1 block text-sm text-mute">{p.summary}</span>
                </>
              );
              return (
                <li key={p.id} className="border-b border-line">
                  {href ? (
                    <div className="group relative py-4">
                      <ExtLink href={href} className="absolute inset-0" label={`${p.title} on GitHub`}>
                        <span className="sr-only">{p.title}</span>
                      </ExtLink>
                      <div className="pointer-events-none relative [&_a]:pointer-events-auto">{body}</div>
                    </div>
                  ) : (
                    <div className="py-4">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {githubUrl && (
        <div className="mt-8 flex justify-center">
          <ExtLink href={githubUrl} className="btn btn-ghost group">
            <Icon name="github" className="size-4 transition-transform group-hover:-rotate-6 group-hover:scale-110" /> More on GitHub
            <Icon name="arrow" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </ExtLink>
        </div>
      )}
    </Section>
  );
}
