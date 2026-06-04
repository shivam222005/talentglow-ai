import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { PublicSection } from "@/components/dashboard/page-scaffold";
import teamMeeting from "@/assets/team-meeting.asset.json";
import handshake from "@/assets/handshake-office.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DevScan AI" },
      { name: "description", content: "Why we built the developer portfolio intelligence platform behind 800+ campuses and recruiting teams." },
      { property: "og:title", content: "About DevScan AI" },
      { property: "og:description", content: "Our mission: make developer hiring honest, signal-rich, and instant." },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: teamMeeting.url },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <PublicSection
          eyebrow="About"
          title="We're rebuilding how developer talent is discovered."
          lead="DevScan AI turns resumes, GitHub graphs, and project artifacts into honest, comparable signal — so students get fair shots and recruiters cut through noise."
          image={teamMeeting.url}
        >
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {[
              { v: "2,481", l: "Active developer profiles" },
              { v: "320+", l: "Recruiting teams worldwide" },
              { v: "94%", l: "Match accuracy on hires" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl glass p-6 ring-1 ring-white/5">
                <div className="text-3xl font-bold">{s.v}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 grid max-w-6xl gap-12 md:grid-cols-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent-purple">Our mission</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Signal over keyword-stuffing.</h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Resumes get gamed. Job titles lie. We score what actually predicts on-the-job performance: real commits, real projects, real problem solving.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Built by engineers who spent a decade hiring engineers — and got tired of guessing.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
              <img src={handshake.url} alt="Team" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <Link to="/contact" className="inline-flex rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-white glow-purple">
              Talk to our team
            </Link>
          </div>
        </PublicSection>
      </main>
      <SiteFooter />
    </div>
  );
}
