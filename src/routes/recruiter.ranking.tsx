import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/recruiter/ranking")({
  head: () => ({ meta: [{ title: "Candidate Ranking — DevScan AI" }] }),
  component: RankingPage,
});

const ranked = [
  { n: "Alex Rivera", role: "Full-stack", sk: 94, gh: 88, pr: 91, rd: 92 },
  { n: "Maya Singh", role: "Backend", sk: 89, gh: 92, pr: 87, rd: 88 },
  { n: "Liam Chen", role: "ML Eng", sk: 86, gh: 79, pr: 90, rd: 85 },
  { n: "Sara Diaz", role: "Frontend", sk: 82, gh: 75, pr: 84, rd: 80 },
];

function RankingPage() {
  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Ranking"
      title="Composite ranking, weighted by you."
      description="Tune the weights for skill, GitHub, project quality, and readiness — rankings update instantly."
      image={aiHiring.url}
    >
      <Card title="Top 20 candidates" subtitle="Composite score · adjustable weights">
        <div className="divide-y divide-white/5">
          {ranked.map((c, i) => {
            const score = Math.round((c.sk + c.gh + c.pr + c.rd) / 4);
            return (
              <div key={c.n} className="grid grid-cols-12 items-center gap-3 py-4 text-sm">
                <div className="col-span-4 flex items-center gap-3">
                  <span className="w-5 font-mono text-xs text-muted-foreground">#{i + 1}</span>
                  <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">{c.n.split(" ").map((p) => p[0]).join("")}</div>
                  <div>
                    <div className="font-semibold">{c.n}</div>
                    <div className="text-xs text-muted-foreground">{c.role}</div>
                  </div>
                </div>
                {["sk","gh","pr","rd"].map((k, j) => (
                  <div key={k} className="col-span-1">
                    <div className="mb-1 text-[10px] uppercase text-muted-foreground">{["Skill","GitHub","Proj","Read"][j]}</div>
                    <div className="h-1 rounded-full bg-white/5"><div className="h-full rounded-full gradient-primary" style={{ width: `${(c as any)[k]}%` }} /></div>
                  </div>
                ))}
                <div className="col-span-4 text-right">
                  <div className="text-2xl font-bold text-accent-purple">{score}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Composite</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </FeaturePage>
  );
}
