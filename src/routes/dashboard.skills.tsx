import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/dashboard/skills")({
  head: () => ({ meta: [{ title: "Skill Intelligence — DevScan AI" }] }),
  component: SkillsPage,
});

const radar = [
  { s: "DSA", v: 88 }, { s: "Backend", v: 86 }, { s: "Frontend", v: 92 },
  { s: "System", v: 74 }, { s: "Database", v: 70 }, { s: "DevOps", v: 65 },
];

function SkillsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Skill Intelligence"
      title="Where you stand vs. peers."
      description="Composite scoring across 6 dimensions, benchmarked against 12,000 students at similar institutions."
      image={aiHiring.url}
      stats={[{ label: "Composite", value: "82", trend: "Top 12%" }, { label: "Strongest", value: "Frontend" }, { label: "Weakest", value: "DevOps" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Skill radar">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={11} />
                <Radar dataKey="v" stroke="oklch(0.7 0.22 295)" fill="oklch(0.7 0.22 295)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Detailed breakdown">
          <div className="space-y-4">
            {radar.map((r) => <Progress key={r.s} label={r.s} value={r.v} />)}
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
