import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import aiHiring from "@/assets/ai-hiring.asset.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Github, Sparkles } from "lucide-react";
import { analyzeGithub, getLatestGithub } from "@/lib/github/analyze.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/github")({
  head: () => ({ meta: [{ title: "GitHub Intelligence — DevScan AI" }] }),
  component: GitHubPage,
});

const BLUE = "oklch(0.68 0.18 250)";
const PURPLE = "oklch(0.7 0.22 295)";

function GitHubPage() {
  const qc = useQueryClient();
  const fetchLatest = useServerFn(getLatestGithub);
  const analyze = useServerFn(analyzeGithub);
  const { data: report } = useQuery({ queryKey: ["latest-github"], queryFn: () => fetchLatest() });
  const [username, setUsername] = useState("");

  const run = useMutation({
    mutationFn: async () => analyze({ data: { username } }),
    onSuccess: () => { toast.success("GitHub analyzed"); qc.invalidateQueries({ queryKey: ["latest-github"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = report
    ? [
        { label: "Repos", value: String(report.public_repos ?? 0) },
        { label: "Stars", value: String(report.total_stars ?? 0) },
        { label: "Quality", value: `${report.quality_score}` },
      ]
    : undefined;

  return (
    <FeaturePage
      role="student"
      eyebrow="GitHub Intelligence"
      title="Your public code, scored."
      description="We analyze commit cadence, language depth, repo quality, and collaboration signal across every public repo."
      image={aiHiring.url}
      stats={stats}
    >
      <Card title="Analyze a GitHub username" icon={Github} className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={report?.username ?? "github-username"}
            className="flex-1 rounded-lg bg-white/5 px-4 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
          />
          <button
            onClick={() => run.mutate()}
            disabled={run.isPending || username.trim().length < 1}
            className="flex items-center justify-center gap-2 rounded-lg gradient-primary px-6 py-2.5 text-sm font-semibold text-white glow-purple disabled:opacity-50"
          >
            {run.isPending ? <><Loader2 className="size-4 animate-spin" /> Analyzing…</> : "Analyze"}
          </button>
        </div>
      </Card>

      {!report ? (
        <Card><p className="text-sm text-muted-foreground">Enter a GitHub username above to generate your first report.</p></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Commit activity" subtitle="Last 12 months" className="lg:col-span-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(report.commit_activity as any[]) ?? []}>
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUE} stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="m" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.006 285)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="c" stroke={BLUE} fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Language footprint" subtitle="By repos">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(report.top_languages as any[]) ?? []} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="l" stroke="oklch(0.5 0.01 285)" fontSize={11} tickLine={false} axisLine={false} width={60} />
                  <Bar dataKey="v" fill={PURPLE} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="AI insights" subtitle={`@${report.username}`} icon={Sparkles} className="lg:col-span-3">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{report.ai_insights}</p>
          </Card>
          <Card title="Top repositories" className="lg:col-span-3">
            <div className="divide-y divide-white/5">
              {((report.top_repos as any[]) ?? []).map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between py-3 hover:opacity-80">
                  <div>
                    <div className="text-sm font-semibold">{r.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{r.language ?? "n/a"} · {r.description ?? ""}</div>
                  </div>
                  <div className="text-sm text-accent-purple">★ {r.stars}</div>
                </a>
              ))}
            </div>
          </Card>
        </div>
      )}
    </FeaturePage>
  );
}
