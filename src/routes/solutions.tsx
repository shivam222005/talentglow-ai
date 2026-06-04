import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { PublicSection } from "@/components/dashboard/page-scaffold";
import meeting from "@/assets/meeting-darmel.asset.json";
import hr from "@/assets/hr-handshake.asset.json";
import clipboard from "@/assets/clipboard-handoff.asset.json";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — DevScan AI" },
      { name: "description", content: "Solutions for students, campuses, and enterprise recruiting teams." },
      { property: "og:title", content: "Solutions — DevScan AI" },
      { property: "og:description", content: "Tailored intelligence for students, universities and recruiters." },
      { property: "og:url", content: "/solutions" },
      { property: "og:image", content: meeting.url },
    ],
    links: [{ rel: "canonical", href: "/solutions" }],
  }),
  component: SolutionsPage,
});

const solutions = [
  { tag: "Students", title: "Land your first dev role with proof, not promises.", img: clipboard.url, to: "/dashboard", cta: "Open student dashboard" },
  { tag: "Recruiters", title: "Surface the top 5% in seconds, not weeks.", img: meeting.url, to: "/recruiter", cta: "Open recruiter portal" },
  { tag: "Universities", title: "Track placement readiness across every cohort.", img: hr.url, to: "/contact", cta: "Book a campus demo" },
];

function SolutionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <PublicSection eyebrow="Solutions" title="Built for both sides of the hiring loop." lead="One platform, three audiences, real workflows for each.">
          <div className="space-y-8">
            {solutions.map((s, i) => (
              <div key={s.tag} className={`grid gap-8 rounded-3xl glass p-6 ring-1 ring-white/5 md:grid-cols-2 md:p-10 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <img src={s.img} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">{s.tag}</span>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{s.title}</h2>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time profile scoring across 7 dimensions</li>
                    <li>• AI insights with explainable rationale</li>
                    <li>• Export-ready reports and dashboards</li>
                  </ul>
                  <Link to={s.to} className="mt-6 inline-flex w-fit rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-white glow-purple">
                    {s.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </PublicSection>
      </main>
      <SiteFooter />
    </div>
  );
}
