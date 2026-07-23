import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import aiHiring from "@/assets/ai-hiring.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listCandidates } from "@/lib/recruiter/candidates.functions";

export const Route = createFileRoute("/_authenticated/recruiter/ranking")({
  ssr: false,
  head: () => ({ meta: [{ title: "Candidate Ranking — DevScan AI" }] }),
  component: RankingPage,
});

function RankingPage() {
  const [weights, setWeights] = useState({ skill: 40, github: 25, projects: 20, readiness: 15 });
  const fn = useServerFn(listCandidates);
  const { data, isLoading } = useQuery({
    queryKey: ["recruiter-ranking"],
    queryFn: () => fn({ data: { limit: 50 } }),
  });

  const candidates = data?.candidates ?? [];
  const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const ranked = [...candidates]
    .map((c) => {
      const sk = c.composite;
      const gh = c.github?.quality_score ?? 0;
      const pr = Math.min(100, c.project_count * 15);
      const rd = c.skills ? Math.round((c.skills.system_design + c.skills.dsa) / 2) : 0;
      const score = Math.round((sk * weights.skill + gh * weights.github + pr * weights.projects + rd * weights.readiness) / totalW);
      return { ...c, sk, gh, pr, rd, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Ranking"
      title="Composite ranking, weighted by you."
      description="Tune the weights — rankings update instantly."
      image={aiHiring.url}
    >
      {data?.is_demo && (
        <div className="mb-4 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-4 py-2 text-xs text-accent-purple">
          Showing demo ranking — no student data yet.
        </div>
      )}
      <Card title="Weights">
        <div className="grid gap-4 md:grid-cols-4">
          {(["skill", "github", "projects", "readiness"] as const).map((k) => (
            <label key={k} className="text-xs">
              <div className="mb-1 flex justify-between capitalize text-muted-foreground">
                <span>{k}</span><span className="font-mono">{weights[k]}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={weights[k]}
                onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })}
                className="w-full"
              />
            </label>
          ))}
        </div>
      </Card>
      <Card title={isLoading ? "Loading..." : `Top ${ranked.length}`} subtitle="Composite score">
        <div className="divide-y divide-white/5">
          {ranked.map((c, i) => (
            <div key={c.id} className="grid grid-cols-12 items-center gap-3 py-4 text-sm">
              <div className="col-span-4 flex items-center gap-3">
                <span className="w-5 font-mono text-xs text-muted-foreground">#{i + 1}</span>
                <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                  {c.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-semibold">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground">{c.headline ?? "—"}</div>
                </div>
              </div>
              {[["Skill", c.sk], ["GitHub", c.gh], ["Proj", c.pr], ["Read", c.rd]].map(([label, v]) => (
                <div key={label as string} className="col-span-1">
                  <div className="mb-1 text-[10px] uppercase text-muted-foreground">{label}</div>
                  <div className="h-1 rounded-full bg-white/5">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${v as number}%` }} />
                  </div>
                </div>
              ))}
              <div className="col-span-4 text-right">
                <div className="text-2xl font-bold text-accent-purple">{c.score}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Composite</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </FeaturePage>
  );
}
