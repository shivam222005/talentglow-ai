import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { Hero } from "@/components/landing/hero";
import { Features, AIInsights } from "@/components/landing/features";
import { LiveAnalytics } from "@/components/landing/analytics";
import { TrustedBy, Testimonials, Pricing, FAQ, CTA } from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevScan AI — Hire Smarter. Analyze Developers Instantly." },
      { name: "description", content: "AI-powered developer portfolio intelligence: resume analysis, GitHub insights, skill scoring, and placement readiness for recruiters and students." },
      { property: "og:title", content: "DevScan AI — Developer Portfolio Intelligence" },
      { property: "og:description", content: "Transform resumes, GitHub profiles, and projects into hiring intelligence." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <Hero />
        <TrustedBy />
        <Features />
        <LiveAnalytics />
        <AIInsights />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
