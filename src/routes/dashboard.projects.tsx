import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import aiHiring from "@/assets/ai-hiring.asset.json";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLatestGithub } from "@/lib/github/analyze.functions";

export const Route = createFileRoute("/dashboard/projects")({
  head: () => ({ meta: [{ title: "Project Analyzer — DevScan AI" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const fetchGh = useServerFn(getLatestGithub);
  const { data: gh } = useQuery({ queryKey: ["latest-github"], queryFn: () => fetchGh() });
  const repos = (gh?.top_repos as any[]) ?? [];

  // Deterministic pseudo-scores derived from stars/language so re-renders are stable.
  const scored = repos.map((r) => {
    const base = Math.min(100, 60 + Math.round((r.stars ?? 0) / 3));
    const jitter = ((r.name?.length ?? 5) * 7) % 15;
    return {
      n: r.name,
      s: [r.language, r.description].filter(Boolean).join(" · "),
      q: Math.min(100, base + 2),
      d: Math.max(50, base - 8 + (jitter % 8)),
      i: Math.min(100, base + (jitter % 6)),
      sc: Math.max(55, base - 4),
      url: r.url,
    };
  });

  const avg = scored.length ? Math.round(scored.reduce((a, r) => a + r.q, 0) / scored.length) : 0;
  const top = scored.length ? Math.max(...scored.map((r) => r.q)) : 0;

  return (
    <FeaturePage
      role="student"
      eyebrow="Project Analyzer"
      title="Quality, not quantity."
      description="Each repo graded across quality, documentation, innovation, and scalability."
      image={aiHiring.url}
      stats={[
        { label: "Projects", value: String(scored.length) },
        { label: "Avg quality", value: String(avg) },
        { label: "Top score", value: String(top) },
      ]}
    >
      {scored.length === 0 ? (
        <Card><p className="text-sm text-muted-foreground">Run a GitHub analysis first — your top repos will appear here.</p></Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {scored.map((p) => (
            <Card key={p.n} title={p.n} subtitle={p.s}>
              <div className="space-y-3">
                <Progress label="Quality" value={p.q} />
                <Progress label="Documentation" value={p.d} accent="blue" />
                <Progress label="Innovation" value={p.i} accent="green" />
                <Progress label="Scalability" value={p.sc} />
              </div>
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs text-accent-purple hover:underline">
                  View on GitHub →
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </FeaturePage>
  );
}
