import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import handshake from "@/assets/handshake-office.asset.json";

export const Route = createFileRoute("/recruiter/compare")({
  head: () => ({ meta: [{ title: "Candidate Comparison — DevScan AI" }] }),
  component: ComparePage,
});

const data = [
  { s: "DSA", a: 92, b: 84, c: 88 },
  { s: "Backend", a: 88, b: 92, c: 80 },
  { s: "Frontend", a: 76, b: 70, c: 90 },
  { s: "System", a: 85, b: 88, c: 72 },
  { s: "Database", a: 79, b: 91, c: 76 },
  { s: "DevOps", a: 70, b: 85, c: 65 },
];

function ComparePage() {
  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Comparison"
      title="Three candidates. One decision."
      description="Side-by-side radar across the 6 core engineering dimensions, with delta callouts."
      image={handshake.url}
    >
      <Card title="Skill radar overlay">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
              <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={11} />
              <Legend />
              <Radar name="Alex" dataKey="a" stroke="oklch(0.7 0.22 295)" fill="oklch(0.7 0.22 295)" fillOpacity={0.25} />
              <Radar name="Maya" dataKey="b" stroke="oklch(0.68 0.18 250)" fill="oklch(0.68 0.18 250)" fillOpacity={0.25} />
              <Radar name="Liam" dataKey="c" stroke="oklch(0.75 0.18 155)" fill="oklch(0.75 0.18 155)" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </FeaturePage>
  );
}
