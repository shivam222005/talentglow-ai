import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const PURPLE = "oklch(0.7 0.22 295)";
const BLUE = "oklch(0.68 0.18 250)";
const CYAN = "oklch(0.78 0.13 200)";
const GREEN = "oklch(0.75 0.18 155)";

const activity = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  commits: Math.round(40 + Math.random() * 180 + i * 6),
  prs: Math.round(10 + Math.random() * 40),
}));

const dist = [
  { name: "TypeScript", value: 38 },
  { name: "Python", value: 24 },
  { name: "Rust", value: 14 },
  { name: "Go", value: 12 },
  { name: "Other", value: 12 },
];

const radar = [
  { skill: "Java", v: 82 },
  { skill: "DSA", v: 88 },
  { skill: "DB", v: 70 },
  { skill: "Backend", v: 86 },
  { skill: "Frontend", v: 92 },
  { skill: "Problem", v: 79 },
];

const hiring = Array.from({ length: 8 }).map((_, i) => ({
  w: `W${i + 1}`,
  p: Math.min(95, 40 + i * 7 + Math.random() * 6),
}));

export function LiveAnalytics() {
  return (
    <section id="analytics" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,oklch(0.7_0.22_295/0.08),transparent_60%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan">Live Analytics</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl text-gradient">
            See talent at the data layer.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* Coding activity */}
          <div className="rounded-2xl glass p-6 ring-1 ring-white/5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Coding activity trends</h3>
                <p className="text-xs text-muted-foreground">Commits + pull requests, last 12 months</p>
              </div>
              <span className="font-mono text-[10px] text-accent-green">+24.6% YoY</span>
            </div>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE} stopOpacity={0.6} />
                      <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={BLUE} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={BLUE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="commits" stroke={PURPLE} fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="prs" stroke={BLUE} fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language distribution */}
          <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
            <h3 className="text-sm font-semibold">Skill distribution</h3>
            <p className="text-xs text-muted-foreground">Across analyzed repos</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dist} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {dist.map((_, i) => (
                      <Cell key={i} fill={[PURPLE, BLUE, CYAN, GREEN, "oklch(0.4 0.01 285)"][i]} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              {dist.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ background: [PURPLE, BLUE, CYAN, GREEN, "oklch(0.4 0.01 285)"][i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring probability */}
          <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
            <h3 className="text-sm font-semibold">Hiring probability</h3>
            <p className="text-xs text-muted-foreground">Trend over 8 weeks</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiring}>
                  <XAxis dataKey="w" stroke="oklch(0.5 0.01 285)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="p" stroke={GREEN} strokeWidth={2.5} dot={{ fill: GREEN, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill radar */}
          <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
            <h3 className="text-sm font-semibold">Skill radar</h3>
            <p className="text-xs text-muted-foreground">Top candidate profile</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                  <PolarAngleAxis dataKey="skill" stroke="oklch(0.6 0.01 285)" fontSize={10} />
                  <PolarRadiusAxis stroke="transparent" />
                  <Radar dataKey="v" stroke={PURPLE} fill={PURPLE} fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GitHub growth */}
          <div className="rounded-2xl glass p-6 ring-1 ring-white/5">
            <h3 className="text-sm font-semibold">GitHub growth</h3>
            <p className="text-xs text-muted-foreground">Stars over time</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity}>
                  <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="prs" fill={BLUE} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
