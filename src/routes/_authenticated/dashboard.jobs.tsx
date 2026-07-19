import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { MapPin, Building2 } from "lucide-react";
import hr from "@/assets/hr-handshake.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard/jobs")({
  head: () => ({ meta: [{ title: "Job Matches — DevScan AI" }] }),
  component: JobsPage,
});

const jobs = [
  { c: "Stripe", r: "Backend Engineer · L4", l: "Remote · US", s: "$180–240K", m: 96 },
  { c: "Vercel", r: "Full-stack Engineer", l: "Remote · Global", s: "$160–210K", m: 94 },
  { c: "Linear", r: "Product Engineer", l: "SF or Remote", s: "$170–220K", m: 92 },
  { c: "Supabase", r: "DX Engineer", l: "Remote", s: "$140–190K", m: 89 },
  { c: "Cloudflare", r: "Systems Engineer", l: "Austin", s: "$170–210K", m: 86 },
];

function JobsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Job Recommendations"
      title="Roles picked for your profile."
      description="Refreshed daily. Ranked by composite match score — skills + culture + comp fit."
      image={hr.url}
      stats={[{ label: "Matches", value: "47" }, { label: "≥90% match", value: "12" }, { label: "Avg comp", value: "$185K" }]}
    >
      <Card title="Top matches">
        <div className="divide-y divide-white/5">
          {jobs.map((j) => (
            <div key={j.c + j.r} className="grid grid-cols-12 items-center gap-3 py-4 text-sm">
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent-blue/15 text-accent-blue ring-1 ring-accent-blue/30"><Building2 className="size-4" /></div>
                <div>
                  <div className="font-semibold">{j.c}</div>
                  <div className="text-xs text-muted-foreground">{j.r}</div>
                </div>
              </div>
              <div className="col-span-3 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3" />{j.l}</div>
              <div className="col-span-2 text-xs">{j.s}</div>
              <div className="col-span-2 text-right">
                <div className="font-mono text-xs text-accent-purple">{j.m}% match</div>
                <button className="mt-1 rounded-md bg-accent-purple/15 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/30">Apply</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </FeaturePage>
  );
}
