import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { CheckCircle2, Circle, Loader2, Sparkles, Trash2 } from "lucide-react";
import team from "@/assets/team-meeting.asset.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { deleteRoadmap, generateRoadmap, listRoadmaps, toggleRoadmapTask } from "@/lib/roadmap/generate.functions";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/roadmap")({
  head: () => ({ meta: [{ title: "Learning Roadmap — DevScan AI" }] }),
  component: RoadmapPage,
});

type Week = { week: string; title: string; focus: string; tasks: string[] };
type Roadmap = { id: string; title: string; goal: string; weeks: Week[]; progress: Record<string, boolean>; created_at: string };

function RoadmapPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listRoadmaps);
  const genFn = useServerFn(generateRoadmap);
  const toggleFn = useServerFn(toggleRoadmapTask);
  const delFn = useServerFn(deleteRoadmap);

  const { data: roadmaps = [] as Roadmap[], isLoading } = useQuery<Roadmap[]>({
    queryKey: ["roadmaps"],
    queryFn: () => listFn() as Promise<Roadmap[]>,
  });

  const [goal, setGoal] = useState("");
  const [weeks, setWeeks] = useState(6);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const current = useMemo(
    () => roadmaps.find((r) => r.id === selectedId) ?? roadmaps[0],
    [roadmaps, selectedId],
  );

  const gen = useMutation({
    mutationFn: () => genFn({ data: { goal, weeks } }),
    onSuccess: (row: any) => {
      toast.success("Roadmap generated");
      setGoal("");
      setSelectedId(row.id);
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
    },
    onError: (e: Error) => toast.error(e.message || "Generation failed"),
  });

  const toggle = useMutation({
    mutationFn: (p: { id: string; key: string; done: boolean }) => toggleFn({ data: p }),
    onMutate: async ({ id, key, done }) => {
      await qc.cancelQueries({ queryKey: ["roadmaps"] });
      const prev = qc.getQueryData<Roadmap[]>(["roadmaps"]);
      qc.setQueryData<Roadmap[]>(["roadmaps"], (list) =>
        (list ?? []).map((r) => r.id === id ? { ...r, progress: { ...r.progress, [key]: done } } : r),
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(["roadmaps"], ctx.prev); },
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["roadmaps"] });
    },
  });

  const totalTasks = current?.weeks.reduce((a, w) => a + w.tasks.length, 0) ?? 0;
  const doneTasks = current ? Object.values(current.progress ?? {}).filter(Boolean).length : 0;

  return (
    <FeaturePage
      role="student"
      eyebrow="Learning Roadmap"
      title="A personalized path to interview-ready."
      description="AI-generated from your resume, GitHub, and skill gaps — evolves as you check off tasks."
      image={team.url}
      stats={[
        { label: "Roadmaps", value: String(roadmaps.length) },
        { label: "Completed", value: `${doneTasks}/${totalTasks || 0}` },
        { label: "Weeks", value: String(current?.weeks.length ?? 0) },
      ]}
    >
      <Card>
        <form onSubmit={(e) => { e.preventDefault(); if (goal.trim()) gen.mutate(); }} className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            required
            minLength={3}
            placeholder="e.g. Land a senior backend role at a FAANG"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent-purple"
          />
          <select
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
          >
            {[4, 6, 8, 12].map((w) => <option key={w} value={w}>{w} weeks</option>)}
          </select>
          <button
            type="submit"
            disabled={gen.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {gen.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {gen.isPending ? "Generating…" : "Generate"}
          </button>
        </form>
      </Card>

      {roadmaps.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {roadmaps.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(r.id)}
              className={`rounded-full border px-3 py-1 text-xs ${current?.id === r.id ? "border-accent-purple text-accent-purple" : "border-border text-muted-foreground"}`}
            >
              {r.title}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <Card><p className="text-sm text-muted-foreground">Loading your roadmaps…</p></Card>
      ) : !current ? (
        <Card><p className="text-sm text-muted-foreground">No roadmap yet. Enter a goal above to generate your first one.</p></Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-accent-purple">Goal</div>
              <div className="mt-1 text-sm">{current.goal}</div>
            </div>
            <button
              onClick={() => del.mutate(current.id)}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3" /> Delete
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {current.weeks.map((w, wi) => (
              <Card key={wi} title={w.title} subtitle={w.week}>
                <p className="text-xs text-muted-foreground">{w.focus}</p>
                <ul className="mt-3 space-y-2">
                  {w.tasks.map((t, ti) => {
                    const key = `${wi}:${ti}`;
                    const done = !!current.progress?.[key];
                    return (
                      <li key={ti}>
                        <button
                          onClick={() => toggle.mutate({ id: current.id, key, done: !done })}
                          className="flex w-full items-start gap-2 text-left text-xs"
                        >
                          {done
                            ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent-green" />
                            : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
                          <span className={done ? "text-muted-foreground line-through" : ""}>{t}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </FeaturePage>
  );
}
