import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/dashboard/github")({
  head: () => ({ meta: [{ title: "GitHub Intelligence — DevScan AI" }] }),
  component: GitHubPage,
});

const BLUE = "oklch(0.68 0.18 250)";
const PURPLE = "oklch(0.7 0.22 295)";
const data = Array.from({ length: 12 }).map((_, i) => ({ m: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], c: 40 + Math.round(Math.random() * 200) }));
const langs = [{ l: "TS", v: 412 }, { l: "Py", v: 308 }, { l: "Go", v: 184 }, { l: "Rust", v: 92 }, { l: "Java", v: 70 }];

function GitHubPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="GitHub Intelligence"
      title="Your public code, scored."
      description="We analyze commit cadence, language depth, repo quality, and collaboration signal across every public repo."
      image={aiHiring.url}
      stats={[{ label: "Repos", value: "47" }, { label: "Stars", value: "284", trend: "+12 this week" }, { label: "Streak", value: "47d" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Commit activity" subtitle="Last 12 months" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUE} stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="c" stroke={BLUE} fill="url(#g1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Language footprint" subtitle="By commits">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langs} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="l" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} width={36} />
                <Bar dataKey="v" fill={PURPLE} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Top repositories" className="lg:col-span-3">
          <div className="divide-y divide-white/5">
            {[
              { n: "realtime-chat-engine", l: "TypeScript", s: 142, c: 312 },
              { n: "ml-feature-store", l: "Python", s: 88, c: 196 },
              { n: "edge-cache", l: "Go", s: 31, c: 84 },
              { n: "devops-toolkit", l: "Rust", s: 22, c: 47 },
            ].map((r) => (
              <div key={r.n} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-semibold">{r.n}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.l} · {r.c} commits</div>
                </div>
                <div className="text-sm text-accent-purple">★ {r.s}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
