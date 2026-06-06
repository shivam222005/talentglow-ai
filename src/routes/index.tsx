import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { Hero } from "@/components/landing/hero";
import { Features, AIInsights } from "@/components/landing/features";
import { LiveAnalytics } from "@/components/landing/analytics";
import { TrustedBy, Testimonials, Pricing, FAQ, CTA } from "@/components/landing/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevScan AI — Developer Portfolio Intelligence" },
      { name: "description", content: "AI-powered resume, GitHub, and project analysis for students, developers and recruiters." },
      { property: "og:title", content: "DevScan AI — Developer Portfolio Intelligence" },
      { property: "og:description", content: "AI-powered resume, GitHub, and project analysis for students, developers and recruiters." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-16">
        <Hero />
        <TrustedBy />
        <Features />
        <AIInsights />
        <LiveAnalytics />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
