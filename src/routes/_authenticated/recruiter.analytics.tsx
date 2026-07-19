import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";
import team from "@/assets/team-meeting.asset.json";

export const Route = createFileRoute("/_authenticated/recruiter/analytics")({
  head: () => ({ meta: [{ title: "Hiring Analytics — DevScan AI" }] }),
  component: AnalyticsPage,
});

const dist = [{ b: "60-65", c: 12 }, { b: "65-70", c: 24 }, { b: "70-75", c: 38 }, { b: "75-80", c: 52 }, { b: "80-85", c: 41 }, { b: "85-90", c: 28 }, { b: "90+", c: 14 }];
const conv = Array.from({ length: 12 }).map((_, i) => ({ m: i + 1, v: 30 + Math.round(Math.random() * 40) }));
const PURPLE = "oklch(0.7 0.22 295)";
const BLUE = "oklch(0.68 0.18 250)";

function AnalyticsPage() {
  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Hiring Analytics"
      title="Your pipeline, quantified."
      description="Source quality, stage conversion, time-to-offer — across roles and quarters."
      image={team.url}
      stats={[{ label: "Pipeline", value: "184" }, { label: "Conv to offer", value: "9.4%", trend: "+1.2pp" }, { label: "TTH", value: "21 days" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Composite score distribution">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dist}>
                <XAxis dataKey="b" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="c" fill={BLUE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Pipeline conversion %">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conv}>
                <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke={PURPLE} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Hires by source" className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conv}>
                <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PURPLE} stopOpacity={0.5} /><stop offset="100%" stopColor={PURPLE} stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Area type="monotone" dataKey="v" stroke={PURPLE} fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
