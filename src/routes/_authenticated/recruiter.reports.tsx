import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";

export const Route = createFileRoute("/_authenticated/recruiter/reports")({
  head: () => ({ meta: [{ title: "Reports & Exports — DevScan AI" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Reports & Exports"
      title="Take it with you."
      description="Generate PDF shortlists, CSV exports, and stakeholder-ready hiring reports in one click."
      image={clipboard.url}
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { i: FileText, t: "Shortlist PDF", d: "Top 25 candidates with composite scores and contact." },
          { i: FileSpreadsheet, t: "Full CSV export", d: "All 2,481 profiles with every signal field." },
          { i: FileDown, t: "Quarterly report", d: "Pipeline performance, time-to-hire, sources." },
        ].map((r) => (
          <Card key={r.t}>
            <div className="flex size-12 items-center justify-center rounded-xl bg-accent-purple/15 text-accent-purple ring-1 ring-accent-purple/30 glow-purple"><r.i className="size-5" /></div>
            <h3 className="mt-4 text-base font-semibold">{r.t}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{r.d}</p>
            <button className="mt-5 w-full rounded-lg gradient-primary py-2 text-sm font-semibold text-white glow-purple">Generate</button>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Card title="Recent exports">
          <div className="divide-y divide-white/5">
            {[
              { f: "shortlist-q1-2026.pdf", d: "2 hours ago", s: "1.2 MB" },
              { f: "candidates-full.csv", d: "Yesterday", s: "486 KB" },
              { f: "hiring-report-q4.pdf", d: "3 days ago", s: "2.8 MB" },
            ].map((r) => (
              <div key={r.f} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-mono">{r.f}</div>
                  <div className="text-xs text-muted-foreground">{r.d} · {r.s}</div>
                </div>
                <button className="rounded-md bg-white/5 px-3 py-1 text-xs ring-1 ring-white/10 hover:bg-white/10">Download</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
