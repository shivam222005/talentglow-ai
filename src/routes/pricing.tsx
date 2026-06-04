import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { PublicSection } from "@/components/dashboard/page-scaffold";
import { Check } from "lucide-react";
import hr from "@/assets/hr-handshake.asset.json";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — DevScan AI" },
      { name: "description", content: "Simple pricing for students, pro developers and recruiting teams." },
      { property: "og:title", content: "Pricing — DevScan AI" },
      { property: "og:description", content: "Free for students. Pro from $19. Team from $99/seat." },
      { property: "og:url", content: "/pricing" },
      { property: "og:image", content: hr.url },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const tiers = [
  { name: "Student", price: "Free", desc: "Full personal intelligence — forever.", features: ["Resume analyzer", "GitHub insights", "Skill radar", "1 mock interview / week", "Job matches"], cta: "Get started", highlight: false },
  { name: "Pro", price: "$19", suffix: "/mo", desc: "For students serious about top-tier offers.", features: ["Everything in Student", "Unlimited mock interviews", "Resume builder + ATS optimizer", "AI Career Assistant", "Priority support"], cta: "Start free trial", highlight: true },
  { name: "Recruiter", price: "$99", suffix: "/seat", desc: "Talent discovery for hiring teams.", features: ["Candidate search & ranking", "Comparison engine", "Hiring analytics", "Bulk exports + ATS sync", "Dedicated CSM"], cta: "Book a demo", highlight: false },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <PublicSection eyebrow="Pricing" title="Honest pricing. Real value." lead="Students stay free forever. Recruiters pay for speed.">
          <div className="grid gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.name} className={`relative rounded-3xl p-8 ring-1 ${t.highlight ? "glass-strong ring-accent-purple/40 glow-purple" : "glass ring-white/5"}`}>
                {t.highlight && <span className="absolute top-4 right-4 rounded-full bg-accent-purple/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-purple">Popular</span>}
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-5xl font-bold">{t.price}</span>
                  {t.suffix && <span className="mb-2 text-sm text-muted-foreground">{t.suffix}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent-green" /> <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${t.highlight ? "gradient-primary text-white glow-purple" : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10"}`}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </PublicSection>
      </main>
      <SiteFooter />
    </div>
  );
}
