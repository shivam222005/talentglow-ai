import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import aiHiring from "@/assets/ai-hiring.asset.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { computeSkills, getSkills } from "@/lib/skills/compute.functions";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/skills")({
  head: () => ({ meta: [{ title: "Skill Intelligence — DevScan AI" }] }),
  component: SkillsPage,
});

const LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  dsa: "DSA",
  system_design: "System",
  database: "Database",
  devops: "DevOps",
  ai_ml: "AI/ML",
  cloud: "Cloud",
};

function SkillsPage() {
  const qc = useQueryClient();
  const fetchScores = useServerFn(getSkills);
  const recompute = useServerFn(computeSkills);
  const { data: scores } = useQuery({ queryKey: ["skills"], queryFn: () => fetchScores() });

  const run = useMutation({
    mutationFn: async () => recompute({}),
    onSuccess: () => { toast.success("Skills recomputed"); qc.invalidateQueries({ queryKey: ["skills"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const radar = scores
    ? Object.keys(LABELS).map((k) => ({ s: LABELS[k], v: (scores as any)[k] as number }))
    : [];
  const stats = scores
    ? [
        { label: "Composite", value: String(scores.composite) },
        { label: "Strongest", value: LABELS[scores.strongest ?? "frontend"] ?? "-" },
        { label: "Weakest", value: LABELS[scores.weakest ?? "devops"] ?? "-" },
      ]
    : undefined;

  return (
    <FeaturePage
      role="student"
      eyebrow="Skill Intelligence"
      title="Where you stand."
      description="Composite scoring across 8 dimensions, derived from your resume and GitHub."
      image={aiHiring.url}
      stats={stats}
    >
      <div className="mb-6">
        <button
          onClick={() => run.mutate()}
          disabled={run.isPending}
          className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-white glow-purple disabled:opacity-50"
        >
          {run.isPending ? <><Loader2 className="size-4 animate-spin" /> Computing…</> : <><Sparkles className="size-4" /> Recompute from latest data</>}
        </button>
      </div>

      {!scores ? (
        <Card><p className="text-sm text-muted-foreground">Analyze a resume and a GitHub profile, then click "Recompute" to see your skill radar.</p></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Skill radar">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
                  <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={11} />
                  <Radar dataKey="v" stroke="oklch(0.7 0.22 295)" fill="oklch(0.7 0.22 295)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Breakdown">
            <div className="space-y-3">
              {Object.entries(LABELS).map(([k, label]) => (
                <Progress key={k} label={label} value={(scores as any)[k]} accent={k === "frontend" || k === "backend" ? "purple" : k === "dsa" ? "blue" : "green"} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </FeaturePage>
  );
}
