"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  PLATFORMS,
  type Certificate,
  type Content,
  type Feature,
  type Hackathon,
  type Platform,
  type Project,
  type SkillGroup,
  type Social,
} from "@/lib/schema";
import { Icon } from "@/components/site/Icon";
import { ChipInput, ImageField, ListEditor, NumberInput, TextArea, TextInput, Toggle, newId } from "./fields";

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "showcase", label: "Showcase" },
  { id: "profile", label: "Profile" },
  { id: "skills", label: "Skills" },
  { id: "platforms", label: "Platforms" },
  { id: "hackathons", label: "Hackathons" },
  { id: "certificates", label: "Certificates" },
  { id: "widgets", label: "Live widgets" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const PLATFORM_META: Record<Platform, { label: string; url?: (h: string) => string }> = {
  github: { label: "GitHub", url: (h) => `https://github.com/${h}` },
  linkedin: { label: "LinkedIn", url: (h) => `https://www.linkedin.com/in/${h}/` },
  x: { label: "X", url: (h) => `https://x.com/${h.replace(/^@/, "")}` },
  leetcode: { label: "LeetCode", url: (h) => `https://leetcode.com/u/${h}/` },
  codolio: { label: "Codolio", url: (h) => `https://codolio.com/profile/${h}` },
  codechef: { label: "CodeChef", url: (h) => `https://www.codechef.com/users/${h}` },
  codeforces: { label: "Codeforces", url: (h) => `https://codeforces.com/profile/${h}` },
  hackerrank: { label: "HackerRank", url: (h) => `https://www.hackerrank.com/profile/${h}` },
  gfg: { label: "GeeksforGeeks", url: (h) => `https://www.geeksforgeeks.org/user/${h}/` },
  kaggle: { label: "Kaggle", url: (h) => `https://www.kaggle.com/${h}` },
  devto: { label: "DEV", url: (h) => `https://dev.to/${h}` },
  medium: { label: "Medium", url: (h) => `https://medium.com/@${h.replace(/^@/, "")}` },
  instagram: { label: "Instagram", url: (h) => `https://www.instagram.com/${h.replace(/^@/, "")}/` },
  youtube: { label: "YouTube", url: (h) => `https://www.youtube.com/@${h.replace(/^@/, "")}` },
  email: { label: "Email", url: (h) => `mailto:${h}` },
  website: { label: "Website" },
  other: { label: "Other" },
};

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved"; at: string } | { kind: "error"; message: string; issues?: string[] };

export function Dashboard({ initial, storage, isProd }: { initial: Content; storage: "redis" | "file"; isProd: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [tab, setTab] = useState<Tab>("projects");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const dirty = useMemo(() => JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (status.kind !== "saved") return;
    const t = setTimeout(() => setStatus({ kind: "idle" }), 3500);
    return () => clearTimeout(t);
  }, [status]);

  const set = <K extends keyof Content>(key: K, value: Content[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setProfile = (patch: Partial<Content["profile"]>) => set("profile", { ...draft.profile, ...patch });
  const setWidgets = (patch: Partial<Content["widgets"]>) => set("widgets", { ...draft.widgets, ...patch });
  const setShowcase = (patch: Partial<Content["showcase"]>) => set("showcase", { ...draft.showcase, ...patch });

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: string[]; savedAt?: string };
      if (res.status === 401) {
        setStatus({ kind: "error", message: "Your session expired. Sign in again — your edits stay in this tab until you reload." });
        return;
      }
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Couldn't save.", issues: data.issues });
        return;
      }
      setSaved(draft);
      setStatus({ kind: "saved", at: data.savedAt ?? new Date().toISOString() });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the server. Check your connection and save again." });
    }
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-dvh pb-32">
      <header className="sticky top-0 z-40 border-b border-line bg-void/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <h1 className="text-lg font-bold tracking-tight">
            Site editor<span className="text-plasma">.</span>
          </h1>
          <span
            className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-mute sm:inline-flex"
            title={storage === "redis" ? "Content is stored in Upstash Redis." : "Content is stored in data/content.json."}
          >
            <span className={`size-1.5 rounded-full ${storage === "redis" ? "bg-ion" : "bg-ember"}`} />
            {storage === "redis" ? "Saved to database" : "Saved to local file"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" className="btn btn-ghost !min-h-10 text-sm">
              View site <Icon name="arrow" className="size-4" />
            </a>
            <button type="button" onClick={signOut} className="btn !min-h-10 px-3 text-sm text-mute hover:text-ink">
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Sections" className="mx-auto max-w-5xl overflow-x-auto px-2 sm:px-4">
          <ul className="flex min-w-max gap-1 pb-2">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === t.id ? "text-ink" : "text-mute hover:text-ink"}`}
                >
                  {tab === t.id && (
                    <motion.span layoutId="tab-pill" className="absolute inset-0 -z-10 rounded-lg bg-slate-2" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                  )}
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {storage === "file" && isProd && (
        <div className="mx-auto mt-4 max-w-5xl px-4 sm:px-6">
          <p className="rounded-xl border border-ember/40 bg-ember/10 p-4 text-sm">
            This deployment has no database connected, so saves will fail on hosts with a read-only disk (like Vercel). Add{" "}
            <code className="font-mono">UPSTASH_REDIS_REST_URL</code> and <code className="font-mono">UPSTASH_REDIS_REST_TOKEN</code> to your environment variables.
          </p>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
            {tab === "projects" && (
              <Panel title="Projects" help="Featured projects appear as cards with a preview image. The rest go under “Also built”. Clicking a card opens its code URL. Order here is the order on the site.">
                <ListEditor<Project>
                  items={draft.projects}
                  onChange={(v) => set("projects", v)}
                  title={(p) => p.title}
                  subtitle={(p) => (p.featured ? "Featured" : "Also built") + (p.event ? ` · ${p.event}` : "") + (p.tags.length ? ` — ${p.tags.join(", ")}` : "")}
                  addLabel="Add project"
                  emptyText="No projects yet. Add your first one."
                  create={() => ({
                    id: newId("project"),
                    title: "New project",
                    summary: "What it does, in one or two sentences.",
                    tags: [],
                    repoUrl: "",
                    liveUrl: "",
                    featured: false,
                    image: "",
                    event: "",
                    repoPrivate: false,
                  })}
                  render={(p, up) => (
                    <>
                      <TextInput label="Title" value={p.title} onChange={(title) => up({ title })} />
                      <TextArea label="Summary" value={p.summary} onChange={(summary) => up({ summary })} hint="Up to 400 characters." />
                      <ChipInput label="Tags" values={p.tags} onChange={(tags) => up({ tags })} placeholder="Next.js, Gemini, Docker" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput label="Code URL" value={p.repoUrl} onChange={(repoUrl) => up({ repoUrl })} placeholder="https://github.com/…" />
                        <TextInput label="Live URL" value={p.liveUrl} onChange={(liveUrl) => up({ liveUrl })} placeholder="https://…" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
                        <ImageField
                          label="Preview image"
                          value={p.image}
                          onChange={(image) => up({ image })}
                          hint="A screenshot URL, or put a file in public/projects/ and type /projects/name.jpg. Empty shows a generated cover."
                        />
                        <TextInput label="Badge" value={p.event} onChange={(event) => up({ event })} placeholder="HACKHAZARDS '26" hint="Hackathon or context." />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Toggle label="Featured" hint="Show as a card with an image." checked={p.featured} onChange={(featured) => up({ featured })} />
                        <Toggle
                          label="Repo is private"
                          hint="Links go to your GitHub profile instead of a page visitors can't open."
                          checked={p.repoPrivate}
                          onChange={(repoPrivate) => up({ repoPrivate })}
                        />
                      </div>
                    </>
                  )}
                />
              </Panel>
            )}

            {tab === "profile" && (
              <Panel title="Profile" help="Your name, intro and the details in the hero and contact sections.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Full name" value={draft.profile.name} onChange={(name) => setProfile({ name })} />
                  <TextInput label="Short name" hint="Shown as the logo in the navigation." value={draft.profile.shortName} onChange={(shortName) => setProfile({ shortName })} />
                  <TextInput label="Role" value={draft.profile.role} onChange={(role) => setProfile({ role })} />
                  <TextInput label="Location" value={draft.profile.location} onChange={(location) => setProfile({ location })} />
                </div>
                <TextArea label="Tagline" value={draft.profile.tagline} onChange={(tagline) => setProfile({ tagline })} rows={2} />
                <TextArea label="Bio" value={draft.profile.bio} onChange={(bio) => setProfile({ bio })} rows={4} hint="Shown in the contact section." />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextInput label="School" value={draft.profile.education.school} onChange={(school) => setProfile({ education: { ...draft.profile.education, school } })} />
                  <TextInput label="Degree" value={draft.profile.education.degree} onChange={(degree) => setProfile({ education: { ...draft.profile.education, degree } })} />
                  <TextInput label="Graduation year" value={draft.profile.education.graduation} onChange={(graduation) => setProfile({ education: { ...draft.profile.education, graduation } })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Public email" type="email" hint="Leave empty to hide the email button." value={draft.profile.email} onChange={(email) => setProfile({ email })} />
                  <TextInput label="Résumé URL" value={draft.profile.resumeUrl} onChange={(resumeUrl) => setProfile({ resumeUrl })} />
                </div>
                <Toggle label="Open to work" hint="Shows the availability badge in the hero." checked={draft.profile.openToWork} onChange={(openToWork) => setProfile({ openToWork })} />
              </Panel>
            )}

            {tab === "skills" && (
              <Panel title="Skills" help="Group skills into rows. Each group is one line in the Toolbox section.">
                <ListEditor<SkillGroup>
                  items={draft.skills}
                  onChange={(v) => set("skills", v)}
                  title={(g) => g.name}
                  subtitle={(g) => g.items.join(", ") || "No skills yet"}
                  addLabel="Add skill group"
                  emptyText="No skill groups yet."
                  create={() => ({ id: newId("group"), name: "New group", items: [] })}
                  render={(g, up) => (
                    <>
                      <TextInput label="Group name" value={g.name} onChange={(name) => up({ name })} />
                      <ChipInput label="Skills" values={g.items} onChange={(items) => up({ items })} placeholder="TypeScript, Redis" />
                    </>
                  )}
                />
              </Panel>
            )}

            {tab === "platforms" && (
              <Panel title="Platforms" help="Social and coding profiles. Pick a platform and type your handle — the link fills in for you. The first six also appear in the hero, with their handles.">
                <ListEditor<Social>
                  items={draft.socials}
                  onChange={(v) => set("socials", v)}
                  title={(s) => s.label}
                  subtitle={(s) => s.url}
                  addLabel="Add platform"
                  emptyText="No platforms yet."
                  create={() => ({ id: newId("social"), platform: "codechef", label: "CodeChef", handle: "", url: "" })}
                  render={(s, up) => <SocialFields s={s} up={up} />}
                />
              </Panel>
            )}

            {tab === "hackathons" && (
              <Panel title="Hackathons and events">
                <ListEditor<Hackathon>
                  items={draft.hackathons}
                  onChange={(v) => set("hackathons", v)}
                  title={(h) => h.name}
                  subtitle={(h) => [h.year, h.note].filter(Boolean).join(" — ") || "No details yet"}
                  addLabel="Add hackathon"
                  emptyText="No hackathons yet."
                  create={() => ({ id: newId("event"), name: "New hackathon", note: "", year: String(new Date().getFullYear()), url: "", organizer: "" })}
                  render={(h, up) => (
                    <>
                      <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
                        <TextInput label="Name" value={h.name} onChange={(name) => up({ name })} />
                        <TextInput label="When" value={h.year} onChange={(year) => up({ year })} placeholder="Mar 2026" />
                      </div>
                      <TextInput label="Organiser" value={h.organizer} onChange={(organizer) => up({ organizer })} placeholder="NAMESPACE · Online" />
                      <TextArea label="What you built or won" value={h.note} onChange={(note) => up({ note })} rows={2} />
                      <TextInput label="Link" value={h.url} onChange={(url) => up({ url })} placeholder="https://github.com/…" hint="Usually the project's repo." />
                    </>
                  )}
                />
              </Panel>
            )}

            {tab === "certificates" && (
              <Panel
                title="Certificates and awards"
                help="Shown as a gallery under Hackathons. Visitors can click one to see it full size. For images, upload to Google Drive or put a file in public/certificates/ and type /certificates/name.jpg."
              >
                <ListEditor<Certificate>
                  items={draft.certificates}
                  onChange={(v) => set("certificates", v)}
                  title={(c) => c.title}
                  subtitle={(c) => [c.issuer, c.date].filter(Boolean).join(" · ") || "No details yet"}
                  addLabel="Add certificate"
                  emptyText="No certificates yet."
                  create={() => ({ id: newId("cert"), title: "New certificate", issuer: "", date: "", image: "", url: "" })}
                  render={(c, up) => (
                    <>
                      <TextInput label="Title" value={c.title} onChange={(title) => up({ title })} placeholder="HACKHAZARDS '26: Certificate of Participation" />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput label="Issued by" value={c.issuer} onChange={(issuer) => up({ issuer })} />
                        <TextInput label="Date" value={c.date} onChange={(date) => up({ date })} placeholder="July 2026" />
                      </div>
                      <ImageField label="Image" value={c.image} onChange={(image) => up({ image })} hint="Shown in the gallery." />
                      <TextInput label="Original (PDF or Drive link)" value={c.url} onChange={(url) => up({ url })} placeholder="https://drive.google.com/…" />
                    </>
                  )}
                />
              </Panel>
            )}

            {tab === "showcase" && (
              <Panel title="Showcase" help="One project gets a full section under the hero. When it's ai-bots, the hero also shows its architecture diagram.">
                <Toggle label="Show the showcase section" checked={draft.showcase.enabled} onChange={(enabled) => setShowcase({ enabled })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" htmlFor="showcase-project">
                      Project
                    </label>
                    <select id="showcase-project" className="field" value={draft.showcase.projectId} onChange={(e) => setShowcase({ projectId: e.target.value })}>
                      <option value="">Choose a project</option>
                      {draft.projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-mute">Its live and code links are used. It's hidden from the project grid so it doesn't appear twice.</p>
                  </div>
                  <TextInput label="Label" value={draft.showcase.eyebrow} onChange={(eyebrow) => setShowcase({ eyebrow })} placeholder="Latest build" />
                </div>
                <TextInput label="Headline" value={draft.showcase.title} onChange={(title) => setShowcase({ title })} />
                <TextArea label="Description" value={draft.showcase.summary} onChange={(summary) => setShowcase({ summary })} rows={4} />
                <ChipInput label="Built with" values={draft.showcase.stack} onChange={(stack) => setShowcase({ stack })} placeholder="Next.js, Gemini" />
                <div>
                  <p className="mb-2 text-sm font-medium">Features</p>
                  <ListEditor<Feature>
                    items={draft.showcase.features}
                    onChange={(features) => setShowcase({ features })}
                    title={(f) => f.title}
                    subtitle={(f) => f.body}
                    addLabel="Add feature"
                    emptyText="No features yet."
                    create={() => ({ id: newId("feature"), title: "New feature", body: "" })}
                    render={(f, up) => (
                      <>
                        <TextInput label="Title" value={f.title} onChange={(title) => up({ title })} />
                        <TextArea label="Description" value={f.body} onChange={(body) => up({ body })} rows={2} />
                      </>
                    )}
                  />
                </div>
              </Panel>
            )}

            {tab === "widgets" && (
              <Panel title="Live widgets" help="LeetCode stats are fetched live and cached for 5 minutes. If LeetCode can't be reached, the snapshot numbers below are shown instead.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="GitHub username" value={draft.widgets.githubUsername} onChange={(githubUsername) => setWidgets({ githubUsername })} />
                  <TextInput label="LeetCode username" value={draft.widgets.leetcodeUsername} onChange={(leetcodeUsername) => setWidgets({ leetcodeUsername })} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Toggle
                    label="Show coding profiles card"
                    hint="GitHub, LeetCode, Codolio and other coding platforms from the Platforms tab."
                    checked={draft.widgets.showGithub}
                    onChange={(showGithub) => setWidgets({ showGithub })}
                  />
                  <Toggle label="Show LeetCode stats" checked={draft.widgets.showLeetcode} onChange={(showLeetcode) => setWidgets({ showLeetcode })} />
                </div>
                <fieldset className="rounded-xl border border-line p-4">
                  <legend className="px-1 text-sm font-medium">LeetCode snapshot</legend>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {(["solved", "easy", "medium", "hard"] as const).map((k) => (
                      <NumberInput
                        key={k}
                        label={k[0].toUpperCase() + k.slice(1)}
                        value={draft.widgets.leetcodeFallback[k]}
                        onChange={(v) => setWidgets({ leetcodeFallback: { ...draft.widgets.leetcodeFallback, [k]: v } })}
                      />
                    ))}
                  </div>
                </fieldset>
              </Panel>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Save bar */}
      <AnimatePresence>
        {(dirty || status.kind !== "idle") && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="glass mx-auto flex max-w-3xl flex-col gap-3 p-3 pl-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,.9)] sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 text-sm" role="status" aria-live="polite">
                {status.kind === "error" ? (
                  <div className="text-danger">
                    <p className="font-semibold">{status.message}</p>
                    {status.issues?.map((i) => (
                      <p key={i} className="truncate font-mono text-xs">
                        {i}
                      </p>
                    ))}
                  </div>
                ) : status.kind === "saved" && !dirty ? (
                  <p className="text-ion">Changes saved. Your site is updated.</p>
                ) : status.kind === "saving" ? (
                  <p className="text-mute">Saving…</p>
                ) : (
                  <p>You have unsaved changes.</p>
                )}
              </div>
              {dirty && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost flex-1 sm:flex-none"
                    disabled={status.kind === "saving"}
                    onClick={() => {
                      setDraft(saved);
                      setStatus({ kind: "idle" });
                    }}
                  >
                    Discard
                  </button>
                  <button type="button" className="btn btn-primary flex-1 disabled:opacity-60 sm:flex-none" disabled={status.kind === "saving"} onClick={save}>
                    {status.kind === "saving" ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Panel({ title, help, children }: { title: string; help?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {help && <p className="mt-1 max-w-2xl text-sm text-mute">{help}</p>}
      </div>
      {children}
    </section>
  );
}

function SocialFields({ s, up }: { s: Social; up: (patch: Partial<Social>) => void }) {
  const meta = PLATFORM_META[s.platform];
  const auto = (platform: Platform, handle: string) => PLATFORM_META[platform].url?.(handle.trim()) ?? "";
  const urlIsAuto = s.url === "" || s.url === auto(s.platform, s.handle);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium" htmlFor={`${s.id}-platform`}>
            Platform
          </label>
          <select
            id={`${s.id}-platform`}
            className="field"
            value={s.platform}
            onChange={(e) => {
              const platform = e.target.value as Platform;
              const wasDefaultLabel = s.label === meta.label || !s.label;
              up({
                platform,
                label: wasDefaultLabel ? PLATFORM_META[platform].label : s.label,
                url: urlIsAuto && s.handle ? auto(platform, s.handle) : s.url,
              });
            }}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_META[p].label}
              </option>
            ))}
          </select>
        </div>
        <TextInput label="Label" value={s.label} onChange={(label) => up({ label })} />
        <TextInput
          label={s.platform === "email" ? "Email address" : "Handle"}
          value={s.handle}
          onChange={(handle) => up({ handle, url: urlIsAuto && meta.url ? auto(s.platform, handle) : s.url })}
        />
        <TextInput label="Link" value={s.url} onChange={(url) => up({ url })} placeholder="https://…" hint={meta.url && urlIsAuto ? "Filled in from your handle." : undefined} />
      </div>
    </>
  );
}
