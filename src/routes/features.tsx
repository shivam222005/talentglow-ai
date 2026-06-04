import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { PublicSection } from "@/components/dashboard/page-scaffold";
import { FileText, Github, Brain, Target, FolderGit2, Calendar, FileEdit, Mic, Sparkles, Briefcase, Users, BarChart3 } from "lucide-react";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — DevScan AI" },
      { name: "description", content: "Resume Analyzer, GitHub Intelligence, Skill Scoring, Mock Interviews, AI Career Assistant and more." },
      { property: "og:title", content: "Features — DevScan AI" },
      { property: "og:description", content: "12 AI modules covering the full developer hiring lifecycle." },
      { property: "og:url", content: "/features" },
      { property: "og:image", content: aiHiring.url },
    ],
    links: [{ rel: "canonical", href: "/features" }],
  }),
  component: FeaturesPage,
});

const features = [
  { icon: FileText, title: "Resume Analyzer", desc: "ATS scoring, skill extraction, gap detection in seconds.", to: "/dashboard/resume" },
  { icon: Github, title: "GitHub Intelligence", desc: "Commit cadence, language depth, repo quality scoring.", to: "/dashboard/github" },
  { icon: Brain, title: "Skill Intelligence", desc: "Radar of DSA, system design, frameworks vs. peer baseline.", to: "/dashboard/skills" },
  { icon: Target, title: "Placement Readiness", desc: "Composite hireability score across 7 dimensions.", to: "/dashboard/placement" },
  { icon: FolderGit2, title: "Project Analyzer", desc: "Code quality, docs, scalability and innovation grading.", to: "/dashboard/projects" },
  { icon: Calendar, title: "Interview Tracker", desc: "Pipeline view across companies, rounds, outcomes.", to: "/dashboard/interviews" },
  { icon: FileEdit, title: "Resume Builder", desc: "AI-rewritten bullets matched to target job descriptions.", to: "/dashboard/resume-builder" },
  { icon: Mic, title: "Mock Interview", desc: "Voice-driven AI interviewer with rubric feedback.", to: "/dashboard/mock-interview" },
  { icon: Sparkles, title: "AI Career Assistant", desc: "Always-on copilot for career questions, decisions, prep.", to: "/dashboard/assistant" },
  { icon: Briefcase, title: "Job Recommendations", desc: "Daily curated matches based on full profile signal.", to: "/dashboard/jobs" },
  { icon: Users, title: "Candidate Search", desc: "Recruiter-side discovery across 2,400+ verified profiles.", to: "/recruiter/candidates" },
  { icon: BarChart3, title: "Hiring Analytics", desc: "Pipeline conversion, source quality, role benchmarks.", to: "/recruiter/analytics" },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="pt-16">
        <PublicSection
          eyebrow="Platform"
          title="Twelve modules. One hiring loop."
          lead="Each module ships with its own dashboard, real data, and a working AI engine."
          image={aiHiring.url}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link key={f.title} to={f.to} className="group rounded-2xl glass p-6 ring-1 ring-white/5 transition-all hover:ring-accent-purple/30 hover:-translate-y-0.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple ring-1 ring-accent-purple/30 group-hover:glow-purple">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 font-mono text-xs text-accent-purple opacity-0 transition-opacity group-hover:opacity-100">Open →</div>
              </Link>
            ))}
          </div>
        </PublicSection>
      </main>
      <SiteFooter />
    </div>
  );
}
