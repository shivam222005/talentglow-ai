import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Filter, ArrowUpRight, Search } from "lucide-react";

export const Route = createFileRoute("/recruiter")({
  head: () => ({ meta: [{ title: "Recruiter Dashboard — DevScan AI" }] }),
  component: RecruiterDashboard,
});

const PURPLE = "oklch(0.7 0.22 295)";
const BLUE = "oklch(0.68 0.18 250)";

const candidates = [
  { name: "Alex Rivera", init: "AR", role: "Full-stack", skill: 94, gh: 88, proj: 91, ready: 92 },
  { name: "Maya Singh", init: "MS", role: "Backend", skill: 89, gh: 92, proj: 87, ready: 88 },
  { name: "Liam Chen", init: "LC", role: "ML Engineer", skill: 86, gh: 79, proj: 90, ready: 85 },
  { name: "Sara Diaz", init: "SD", role: "Frontend", skill: 82, gh: 75, proj: 84, ready: 80 },
  { name: "Tom Park", init: "TP", role: "DevOps", skill: 78, gh: 82, proj: 76, ready: 76 },
  { name: "Nina Brooks", init: "NB", role: "Full-stack", skill: 75, gh: 70, proj: 80, ready: 73 },
];

const radar = [
  { s: "DSA", v: 92 }, { s: "Backend", v: 88 }, { s: "Frontend", v: 76 },
  { s: "System", v: 85 }, { s: "Database", v: 79 }, { s: "DevOps", v: 70 },
];

function RecruiterDashboard() {
  return (
    <DashboardShell role="recruiter">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">Recruiter</span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Candidate intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">2,481 active profiles · 47 in pipeline</p>
        </div>
        <button className="flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-white glow-purple">
          Export shortlist <ArrowUpRight className="size-4" />
        </button>
      </div>

      {/* KPIs */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { l: "Avg. Skill Score", v: "82.4", t: "+3.2% MoM" },
          { l: "Top Candidates", v: "47", t: "Score ≥ 85" },
          { l: "Active Pipelines", v: "12", t: "5 hiring now" },
          { l: "Offer Rate", v: "89%", t: "Industry: 62%" },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl glass p-5 ring-1 ring-white/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-2 text-3xl font-bold">{k.v}</div>
            <div className="mt-1 text-xs text-accent-green">{k.t}</div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="mt-8 rounded-2xl glass p-5 ring-1 ring-white/5">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search by name, skill, or stack..."
              className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
            />
          </div>
          {["All roles", "Senior", "Mid", "Junior"].map((f, i) => (
            <button key={f} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-white/10 ${i === 0 ? "bg-accent-purple/15 text-accent-purple" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
              <Filter className="size-3" /> {f}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate table */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl glass ring-1 ring-white/5 lg:col-span-2">
          <div className="border-b border-white/5 p-5">
            <h3 className="text-sm font-semibold">Candidate Ranking</h3>
            <p className="text-xs text-muted-foreground">Composite score · skill + GitHub + projects + readiness</p>
          </div>
          <div className="divide-y divide-white/5">
            {candidates.map((c, i) => {
              const score = Math.round((c.skill + c.gh + c.proj + c.ready) / 4);
              return (
                <div key={c.name} className="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm hover:bg-white/[0.02]">
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="w-5 font-mono text-xs text-muted-foreground">#{i + 1}</span>
                    <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">{c.init}</div>
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role}</div>
                    </div>
                  </div>
                  <Bar2 col="col-span-2" v={c.skill} label="Skill" />
                  <Bar2 col="col-span-2" v={c.gh} label="GitHub" />
                  <Bar2 col="col-span-2" v={c.proj} label="Project" />
                  <div className="col-span-2 text-right">
                    <div className="text-lg font-bold text-accent-purple">{score}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Composite</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top candidate detail */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">AR</div>
            <div>
              <div className="text-sm font-semibold">Alex Rivera</div>
              <div className="text-xs text-muted-foreground">Top candidate · 92 score</div>
            </div>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={10} />
                <Radar dataKey="v" stroke={PURPLE} fill={PURPLE} fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Years exp</span><span>4.2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Stack match</span><span className="text-accent-green">96%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Availability</span><span>2 weeks</span></div>
          </div>
          <button className="mt-5 w-full rounded-lg gradient-primary py-2.5 text-sm font-semibold text-white glow-purple">View full profile</button>
        </div>

        {/* Candidate distribution */}
        <div className="rounded-2xl glass p-6 ring-1 ring-white/5 lg:col-span-3">
          <h3 className="text-sm font-semibold">Candidate distribution by composite score</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { b: "60-65", c: 12 }, { b: "65-70", c: 24 }, { b: "70-75", c: 38 },
                { b: "75-80", c: 52 }, { b: "80-85", c: 41 }, { b: "85-90", c: 28 }, { b: "90+", c: 14 },
              ]}>
                <XAxis dataKey="b" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="c" fill={BLUE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Bar2({ v, label, col }: { v: number; label: string; col: string }) {
  return (
    <div className={col}>
      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground"><span>{label}</span><span>{v}</span></div>
      <div className="h-1 rounded-full bg-white/5">
        <div className="h-full rounded-full gradient-primary" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
