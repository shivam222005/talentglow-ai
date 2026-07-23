import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { listCandidates } from "@/lib/recruiter/candidates.functions";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/recruiter/reports")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reports & Exports — DevScan AI" }] }),
  component: ReportsPage,
});

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const fn = useServerFn(listCandidates);
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (kind: "csv" | "shortlist" | "report") => {
    setBusy(kind);
    try {
      const { candidates } = await fn({ data: { limit: 100 } });
      if (kind === "csv") {
        const header = ["name","headline","composite","github","stars","repos","projects","strongest","weakest"];
        const rows = candidates.map((c) => [
          c.full_name, c.headline ?? "", c.composite,
          c.github?.username ?? "", c.github?.total_stars ?? 0, c.github?.public_repos ?? 0,
          c.project_count, c.strongest ?? "", c.weakest ?? "",
        ]);
        const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        download(`devscan-candidates-${Date.now()}.csv`, csv, "text/csv");
      } else if (kind === "shortlist") {
        const top = candidates.slice(0, 25);
        const md = `# DevScan AI — Shortlist (Top ${top.length})\n\nGenerated ${new Date().toLocaleString()}\n\n` +
          top.map((c, i) => `## ${i + 1}. ${c.full_name} — ${c.composite}\n- ${c.headline ?? ""}\n- GitHub: ${c.github?.username ?? "—"} (★ ${c.github?.total_stars ?? 0}, ${c.github?.public_repos ?? 0} repos)\n- Projects analyzed: ${c.project_count}\n- Strongest: ${c.strongest ?? "—"} · Weakest: ${c.weakest ?? "—"}\n`).join("\n");
        download(`devscan-shortlist-${Date.now()}.md`, md, "text/markdown");
      } else {
        const json = JSON.stringify({ generated_at: new Date().toISOString(), candidates }, null, 2);
        download(`devscan-report-${Date.now()}.json`, json, "application/json");
      }
      toast.success("Export ready");
    } catch (e: any) {
      toast.error(e.message ?? "Export failed");
    } finally {
      setBusy(null);
    }
  };

  const items = [
    { i: FileText, t: "Shortlist (Markdown)", d: "Top 25 candidates with composite scores and highlights.", k: "shortlist" as const },
    { i: FileSpreadsheet, t: "Full CSV export", d: "Every profile with skill, GitHub, and project signals.", k: "csv" as const },
    { i: FileDown, t: "Full report (JSON)", d: "Structured data snapshot for downstream tooling.", k: "report" as const },
  ];

  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Reports & Exports"
      title="Take it with you."
      description="Generate shortlists, CSV exports, and structured reports in one click."
      image={clipboard.url}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((r) => (
          <Card key={r.t}>
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent-purple/15 text-accent-purple ring-1 ring-accent-purple/30 glow-purple"><r.i className="size-5" /></div>
            <h3 className="mt-4 text-base font-semibold">{r.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{r.d}</p>
            <button
              onClick={() => run(r.k)}
              disabled={busy !== null}
              className="mt-5 w-full rounded-lg gradient-primary py-2 text-sm font-semibold text-white glow-purple disabled:opacity-60"
            >
              {busy === r.k ? "Generating..." : "Generate"}
            </button>
          </Card>
        ))}
      </div>
    </FeaturePage>
  );
}
