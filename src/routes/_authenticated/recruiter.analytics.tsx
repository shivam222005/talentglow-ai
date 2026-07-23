import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import team from "@/assets/team-meeting.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getRecruiterAnalytics } from "@/lib/recruiter/candidates.functions";

export const Route = createFileRoute("/_authenticated/recruiter/analytics")({
  ssr: false,
  head: () => ({ meta: [{ title: "Hiring Analytics — DevScan AI" }] }),
  component: AnalyticsPage,
});

const BLUE = "oklch(0.68 0.18 250)";

function AnalyticsPage() {
  const fn = useServerFn(getRecruiterAnalytics);
  const { data, isLoading } = useQuery({ queryKey: ["recruiter-analytics"], queryFn: () => fn({}) });

  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Hiring Analytics"
      title="Your pipeline, quantified."
      description="Composite score distribution across your candidate pool."
      image={team.url}
      stats={[
        { label: "Candidates", value: isLoading ? "…" : String(data?.total ?? 0) },
        { label: "Avg score", value: isLoading ? "…" : String(data?.avg ?? 0) },
        { label: "Top-tier ≥85", value: isLoading ? "…" : String(data?.top ?? 0) },
      ]}
    >
      {data?.is_demo && (
        <div className="mb-4 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-4 py-2 text-xs text-accent-purple">
          Showing demo analytics — no student scores yet.
        </div>
      )}
      <Card title="Composite score distribution">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.dist ?? []}>
              <XAxis dataKey="b" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="c" fill={BLUE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </FeaturePage>
  );
}
