import { motion } from "framer-motion";
import {
  FileText, GitBranch, Brain, FolderKanban, Users, Target,
  TrendingUp, Award, BookOpen, Lightbulb, Compass, Briefcase,
} from "lucide-react";

const features = [
  { Icon: FileText, title: "AI Resume Analysis", desc: "Parsing engine extracts skills, experience signals, and ATS-readiness in seconds.", c: "text-accent-purple", b: "from-accent-purple/20" },
  { Icon: GitBranch, title: "GitHub Intelligence", desc: "Repository depth, commit patterns, language distribution, and contribution graphs.", c: "text-accent-blue", b: "from-accent-blue/20" },
  { Icon: Brain, title: "Skill Scoring Engine", desc: "Quantitative scoring across DSA, system design, Java, web, and frameworks.", c: "text-accent-cyan", b: "from-accent-cyan/20" },
  { Icon: FolderKanban, title: "Project Quality Analysis", desc: "Documentation, code organization, repo health, and innovation scoring.", c: "text-accent-purple", b: "from-accent-purple/20" },
  { Icon: Users, title: "Recruiter Dashboard", desc: "Side-by-side candidate comparison, ranking, search, filters, and hiring suggestions.", c: "text-accent-blue", b: "from-accent-blue/20" },
  { Icon: Target, title: "Placement Readiness Predictor", desc: "Readiness percentage, missing skills, learning roadmap, and interview prep.", c: "text-accent-green", b: "from-accent-green/20" },
];

const insights = [
  { Icon: Award, title: "Strengths", desc: "React, distributed systems, async patterns" },
  { Icon: Compass, title: "Weaknesses", desc: "Test coverage, low-level systems depth" },
  { Icon: Lightbulb, title: "Missing Skills", desc: "Kubernetes, Rust, mLOps fundamentals" },
  { Icon: TrendingUp, title: "Improvement Plan", desc: "12-week structured roadmap" },
  { Icon: BookOpen, title: "Suggested Projects", desc: "Realtime chat, RAG pipeline, k8s cluster" },
  { Icon: Briefcase, title: "Suggested Certifications", desc: "AWS SA, CKA, Meta Frontend" },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-purple">Platform</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Everything you need to hire elite talent.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six intelligence layers, one platform. Built for modern engineering teams.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl glass p-8 ring-1 ring-white/5 transition-all hover:ring-white/10"
            >
              <div className={`absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br ${f.b} to-transparent opacity-50 blur-2xl transition-opacity group-hover:opacity-100`} />
              <div className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.b} to-transparent ring-1 ring-white/10`}>
                <f.Icon className={`size-5 ${f.c}`} />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AIInsights() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">AI Insights</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            Personalized intelligence for every developer.
          </h2>
        </div>
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl glass p-6 ring-1 ring-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-lg bg-accent-purple/15 ring-1 ring-accent-purple/30">
                  <f.Icon className="size-4 text-accent-purple" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
