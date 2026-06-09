import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Github,
  Radar,
  Brain,
  Map,
  MessageSquare,
  Briefcase,
  TrendingUp,
  Zap,
  Star,
  Check,
} from "lucide-react";

/* ============ Animated Background (aurora + grid + particles) ============ */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* aurora blobs */}
      <div className="absolute -top-40 left-1/4 size-[600px] rounded-full bg-[oklch(0.7_0.22_295_/_0.35)] blur-[120px] animate-pulse-glow" />
      <div className="absolute top-20 right-1/4 size-[500px] rounded-full bg-[oklch(0.68_0.18_250_/_0.3)] blur-[120px] animate-pulse-glow [animation-delay:1s]" />
      <div className="absolute bottom-0 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-[oklch(0.78_0.13_200_/_0.25)] blur-[120px] animate-pulse-glow [animation-delay:2s]" />
      {/* particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute size-1 rounded-full bg-white/50"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animation: `float ${6 + (i % 5)}s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.15 + ((i % 5) * 0.1),
          }}
        />
      ))}
    </div>
  );
}

/* ============ HERO ============ */
export function PremiumHero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">
      <AuroraBackground />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium"
        >
          <Sparkles className="size-3.5 text-[oklch(0.78_0.13_200)]" />
          <span className="text-muted-foreground">
            New · GPT-5 powered portfolio intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto max-w-5xl text-balance text-5xl font-bold tracking-tight md:text-7xl lg:text-[5.5rem] lg:leading-[1.02]"
        >
          <span className="text-gradient">AI-Powered Developer</span>
          <br />
          <span className="bg-gradient-to-r from-[oklch(0.78_0.18_295)] via-[oklch(0.7_0.2_260)] to-[oklch(0.82_0.14_200)] bg-clip-text text-transparent">
            Portfolio Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-7 max-w-2xl text-balance text-base text-muted-foreground md:text-lg"
        >
          Analyze your resume, GitHub activity, and projects with AI. Track skill
          growth, get interview-ready, and turn your portfolio into a recruiter
          magnet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/auth"
            className="group inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-white glow-purple transition-all hover:scale-[1.03]"
          >
            Analyze Resume
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold transition-all hover:bg-white/10"
          >
            Get Started — Free
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          <StatCard
            icon={<FileText className="size-4" />}
            label="Resume Score"
            value="94"
            suffix="/100"
            tint="purple"
          />
          <StatCard
            icon={<Github className="size-4" />}
            label="GitHub Activity"
            value="2.4k"
            suffix=" commits"
            tint="blue"
          />
          <StatCard
            icon={<Brain className="size-4" />}
            label="AI Skill Match"
            value="87"
            suffix="%"
            tint="cyan"
          />
          <StatCard
            icon={<TrendingUp className="size-4" />}
            label="Recruiter Views"
            value="312"
            suffix=" /mo"
            tint="green"
          />
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
  tint: "purple" | "blue" | "cyan" | "green";
}) {
  const tints: Record<typeof tint, string> = {
    purple: "from-[oklch(0.7_0.22_295)]/40 to-transparent",
    blue: "from-[oklch(0.68_0.18_250)]/40 to-transparent",
    cyan: "from-[oklch(0.78_0.13_200)]/40 to-transparent",
    green: "from-[oklch(0.75_0.18_155)]/40 to-transparent",
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl glass p-5 text-left"
    >
      <div
        className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${tints[tint]}`}
      />
      <div
        className={`absolute -right-12 -top-12 size-36 rounded-full bg-gradient-to-br ${tints[tint]} opacity-60 blur-2xl transition-opacity group-hover:opacity-100`}
      />
      <div className="relative flex items-center gap-2 text-xs text-muted-foreground">
        <span className="grid size-7 place-items-center rounded-lg bg-white/5">
          {icon}
        </span>
        {label}
      </div>
      <div className="relative mt-4 font-mono text-3xl font-bold tracking-tight">
        {value}
        <span className="text-base font-normal text-muted-foreground">
          {suffix}
        </span>
      </div>
    </motion.div>
  );
}

/* ============ Trusted by ============ */
export function TrustedStrip() {
  const logos = ["Google", "Stripe", "Vercel", "Linear", "Notion", "GitHub", "OpenAI"];
  return (
    <section className="relative border-y border-white/5 bg-background/40 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by engineers from
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((l) => (
            <span
              key={l}
              className="text-lg font-semibold text-muted-foreground/60 transition-colors hover:text-foreground"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Feature Bento ============ */
const FEATURES = [
  {
    icon: FileText,
    title: "AI Resume Analyzer",
    desc: "Get a recruiter-grade score with line-by-line suggestions, keyword gaps, and ATS optimization.",
    tag: "Resume",
    color: "oklch(0.7 0.22 295)",
  },
  {
    icon: Github,
    title: "GitHub Analytics",
    desc: "Real contribution heatmaps, language mix, repo quality, and code consistency over time.",
    tag: "GitHub",
    color: "oklch(0.68 0.18 250)",
  },
  {
    icon: Radar,
    title: "Skill Radar Visualization",
    desc: "Visual map of your strengths versus the role you want — measured, not guessed.",
    tag: "Skills",
    color: "oklch(0.78 0.13 200)",
  },
  {
    icon: Brain,
    title: "AI Project Scoring",
    desc: "Every project rated for complexity, originality, impact, and recruiter appeal.",
    tag: "Projects",
    color: "oklch(0.75 0.18 155)",
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    desc: "Personalized week-by-week paths to close gaps and land your target role.",
    tag: "Roadmap",
    color: "oklch(0.78 0.18 60)",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    desc: "Mock interviews with AI, instant feedback on answers, and rubric-based scoring.",
    tag: "Interview",
    color: "oklch(0.7 0.22 295)",
  },
  {
    icon: Briefcase,
    title: "Recruiter Dashboard",
    desc: "Side-by-side candidate comparison, smart ranking, and exportable reports.",
    tag: "Recruiter",
    color: "oklch(0.68 0.18 250)",
  },
];

export function FeatureBento() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Everything you need"
          title="A complete intelligence layer for your career"
          subtitle="Seven AI modules designed to turn raw activity into hireable signal."
        />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {FEATURES.slice(0, 2).map((f, i) => (
            <FeatureCard key={f.title} feature={f} large index={i} />
          ))}
          <FeatureCard feature={FEATURES[2]} index={2} />
          {FEATURES.slice(3).map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  large,
  index,
}: {
  feature: (typeof FEATURES)[number];
  large?: boolean;
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-3xl glass p-7 transition-colors hover:border-white/10 ${
        large ? "md:col-span-1 md:row-span-1" : ""
      }`}
    >
      <div
        className="absolute -right-20 -top-20 size-52 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
        style={{ background: feature.color }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className="grid size-11 place-items-center rounded-xl border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${feature.color}30, transparent)`,
            }}
          >
            <Icon className="size-5" style={{ color: feature.color }} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {feature.tag}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ============ AI Insights Preview ============ */
export function AIInsightsPreview() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.7_0.22_295_/_0.15)] blur-[140px]" />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Live AI Insights"
            title="Your portfolio, narrated by AI"
            subtitle="A continuously-updated stream of insights, gaps, and next best actions — from a model that has read your whole story."
          />
          <ul className="mt-8 space-y-3">
            {[
              "Real-time scoring as your repos and resume change",
              "Recruiter-style summary written in seconds",
              "Targeted suggestions: what to learn, build, or remove",
              "Side-by-side benchmark vs your target role",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-[oklch(0.78_0.13_200)]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI panel mock */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl glass-strong p-6 shadow-[0_30px_80px_-40px_oklch(0.7_0.22_295_/_0.6)]"
        >
          <div
            className="absolute inset-x-0 -top-px h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.7 0.22 295), oklch(0.78 0.13 200), transparent)",
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg gradient-primary glow-purple">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">DevScan Copilot</div>
                <div className="text-[11px] text-muted-foreground">
                  Analyzing portfolio…
                </div>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-[oklch(0.75_0.18_155)]">
              <span className="size-1.5 rounded-full bg-[oklch(0.75_0.18_155)] animate-pulse" />
              Live
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <InsightBubble delay={0}>
              Your React + TypeScript signal is strong (top 8%). Recruiters at
              fintechs will notice.
            </InsightBubble>
            <InsightBubble delay={0.15}>
              Gap detected: no system-design project. Building one would lift your
              score by <span className="font-semibold text-foreground">+12 pts</span>.
            </InsightBubble>
            <InsightBubble delay={0.3} typing>
              Drafting a roadmap for "Senior Frontend at Stripe"…
            </InsightBubble>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { l: "Resume", v: "94" },
              { l: "GitHub", v: "88" },
              { l: "Match", v: "87%" },
            ].map((m) => (
              <div
                key={m.l}
                className="rounded-xl border border-white/5 bg-white/5 p-3 text-center"
              >
                <div className="font-mono text-lg font-bold">{m.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InsightBubble({
  children,
  delay = 0,
  typing,
}: {
  children: React.ReactNode;
  delay?: number;
  typing?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl rounded-tl-sm border border-white/5 bg-white/[0.04] p-3 text-sm text-muted-foreground"
    >
      {children}
      {typing && (
        <span className="ml-2 inline-flex gap-1 align-middle">
          <span className="size-1 rounded-full bg-white/60 animate-pulse" />
          <span className="size-1 rounded-full bg-white/60 animate-pulse [animation-delay:0.15s]" />
          <span className="size-1 rounded-full bg-white/60 animate-pulse [animation-delay:0.3s]" />
        </span>
      )}
    </motion.div>
  );
}

/* ============ Testimonials ============ */
const TESTIMONIALS = [
  {
    quote:
      "DevScan rewrote how I think about my portfolio. Got 3 callbacks in a week.",
    name: "Priya M.",
    role: "Frontend Engineer · Hired at a YC startup",
  },
  {
    quote:
      "The AI insights felt like a senior engineer reviewing my work. Brutal and accurate.",
    name: "Marcus L.",
    role: "Full-stack Developer",
  },
  {
    quote:
      "As a recruiter, the ranking dashboard cut my screening time by 70%.",
    name: "Elena R.",
    role: "Tech Recruiter · Series B startup",
  },
];

export function TestimonialsRow() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Loved by developers & recruiters"
          title="A unfair edge for your career"
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl glass p-7"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-3.5 fill-[oklch(0.78_0.18_60)] text-[oklch(0.78_0.18_60)]"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </p>
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Final CTA ============ */
export function PremiumCTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[oklch(0.22_0.04_295)] via-[oklch(0.18_0.03_260)] to-[oklch(0.2_0.04_200)] p-12 text-center md:p-20">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-20 top-0 size-80 rounded-full bg-[oklch(0.7_0.22_295)] blur-[100px]" />
            <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-[oklch(0.78_0.13_200)] blur-[100px]" />
          </div>
          <div className="relative">
            <Zap className="mx-auto size-10 text-[oklch(0.78_0.13_200)]" />
            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Your portfolio deserves an upgrade.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of developers shipping smarter careers with DevScan AI.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3 text-sm font-semibold text-white glow-purple transition-transform hover:scale-[1.03]"
              >
                Start free <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-3 text-sm font-semibold"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Shared helpers ============ */
function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      {eyebrow && (
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[oklch(0.78_0.13_200)]">
          {eyebrow}
        </div>
      )}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-balance text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
