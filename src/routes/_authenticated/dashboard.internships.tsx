import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { GraduationCap } from "lucide-react";
import team from "@/assets/team-meeting.asset.json";

export const Route = createFileRoute("/_authenticated/dashboard/internships")({
  head: () => ({ meta: [{ title: "Internships — DevScan AI" }] }),
  component: InternsPage,
});

const interns = [
  { c: "OpenAI", r: "Software Eng Intern", l: "SF · Summer 2026", s: "$10–12K/mo", m: 94 },
  { c: "Anthropic", r: "Research Eng Intern", l: "SF · Summer 2026", s: "$11K/mo", m: 92 },
  { c: "Databricks", r: "Backend Intern", l: "Remote", s: "$8K/mo", m: 89 },
  { c: "Notion", r: "Frontend Intern", l: "NYC", s: "$8K/mo", m: 87 },
];

function InternsPage() {
  return (
    <FeaturePage
      role="student"
      eyebrow="Internships"
      title="Top internships, instantly matched."
      description="Summer + winter cycles. We auto-fill applications and track every deadline."
      image={team.url}
      stats={[{ label: "Open", value: "184" }, { label: "Matched", value: "23" }, { label: "Deadlines", value: "5 wks" }]}
    >
      <Card title="Curated internships">
        <div className="divide-y divide-white/5">
          {interns.map((j) => (
            <div key={j.c + j.r} className="grid grid-cols-12 items-center gap-3 py-4 text-sm">
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent-green/15 text-accent-green ring-1 ring-accent-green/30"><GraduationCap className="size-4" /></div>
                <div>
                  <div className="font-semibold">{j.c}</div>
                  <div className="text-xs text-muted-foreground">{j.r}</div>
                </div>
              </div>
              <div className="col-span-3 text-xs text-muted-foreground">{j.l}</div>
              <div className="col-span-2 text-xs">{j.s}</div>
              <div className="col-span-2 text-right">
                <div className="font-mono text-xs text-accent-purple">{j.m}% match</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </FeaturePage>
  );
}
