import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar,
} from "recharts";
import { motion } from "framer-motion";
import { Github, Star, GitPullRequest, FileCheck, Trophy, Flame, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard — DevScan AI" }] }),
  component: StudentDashboard,
});

const PURPLE = "oklch(0.7 0.22 295)";
const BLUE = "oklch(0.68 0.18 250)";
const GREEN = "oklch(0.75 0.18 155)";

const radar = [
  { s: "Java", v: 82 },
  { s: "DSA", v: 88 },
  { s: "Database", v: 70 },
  { s: "Backend", v: 86 },
  { s: "Frontend", v: 92 },
  { s: "Problem", v: 79 },
];
const commits = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  c: Math.round(40 + Math.random() * 180),
}));
const langs = [
  { l: "TypeScript", v: 92 }, { l: "Python", v: 78 },
  { l: "Java", v: 65 }, { l: "Go", v: 42 },
];

function StudentDashboard() {
  return (
    <DashboardShell role="student">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent-purple">Profile Overview</span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Welcome back, Alex 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Last sync: 2 hours ago · GitHub @alexrivera</p>
        </div>
        <button className="flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-white glow-purple">
          Re-analyze profile <ArrowUpRight className="size-4" />
        </button>
      </div>

      {/* score cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Resume Score", v: 94, color: PURPLE, icon: FileCheck, trend: "+8 this week" },
          { label: "Skill Score", v: 86, color: BLUE, icon: Trophy, trend: "Top 5% peers" },
          { label: "Placement Readiness", v: 78, color: GREEN, icon: TrendingUp, trend: "Ready for interviews" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl glass p-6 ring-1 ring-white/5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <s.icon className="size-4" style={{ color: s.color }} />
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-4xl font-bold" style={{ color: s.color }}>{s.v}</span>
              <span className="mb-1 text-muted-foreground">/100</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width: `${s.v}%`, background: s.color }} />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{s.trend}</div>
          </motion.div>
        ))}
      </div>

      {/* main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Skill radar */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
          <h3 className="text-sm font-semibold">Skill Radar</h3>
          <p className="text-xs text-muted-foreground">Your strengths at a glance</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={10} />
                <Radar dataKey="v" stroke={PURPLE} fill={PURPLE} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GitHub activity */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">GitHub Activity</h3>
              <p className="text-xs text-muted-foreground">Commit frequency over the last year</p>
            </div>
            <Github className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3 text-center">
            {[
              { l: "Repos", v: "47" },
              { l: "Commits", v: "1,482" },
              { l: "Stars", v: "284" },
              { l: "Pull Requests", v: "126" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="text-xl font-bold">{s.v}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commits}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BLUE} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="c" stroke={BLUE} fill="url(#ga)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Heatmap */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Contributions heatmap</span>
              <span className="flex items-center gap-1.5"><Flame className="size-3 text-accent-purple" /> 47-day streak</span>
            </div>
            <div className="grid grid-cols-[repeat(52,1fr)] gap-1">
              {Array.from({ length: 52 * 7 }).map((_, i) => {
                const o = [0.05, 0.15, 0.35, 0.55, 0.8, 1][Math.floor(Math.random() * 6)];
                return <div key={i} className="aspect-square rounded-sm bg-accent-green" style={{ opacity: o }} />;
              })}
            </div>
          </div>
        </div>

        {/* Resume Analysis */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Resume Analysis</h3>
          <p className="text-xs text-muted-foreground">Extracted skills · ATS score · gaps</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Extracted skills</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL", "Docker", "AWS", "Redis", "Python"].map((t) => (
                  <span key={t} className="rounded-full bg-accent-purple/10 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/20">{t}</span>
                ))}
              </div>
              <div className="mt-5 text-xs font-medium text-muted-foreground">Missing keywords</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Kubernetes", "Terraform", "Rust", "gRPC"].map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground ring-1 ring-white/10">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">Language strength</div>
              <div className="mt-3 space-y-3">
                {langs.map((l) => (
                  <div key={l.l}>
                    <div className="flex justify-between text-xs">
                      <span>{l.l}</span><span className="text-muted-foreground">{l.v}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-white/5">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${l.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project analyzer */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
          <h3 className="text-sm font-semibold">Project Analyzer</h3>
          <p className="text-xs text-muted-foreground">Top repo: realtime-chat-engine</p>
          <div className="mt-5 space-y-3">
            {[
              { l: "Quality", v: 92 },
              { l: "Documentation", v: 76 },
              { l: "Innovation", v: 88 },
              { l: "Scalability", v: 81 },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex justify-between text-xs"><span>{s.l}</span><span className="text-muted-foreground">{s.v}</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${s.v}%`, background: PURPLE }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recommended Learning Roadmap</h3>
              <p className="text-xs text-muted-foreground">Personalized weekly plan</p>
            </div>
            <Calendar className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { w: "Week 1", t: "Kubernetes Basics", d: "Pods, deployments, services" },
              { w: "Week 2", t: "Distributed Systems", d: "CAP, consensus, sharding" },
              { w: "Week 3", t: "System Design Drills", d: "Design Twitter, Uber, Slack" },
              { w: "Week 4", t: "Mock Interviews", d: "5 sessions, recorded feedback" },
            ].map((r) => (
              <div key={r.w} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent-purple">{r.w}</div>
                <div className="mt-2 text-sm font-semibold">{r.t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
          <h3 className="text-sm font-semibold">Interview Tracker</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[{ l: "Applied", v: 12 }, { l: "Upcoming", v: 3 }, { l: "Offers", v: 2 }].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="text-xl font-bold">{s.v}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {[
              { c: "Stripe", r: "Backend Eng (L4)", s: "Onsite · Fri" },
              { c: "Vercel", r: "Full-stack", s: "Tech screen · Mon" },
            ].map((i) => (
              <div key={i.c} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div>
                  <div className="text-sm font-semibold">{i.c}</div>
                  <div className="text-xs text-muted-foreground">{i.r}</div>
                </div>
                <span className="font-mono text-[10px] text-accent-purple">{i.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
