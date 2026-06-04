import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Sparkles, Download } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";

export const Route = createFileRoute("/dashboard/resume-builder")({
  head: () => ({ meta: [{ title: "Resume Builder — DevScan AI" }] }),
  component: ResumeBuilder,
});

function ResumeBuilder() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Resume Builder"
      title="One target job. One perfect resume."
      description="Paste a job description — we rewrite every bullet to match while staying 100% true to your real experience."
      image={clipboard.url}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Target job" icon={Sparkles}>
          <textarea defaultValue="Senior Backend Engineer at Stripe. 5+ years Python, distributed systems, payment infra, gRPC, Kafka..." rows={10} className="w-full rounded-lg bg-white/5 p-3 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
          <button className="mt-4 w-full rounded-lg gradient-primary py-2.5 text-sm font-semibold text-white glow-purple">Rewrite resume</button>
        </Card>
        <Card title="AI-rewritten preview">
          <div className="rounded-xl bg-white/5 p-5 text-sm leading-relaxed ring-1 ring-white/10">
            <div className="text-base font-bold">Alex Rivera</div>
            <div className="text-xs text-muted-foreground">Backend Engineer · alex@email.com</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-accent-purple">Experience</div>
            <p className="mt-2"><b>Led migration</b> of payment ledger to gRPC, cutting p99 latency by <b>62%</b> and supporting <b>4M+ transactions/day</b>.</p>
            <p className="mt-2"><b>Designed Kafka-backed event pipeline</b> processing <b>120K events/sec</b> for fraud detection.</p>
            <p className="mt-2"><b>Mentored 4 engineers</b> on distributed systems patterns and code review practices.</p>
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10">
            <Download className="size-4" /> Download PDF
          </button>
        </Card>
      </div>
    </FeaturePage>
  );
}
