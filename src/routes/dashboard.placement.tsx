import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import { CheckCircle2, AlertCircle } from "lucide-react";
import hr from "@/assets/hr-handshake.asset.json";

export const Route = createFileRoute("/dashboard/placement")({
  head: () => ({ meta: [{ title: "Placement Readiness — DevScan AI" }] }),
  component: PlacementPage,
});

function PlacementPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Placement Readiness"
      title="Are you interview-ready?"
      description="A composite hireability score from 7 weighted signals — what recruiters at top companies actually look at."
      image={hr.url}
      stats={[{ label: "Readiness", value: "78", trend: "Interview-ready" }, { label: "Strong dims", value: "5/7" }, { label: "ETA", value: "3 wks" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Score breakdown" className="lg:col-span-2">
          <div className="space-y-4">
            <Progress label="Technical skills" value={86} />
            <Progress label="Project quality" value={88} accent="blue" />
            <Progress label="Resume quality" value={94} accent="green" />
            <Progress label="GitHub activity" value={82} />
            <Progress label="DSA proficiency" value={74} accent="blue" />
            <Progress label="System design" value={62} />
            <Progress label="Communication" value={70} accent="green" />
          </div>
        </Card>
        <Card title="To unlock 'Ready'">
          <div className="space-y-3 text-sm">
            {[
              { ok: true, t: "Resume ATS-optimized" },
              { ok: true, t: "5+ public projects" },
              { ok: true, t: "Mock interview ≥3" },
              { ok: false, t: "System design course" },
              { ok: false, t: "1 OSS contribution" },
            ].map((r) => (
              <div key={r.t} className="flex items-center gap-2">
                {r.ok ? <CheckCircle2 className="size-4 text-accent-green" /> : <AlertCircle className="size-4 text-muted-foreground" />}
                <span className={r.ok ? "" : "text-muted-foreground"}>{r.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
