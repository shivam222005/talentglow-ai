import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import { Upload, FileText, Sparkles } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — DevScan AI" }] }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Resume Analyzer"
      title="Your resume, X-rayed."
      description="Upload a PDF — we extract skills, score ATS-readiness, and find every gap a recruiter would catch."
      image={clipboard.url}
      stats={[
        { label: "ATS Score", value: "94", trend: "+8 vs. last" },
        { label: "Keywords", value: "37/42" },
        { label: "Read time", value: "0:42" },
      ]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Upload resume" subtitle="PDF · DOCX · up to 10MB" icon={Upload}>
          <div className="rounded-xl border-2 border-dashed border-white/10 p-8 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm">Drop your resume here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
            <button className="mt-4 rounded-lg gradient-primary px-4 py-2 text-xs font-semibold text-white glow-purple">Choose file</button>
          </div>
        </Card>
        <Card title="Extracted skills" subtitle="From 2 pages, 8 sections" className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {["React","TypeScript","Node.js","PostgreSQL","GraphQL","Docker","AWS","Redis","Python","Kafka","Next.js","Jest"].map((t) => (
              <span key={t} className="rounded-full bg-accent-purple/10 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/20">{t}</span>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <Progress label="Action verbs" value={88} />
            <Progress label="Quantified results" value={72} accent="blue" />
            <Progress label="Formatting consistency" value={95} accent="green" />
            <Progress label="Keyword density" value={64} />
          </div>
        </Card>
        <Card title="AI suggestions" subtitle="Priority fixes" icon={Sparkles} className="lg:col-span-3">
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              "Add metrics to 'Led migration': specify team size, latency improvement.",
              "Move 'Open Source' section above 'Education' — recruiters look there first.",
              "Add Kubernetes — appears in 78% of target roles, missing from resume.",
              "Trim summary to 2 lines — current version is 4.",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                <span className="font-mono text-xs text-accent-purple">0{i + 1}</span>
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </FeaturePage>
  );
}
