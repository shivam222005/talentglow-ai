import { createFileRoute, Link } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Search } from "lucide-react";
import meeting from "@/assets/meeting-darmel.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listCandidates, type Candidate } from "@/lib/recruiter/candidates.functions";

export const Route = createFileRoute("/_authenticated/recruiter/candidates")({
  ssr: false,
  head: () => ({ meta: [{ title: "Candidate Search — DevScan AI" }] }),
  component: CandidatesPage,
});

function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState(0);
  const fn = useServerFn(listCandidates);
  const { data, isLoading, error } = useQuery({
    queryKey: ["recruiter-candidates", search, minScore],
    queryFn: () => fn({ data: { search, minScore, limit: 50 } }),
  });

  const candidates: Candidate[] = data?.candidates ?? [];
  const isDemo = data?.is_demo;

  return (
    <FeaturePage
      role="recruiter"
      eyebrow="Candidate Search"
      title="Find your next hire."
      description="Search verified developer profiles ranked by real work — resume, GitHub, and project signals."
      image={meeting.url}
      stats={[
        { label: "Available", value: String(candidates.length) },
        { label: "Top-tier", value: String(candidates.filter((c) => c.composite >= 85).length) },
        { label: "Avg score", value: candidates.length ? String(Math.round(candidates.reduce((a, c) => a + c.composite, 0) / candidates.length)) : "—" },
      ]}
    >
      {isDemo && (
        <div className="mb-4 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-4 py-2 text-xs text-accent-purple">
          Showing demo candidates — no students have completed their analysis yet.
        </div>
      )}
      <Card>
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, headline, or GitHub..."
              className="w-full rounded-lg bg-white/5 px-9 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
            />
          </div>
          {[0, 70, 80, 85, 90].map((s) => (
            <button
              key={s}
              onClick={() => setMinScore(s)}
              className={`rounded-lg px-3 py-2 text-xs font-medium ring-1 ring-white/10 ${minScore === s ? "bg-accent-purple/15 text-accent-purple" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}
            >
              {s === 0 ? "All" : `${s}+`}
            </button>
          ))}
        </div>
      </Card>
      <Card title={isLoading ? "Loading..." : `Results (${candidates.length})`}>
        {error && <div className="text-sm text-red-400">{(error as Error).message}</div>}
        <div className="divide-y divide-white/5">
          {candidates.map((c) => (
            <div key={c.id} className="grid grid-cols-12 items-center gap-3 py-3 text-sm">
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                  {c.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="font-semibold">{c.full_name}</div>
                  <div className="text-xs text-muted-foreground">{c.headline ?? "—"}</div>
                </div>
              </div>
              <div className="col-span-4 text-xs text-muted-foreground">
                {c.github ? `@${c.github.username} · ★ ${c.github.total_stars} · ${c.github.public_repos} repos` : "No GitHub linked"}
              </div>
              <div className="col-span-1 text-right text-base font-bold text-accent-purple">{c.composite || "—"}</div>
              <div className="col-span-2 text-right">
                <Link
                  to="/recruiter/compare"
                  search={{ ids: c.id }}
                  className="rounded-md bg-accent-purple/15 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/30"
                >
                  View / compare
                </Link>
              </div>
            </div>
          ))}
          {!isLoading && candidates.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No candidates match your filters.</div>
          )}
        </div>
      </Card>
    </FeaturePage>
  );
}
