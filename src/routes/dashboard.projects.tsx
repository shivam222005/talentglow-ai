import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/dashboard/projects")({
  head: () => ({ meta: [{ title: "Project Analyzer — DevScan AI" }] }),
  component: ProjectsPage,
});

const projects = [
  { n: "realtime-chat-engine", q: 92, d: 84, i: 88, sc: 81, s: "TypeScript · WebSockets · Redis" },
  { n: "ml-feature-store", q: 88, d: 76, i: 82, sc: 79, s: "Python · Postgres · Kafka" },
  { n: "edge-cache", q: 84, d: 70, i: 78, sc: 88, s: "Go · LRU · Distributed" },
];

function ProjectsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Project Analyzer"
      title="Quality, not quantity."
      description="Each repo graded across code quality, documentation, innovation, and scalability — with concrete improvement actions."
      image={aiHiring.url}
      stats={[{ label: "Projects", value: "12" }, { label: "Avg quality", value: "84" }, { label: "Top score", value: "92" }]}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.n} title={p.n} subtitle={p.s}>
            <div className="space-y-3">
              <Progress label="Quality" value={p.q} />
              <Progress label="Documentation" value={p.d} accent="blue" />
              <Progress label="Innovation" value={p.i} accent="green" />
              <Progress label="Scalability" value={p.sc} />
            </div>
          </Card>
        ))}
      </div>
    </FeaturePage>
  );
}
