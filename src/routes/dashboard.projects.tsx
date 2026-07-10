import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import aiHiring from "@/assets/ai-hiring.asset.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { analyzeRepo, deleteRepoReport, listRepoReports } from "@/lib/projects/analyze.functions";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects")({
  head: () => ({ meta: [{ title: "Project Analyzer — DevScan AI" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listRepoReports);
  const analyzeFn = useServerFn(analyzeRepo);
  const deleteFn = useServerFn(deleteRepoReport);
  const [url, setUrl] = useState("");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["repo-reports"],
    queryFn: () => listFn(),
  });

  const analyze = useMutation({
    mutationFn: (u: string) => analyzeFn({ data: { url: u } }),
    onSuccess: () => {
      toast.success("Repository analyzed");
      setUrl("");
      qc.invalidateQueries({ queryKey: ["repo-reports"] });
    },
    onError: (e: Error) => toast.error(e.message || "Analysis failed"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["repo-reports"] }),
  });

  const avg = reports.length ? Math.round(reports.reduce((a: number, r: any) => a + (r.quality ?? 0), 0) / reports.length) : 0;
  const top = reports.length ? Math.max(...reports.map((r: any) => r.quality ?? 0)) : 0;

  return (
    <FeaturePage
      role="student"
      eyebrow="Project Analyzer"
      title="Quality, not quantity."
      description="Paste any public GitHub repository. We fetch it, score it, and generate concrete improvements."
      image={aiHiring.url}
      stats={[
        { label: "Analyzed", value: String(reports.length) },
        { label: "Avg quality", value: String(avg) },
        { label: "Top score", value: String(top) },
      ]}
    >
      <Card>
        <form
          onSubmit={(e) => { e.preventDefault(); if (url.trim()) analyze.mutate(url.trim()); }}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            type="url"
            required
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
          />
          <button
            type="submit"
            disabled={analyze.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {analyze.isPending && <Loader2 className="size-4 animate-spin" />}
            {analyze.isPending ? "Analyzing…" : "Analyze repo"}
          </button>
        </form>
      </Card>

      {isLoading ? (
        <Card><p className="text-sm text-muted-foreground">Loading your analyses…</p></Card>
      ) : reports.length === 0 ? (
        <Card><p className="text-sm text-muted-foreground">No projects analyzed yet. Paste a GitHub URL above to get started.</p></Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reports.map((p: any) => (
            <Card key={p.id} title={p.repo_name} subtitle={p.stack ?? ""}>
              <div className="space-y-3">
                <Progress label="Quality" value={p.quality ?? 0} />
                <Progress label="Documentation" value={p.documentation ?? 0} accent="blue" />
                <Progress label="Maintainability" value={p.maintainability ?? 0} accent="green" />
                <Progress label="Scalability" value={p.scalability ?? 0} />
                <Progress label="Security" value={p.security ?? 0} accent="blue" />
              </div>
              {Array.isArray(p.suggestions) && p.suggestions.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  {p.suggestions.slice(0, 4).map((s: string, i: number) => (
                    <li key={i} className="flex gap-2"><span className="text-accent-purple">→</span><span>{s}</span></li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex items-center justify-between">
                {p.repo_url && (
                  <a href={p.repo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent-purple hover:underline">
                    View on GitHub <ExternalLink className="size-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => del.mutate(p.id)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </FeaturePage>
  );
}
