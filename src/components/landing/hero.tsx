import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Activity, GitBranch, Star, TrendingUp, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:pt-40">
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.22_295/0.25),transparent_60%)] blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute top-40 left-1/4 -z-10 size-72 rounded-full bg-[radial-gradient(circle,oklch(0.68_0.18_250/0.25),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 glass px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="size-3 text-accent-purple" />
          AI-powered developer intelligence — Now in v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-[20ch] text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl"
        >
          <span className="text-gradient">The Future of Developer Hiring Starts Here.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-[58ch] text-pretty text-base text-muted-foreground sm:text-lg"
        >
          Transform resumes, GitHub profiles, and repositories into powerful hiring intelligence.
          Analyze skill depth and project quality instantly with our proprietary AI scoring engine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link to="/signup" className="group inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-white ring-2 ring-accent-purple/30 transition-all hover:scale-[1.03] glow-purple">
            Get Started Free
            <span className="size-1.5 rounded-full bg-white/60 transition-all group-hover:bg-white group-hover:w-3" />
          </Link>
          <a href="#analytics" className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/5">
            Watch Demo
          </a>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-r from-accent-purple/20 via-accent-blue/20 to-accent-purple/20 blur-2xl opacity-60" />
          <div className="rounded-[24px] glass-strong p-2 ring-1 ring-white/10">
            <div className="overflow-hidden rounded-[16px] border border-white/5 bg-background shadow-2xl">
              {/* window chrome */}
              <div className="flex h-12 items-center gap-4 border-b border-white/5 bg-white/[0.02] px-6">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-white/10" />
                  <div className="size-2.5 rounded-full bg-white/10" />
                  <div className="size-2.5 rounded-full bg-white/10" />
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">devscan.ai/dashboard/candidate-8842</div>
              </div>
              <div className="grid grid-cols-12 gap-px bg-white/5">
                {/* sidebar */}
                <div className="col-span-3 hidden flex-col gap-4 bg-background p-6 md:flex">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Workspace</div>
                  {["Overview", "Candidates", "Pipeline", "Analytics", "Reports"].map((l, i) => (
                    <div key={l} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${i === 1 ? "bg-accent-purple/15 text-foreground ring-1 ring-accent-purple/30" : "text-muted-foreground"}`}>
                      <div className="size-1.5 rounded-full bg-current opacity-60" /> {l}
                    </div>
                  ))}
                  <div className="mt-auto rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 p-3 ring-1 ring-accent-purple/20">
                    <div className="text-[10px] font-semibold text-accent-purple">Pro plan</div>
                    <div className="mt-1 text-[10px] text-muted-foreground">412 / 1000 scans</div>
                  </div>
                </div>
                {/* main */}
                <div className="col-span-12 bg-background p-6 md:col-span-9">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: "Code Quality", v: "94", s: "/100", c: "text-accent-purple" },
                      { l: "Architecture", v: "A+", s: "Grade", c: "text-accent-blue" },
                      { l: "Commit Rank", v: "Top", s: "1%", c: "text-accent-green" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left">
                        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{m.l}</div>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className={`text-2xl font-bold ${m.c}`}>{m.v}</span>
                          <span className="text-xs text-muted-foreground">{m.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex h-44 items-end gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    {[40, 60, 35, 85, 55, 95, 70, 45, 78, 88, 62, 92].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-t ${i % 3 === 0 ? "bg-accent-purple/60" : "bg-accent-blue/40"} transition-all hover:opacity-100`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-32 hidden w-52 rounded-xl glass-strong p-4 ring-1 ring-white/10 lg:block"
          >
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-[11px] font-medium">Live Skill Parsing</span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { l: "React", v: 92, c: "bg-accent-blue" },
                { l: "TypeScript", v: 88, c: "bg-accent-purple" },
                { l: "System Design", v: 76, c: "bg-accent-cyan" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                    <span>{s.l}</span><span>{s.v}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 bottom-12 hidden w-56 rounded-xl glass-strong p-4 ring-1 ring-white/10 lg:block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">GitHub Activity</span>
              <GitBranch className="size-3 text-accent-blue" />
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => {
                const opacities = [0.05, 0.2, 0.4, 0.7, 1];
                const o = opacities[Math.floor(Math.random() * opacities.length)];
                return <div key={i} className="aspect-square rounded-sm bg-accent-green" style={{ opacity: o }} />;
              })}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">1,482 commits last year</div>
          </motion.div>
        </motion.div>

        {/* stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { k: "70%", v: "Less screening time", Icon: TrendingUp },
            { k: "10M+", v: "Profiles analyzed", Icon: Activity },
            { k: "94%", v: "Match accuracy", Icon: Star },
            { k: "500+", v: "Hiring teams", Icon: GitBranch },
          ].map(({ k, v, Icon }) => (
            <div key={v} className="text-left">
              <Icon className="size-4 text-accent-purple" />
              <div className="mt-2 text-2xl font-bold">{k}</div>
              <div className="text-xs text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
