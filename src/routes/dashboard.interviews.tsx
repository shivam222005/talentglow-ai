import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import meeting from "@/assets/meeting-darmel.asset.json";

export const Route = createFileRoute("/dashboard/interviews")({
  head: () => ({ meta: [{ title: "Interview Tracker — DevScan AI" }] }),
  component: InterviewsPage,
});

const lanes = [
  { name: "Applied", color: "bg-white/10", items: [{ c: "Notion", r: "Frontend L3" }, { c: "Linear", r: "Full-stack" }, { c: "Figma", r: "Eng Intern" }] },
  { name: "Phone screen", color: "bg-accent-blue/30", items: [{ c: "Stripe", r: "Backend L4" }] },
  { name: "Onsite", color: "bg-accent-purple/30", items: [{ c: "Vercel", r: "Full-stack" }, { c: "Cloudflare", r: "Systems" }] },
  { name: "Offer", color: "bg-accent-green/30", items: [{ c: "Supabase", r: "DX Eng" }] },
];

function InterviewsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Interview Tracker"
      title="Your pipeline, in one view."
      description="Kanban of every application — synced with email parsing so nothing slips through."
      image={meeting.url}
      stats={[{ label: "Active", value: "7" }, { label: "Onsite", value: "2" }, { label: "Offers", value: "1" }]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {lanes.map((l) => (
          <Card key={l.name}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">{l.name}</span>
              <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${l.color}`}>{l.items.length}</span>
            </div>
            <div className="space-y-2">
              {l.items.map((i) => (
                <div key={i.c + i.r} className="rounded-lg bg-white/[0.02] p-3 ring-1 ring-white/5">
                  <div className="text-sm font-semibold">{i.c}</div>
                  <div className="text-xs text-muted-foreground">{i.r}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </FeaturePage>
  );
}
