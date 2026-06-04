import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { CheckCircle2, Circle } from "lucide-react";
import team from "@/assets/team-meeting.asset.json";

export const Route = createFileRoute("/dashboard/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — DevScan AI" }] }),
  component: RoadmapPage,
});

const weeks = [
  { w: "Week 1", t: "Kubernetes Basics", d: "Pods, deployments, services", done: true },
  { w: "Week 2", t: "Distributed Systems", d: "CAP theorem, consensus, sharding", done: true },
  { w: "Week 3", t: "System Design Drills", d: "Design Twitter, Uber, Slack", done: false },
  { w: "Week 4", t: "Mock Interviews", d: "5 recorded sessions with rubric feedback", done: false },
  { w: "Week 5", t: "DSA Sprint", d: "30 medium / 10 hard LeetCode", done: false },
  { w: "Week 6", t: "Behavioral Prep", d: "STAR responses, leadership stories", done: false },
];

function RoadmapPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Learning Roadmap"
      title="A 6-week path to interview-ready."
      description="Auto-generated from your gaps — adjusts every week based on your progress."
      image={team.url}
      stats={[{ label: "Completed", value: "2/6" }, { label: "Hours / wk", value: "8" }, { label: "ETA", value: "Apr 18" }]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {weeks.map((w) => (
          <Card key={w.w}>
            <div className="flex items-start gap-3">
              {w.done ? <CheckCircle2 className="mt-0.5 size-5 text-accent-green" /> : <Circle className="mt-0.5 size-5 text-muted-foreground" />}
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent-purple">{w.w}</div>
                <div className="mt-1 text-sm font-semibold">{w.t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{w.d}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </FeaturePage>
  );
}
