import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from "recharts";
import handshake from "@/assets/handshake-office.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { getCandidatesByIds, listCandidates } from "@/lib/recruiter/candidates.functions";

const searchSchema = z.object({ ids: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/_authenticated/recruiter/compare")({
  ssr: false,
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Candidate Comparison — DevScan AI" }] }),
  component: ComparePage,
});

const COLORS = ["oklch(0.7 0.22 295)", "oklch(0.68 0.18 250)", "oklch(0.75 0.18 155)"];

function ComparePage() {
  const { ids: idsParam } = Route.useSearch();
  const initial = idsParam ? idsParam.split(",").filter(Boolean).slice(0, 3) : [];
  const [selected, setSelected] = useState<string[]>(initial);

  const listFn = useServerFn(listCandidates);
  const detailFn = useServerFn(getCandidatesByIds);

  const list = useQuery({ queryKey: ["cmp-list"], queryFn: () => listFn({ data: { limit: 50 } }) });
  const details = useQuery({
    queryKey: ["cmp-details", selected.join(",")],
    queryFn: () => detailFn({ data: { ids: selected } }),
    enabled: selected.length > 0,
  });

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  const cands = details.data ?? [];
  const dims = ["dsa", "backend", "frontend", "system_design", "database", "devops", "ai_ml", "cloud"] as const;
  const chartData = dims.map((d) => {
    const row: any = { s: d.replace("_", " ") };
    cands.forEach((c, i) => { row[`c${i}`] = c.skills?.[d] ?? 0; });
    return row;
  });

  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Comparison"
      title="Compare up to 3 candidates."
      description="Side-by-side radar across 8 engineering dimensions."
      image={handshake.url}
    >
      <Card title="Select candidates" subtitle={`${selected.length}/3 selected`}>
        <div className="flex flex-wrap gap-2">
          {(list.data?.candidates ?? []).slice(0, 20).map((c) => (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs ring-1 ${selected.includes(c.id) ? "bg-accent-purple/20 text-accent-purple ring-accent-purple/40" : "bg-white/5 text-muted-foreground ring-white/10 hover:bg-white/10"}`}
            >
              {c.full_name} · {c.composite}
            </button>
          ))}
        </div>
      </Card>
      <Card title="Skill radar overlay">
        {cands.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Select 1–3 candidates above.</div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="s" stroke="oklch(0.6 0.01 285)" fontSize={11} />
                <Legend />
                {cands.map((c, i) => (
                  <Radar key={c.id} name={c.full_name} dataKey={`c${i}`} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.22} />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </FeaturePage>
  );
}
