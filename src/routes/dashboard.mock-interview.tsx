import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Mic, Play } from "lucide-react";
import meeting from "@/assets/meeting-darmel.asset.json";

export const Route = createFileRoute("/dashboard/mock-interview")({
  head: () => ({ meta: [{ title: "Mock Interview — DevScan AI" }] }),
  component: MockInterview,
});

function MockInterview() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Mock Interview"
      title="Practice with an AI interviewer."
      description="Voice-driven sessions. Real rubrics. Recorded feedback you can replay."
      image={meeting.url}
      stats={[{ label: "Sessions", value: "12" }, { label: "Avg score", value: "7.8/10" }, { label: "Best topic", value: "System" }]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Start a session" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Behavioral", d: "30 min · STAR rubric" },
              { t: "DSA — Mediums", d: "45 min · 2 problems" },
              { t: "System Design", d: "60 min · L4 rubric" },
              { t: "Backend Deep-dive", d: "45 min · Python / Go" },
            ].map((s) => (
              <button key={s.t} className="group flex items-center justify-between rounded-xl bg-white/[0.02] p-4 text-left ring-1 ring-white/5 transition-all hover:ring-accent-purple/30">
                <div>
                  <div className="text-sm font-semibold">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
                <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-white opacity-70 group-hover:opacity-100"><Play className="size-4" /></div>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Voice check" icon={Mic}>
          <div className="rounded-xl bg-accent-purple/10 p-6 text-center ring-1 ring-accent-purple/30">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full gradient-primary text-white glow-purple animate-pulse-glow">
              <Mic className="size-6" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Click to test mic</p>
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}
