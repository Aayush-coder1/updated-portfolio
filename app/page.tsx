import { MotionRoot } from "@/components/site/MotionRoot";
import { getContent } from "@/lib/store";
import { getLeetCode } from "@/lib/live";
import { Nav } from "@/components/site/Nav";
import { Projects } from "@/components/site/Projects";
import { ShowcaseSection } from "@/components/site/Showcase";
import { Contact, Hackathons, Hero, LiveActivity, Skills } from "@/components/site/Sections";

// Regenerated at most every 5 minutes (keeps LeetCode stats fresh); saving in /admin revalidates instantly.
export const revalidate = 300;

export default async function Home() {
  const content = await getContent();
  const { widgets, showcase } = content;

  const leetcode = widgets.showLeetcode ? await getLeetCode(widgets) : null;
  const showcaseProject = showcase.enabled ? content.projects.find((p) => p.id === showcase.projectId) : undefined;
  const github = content.socials.find((s) => s.platform === "github")?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.profile.name,
    jobTitle: content.profile.role,
    alumniOf: content.profile.education.school,
    sameAs: content.socials.map((s) => s.url).filter((u) => u.startsWith("http")),
  };

  return (
    <MotionRoot>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-void">
        Skip to content
      </a>
      <Nav shortName={content.profile.shortName} resumeUrl={content.profile.resumeUrl} showShowcase={showcase.enabled} />
      <main>
        <Hero content={content} showcaseProject={showcaseProject} />
        <ShowcaseSection showcase={showcase} project={showcaseProject} />
        <Projects projects={content.projects} githubUrl={github} hideId={showcaseProject?.id} />
        <LiveActivity content={content} leetcode={leetcode} />
        <Skills skills={content.skills} />
        <Hackathons hackathons={content.hackathons} certificates={content.certificates} />
        <Contact content={content} />
      </main>
    </MotionRoot>
  );
}
