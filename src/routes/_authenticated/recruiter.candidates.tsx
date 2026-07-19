import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Search, Filter } from "lucide-react";
import meeting from "@/assets/meeting-darmel.asset.json";

export const Route = createFileRoute("/_authenticated/recruiter/candidates")({
  head: () => ({ meta: [{ title: "Candidate Search — DevScan AI" }] }),
  component: CandidatesPage,
});

const candidates = [
  { n: "Alex Rivera", role: "Full-stack", college: "MIT", grad: "2026", score: 92, stack: "TS · Node · Postgres" },
  { n: "Maya Singh", role: "Backend", college: "Stanford", grad: "2025", score: 89, stack: "Go · Kafka · gRPC" },
  { n: "Liam Chen", role: "ML Eng", college: "CMU", grad: "2026", score: 88, stack: "Python · PyTorch" },
  { n: "Sara Diaz", role: "Frontend", college: "Berkeley", grad: "2026", score: 82, stack: "React · Three.js" },
  { n: "Tom Park", role: "DevOps", college: "GaTech", grad: "2025", score: 78, stack: "Rust · K8s · Terraform" },
  { n: "Nina Brooks", role: "Full-stack", college: "UT Austin", grad: "2026", score: 75, stack: "Next · Prisma" },
];

function CandidatesPage() {
  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Candidate Search"
      title="Find your next hire in seconds."
      description="Search 2,481 verified developer profiles. Every score is grounded in real work."
      image={meeting.url}
      stats={[{ label: "Available", value: "2,481" }, { label: "Active", value: "1,204" }, { label: "Top-tier", value: "147" }]}
    >
      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search by name, skill, or stack..." className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
          </div>
          {["All roles","Full-stack","Backend","Frontend","ML","DevOps"].map((f, i) => (
            <button key={f} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-white/10 ${i === 0 ? "bg-accent-purple/15 text-accent-purple" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>
              <Filter className="size-3" /> {f}
            </button>
          ))}
        </div>
      </Card>
      <Card title="Results">
        <div className="divide-y divide-white/5">
          {candidates.map((c) => (
            <div key={c.n} className="grid grid-cols-12 items-center gap-3 py-3 text-sm">
              <div className="col-span-4 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">{c.n.split(" ").map((p) => p[0]).join("")}</div>
                <div>
                  <div className="font-semibold">{c.n}</div>
                  <div className="text-xs text-muted-foreground">{c.role} · {c.college} '{c.grad.slice(2)}</div>
                </div>
              </div>
              <div className="col-span-5 text-xs text-muted-foreground">{c.stack}</div>
              <div className="col-span-1 text-right text-base font-bold text-accent-purple">{c.score}</div>
              <div className="col-span-2 text-right">
                <button className="rounded-md bg-accent-purple/15 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/30">View profile</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </FeaturePage>
  );
}
