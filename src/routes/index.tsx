import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import {
  PremiumHero,
  TrustedStrip,
  FeatureBento,
  AIInsightsPreview,
  TestimonialsRow,
  PremiumCTA,
} from "@/components/landing/premium";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevScan AI — AI-Powered Developer Portfolio Intelligence" },
      {
        name: "description",
        content:
          "Analyze your resume, GitHub, and projects with AI. Skill tracking, interview prep, and a recruiter dashboard built for modern developers.",
      },
      { property: "og:title", content: "DevScan AI — Developer Portfolio Intelligence" },
      {
        property: "og:description",
        content:
          "AI resume analysis, GitHub insights, skill radar, and interview prep for developers and recruiters.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <PremiumHero />
        <TrustedStrip />
        <FeatureBento />
        <AIInsightsPreview />
        <TestimonialsRow />
        <PremiumCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
