import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/shell";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpRight, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listCandidates, getRecruiterAnalytics } from "@/lib/recruiter/candidates.functions";

export const Route = createFileRoute("/_authenticated/recruiter")({
  ssr: false,
  head: () => ({ meta: [{ title: "Recruiter Dashboard — DevScan AI" }] }),
  component: RecruiterDashboard,
});

const BLUE = "oklch(0.68 0.18 250)";

function RecruiterDashboard() {
  const listFn = useServerFn(listCandidates);
  const anFn = useServerFn(getRecruiterAnalytics);
  const list = useQuery({ queryKey: ["rec-top"], queryFn: () => listFn({ data: { limit: 10 } }) });
  const an = useQuery({ queryKey: ["rec-an"], queryFn: () => anFn({}) });

  const candidates = list.data?.candidates ?? [];
  const top = candidates.slice(0, 6);

  return (
    <DashboardShell role="recruiter">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">Recruiter</span>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Candidate intelligence</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {an.data?.total ?? 0} profiles · {an.data?.top ?? 0} top-tier
          </p>
        </div>
        <Link to="/recruiter/reports" className="flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-white glow-purple">
          Export shortlist <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {(list.data?.is_demo || an.data?.is_demo) && (
        <div className="mt-4 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-4 py-2 text-xs text-accent-purple">
          Demo data shown — real students will appear here as they run analyses.
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { l: "Total candidates", v: String(an.data?.total ?? 0) },
          { l: "Avg composite", v: String(an.data?.avg ?? 0) },
          { l: "Top-tier ≥85", v: String(an.data?.top ?? 0) },
          { l: "In view", v: String(candidates.length) },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl glass p-5 ring-1 ring-white/5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-2 text-3xl font-bold">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl glass p-5 ring-1 ring-white/5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search candidates..." className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" onClick={(e) => (e.target as HTMLInputElement).blur()} />
          </div>
          <Link to="/recruiter/candidates" className="rounded-lg bg-accent-purple/15 px-3 py-2 text-xs font-medium text-accent-purple ring-1 ring-accent-purple/30">
            Open full search →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl glass ring-1 ring-white/5 lg:col-span-2">
          <div className="border-b border-white/5 p-5">
            <h3 className="text-sm font-semibold">Top candidates</h3>
            <p className="text-xs text-muted-foreground">Ranked by composite score</p>
          </div>
          <div className="divide-y divide-white/5">
            {top.map((c, i) => (
              <div key={c.id} className="grid grid-cols-12 items-center gap-3 px-5 py-3 text-sm">
                <div className="col-span-1 font-mono text-xs text-muted-foreground">#{i + 1}</div>
                <div className="col-span-6 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                    {c.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{c.full_name}</div>
                    <div className="text-xs text-muted-foreground">{c.headline ?? "—"}</div>
                  </div>
                </div>
                <div className="col-span-3 text-xs text-muted-foreground">
                  {c.github ? `★ ${c.github.total_stars}` : "—"}
                </div>
                <div className="col-span-2 text-right text-lg font-bold text-accent-purple">{c.composite}</div>
              </div>
            ))}
            {top.length === 0 && !list.isLoading && (
              <div className="p-8 text-center text-sm text-muted-foreground">No candidates yet.</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl glass p-5 ring-1 ring-white/5">
          <h3 className="text-sm font-semibold">Score distribution</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={an.data?.dist ?? []}>
                <XAxis dataKey="b" stroke="oklch(0.5 0.01 285)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide allowDecimals={false} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="c" fill={BLUE} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
