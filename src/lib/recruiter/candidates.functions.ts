import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type Candidate = {
  id: string;
  full_name: string;
  headline: string | null;
  avatar_url: string | null;
  composite: number;
  skills: {
    frontend: number; backend: number; dsa: number; system_design: number;
    database: number; devops: number; ai_ml: number; cloud: number;
  } | null;
  strongest: string | null;
  weakest: string | null;
  github: { username: string; total_stars: number; public_repos: number; quality_score: number | null } | null;
  project_count: number;
  is_demo?: boolean;
};

const DEMO: Candidate[] = [
  { id: "demo-1", full_name: "Alex Rivera", headline: "Full-stack engineer · MIT '26", avatar_url: null, composite: 92,
    skills: { frontend: 94, backend: 90, dsa: 88, system_design: 85, database: 82, devops: 74, ai_ml: 70, cloud: 86 },
    strongest: "frontend", weakest: "ai_ml",
    github: { username: "alexrivera", total_stars: 412, public_repos: 38, quality_score: 88 }, project_count: 7, is_demo: true },
  { id: "demo-2", full_name: "Maya Singh", headline: "Backend engineer · Stanford '25", avatar_url: null, composite: 89,
    skills: { frontend: 70, backend: 95, dsa: 92, system_design: 90, database: 91, devops: 86, ai_ml: 65, cloud: 88 },
    strongest: "backend", weakest: "ai_ml",
    github: { username: "mayasingh", total_stars: 620, public_repos: 42, quality_score: 92 }, project_count: 9, is_demo: true },
  { id: "demo-3", full_name: "Liam Chen", headline: "ML engineer · CMU '26", avatar_url: null, composite: 86,
    skills: { frontend: 62, backend: 78, dsa: 90, system_design: 74, database: 76, devops: 65, ai_ml: 96, cloud: 82 },
    strongest: "ai_ml", weakest: "devops",
    github: { username: "liamchen", total_stars: 305, public_repos: 24, quality_score: 84 }, project_count: 5, is_demo: true },
  { id: "demo-4", full_name: "Sara Diaz", headline: "Frontend engineer · Berkeley '26", avatar_url: null, composite: 82,
    skills: { frontend: 96, backend: 68, dsa: 78, system_design: 70, database: 66, devops: 60, ai_ml: 62, cloud: 72 },
    strongest: "frontend", weakest: "devops",
    github: { username: "saradiaz", total_stars: 210, public_repos: 30, quality_score: 80 }, project_count: 6, is_demo: true },
  { id: "demo-5", full_name: "Tom Park", headline: "DevOps · GaTech '25", avatar_url: null, composite: 78,
    skills: { frontend: 55, backend: 80, dsa: 74, system_design: 82, database: 76, devops: 95, ai_ml: 58, cloud: 92 },
    strongest: "devops", weakest: "ai_ml",
    github: { username: "tompark", total_stars: 178, public_repos: 22, quality_score: 78 }, project_count: 4, is_demo: true },
  { id: "demo-6", full_name: "Nina Brooks", headline: "Full-stack · UT Austin '26", avatar_url: null, composite: 75,
    skills: { frontend: 82, backend: 78, dsa: 70, system_design: 66, database: 72, devops: 62, ai_ml: 60, cloud: 70 },
    strongest: "frontend", weakest: "ai_ml",
    github: { username: "ninabrooks", total_stars: 96, public_repos: 18, quality_score: 74 }, project_count: 3, is_demo: true },
];

async function ensureRecruiter(supabase: any, userId: string) {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (!data || data.role !== "recruiter") {
    throw new Error("Recruiter access required. Update your profile role to 'recruiter'.");
  }
}

const ListInput = z.object({
  search: z.string().optional().default(""),
  minScore: z.number().min(0).max(100).optional().default(0),
  limit: z.number().min(1).max(100).optional().default(50),
});

export const listCandidates = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ListInput.parse(d ?? {}))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureRecruiter(supabase, userId);

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, full_name, headline, avatar_url, role")
      .eq("role", "student")
      .limit(data.limit);
    if (error) throw error;
    if (!profiles || profiles.length === 0) return { candidates: DEMO, is_demo: true };

    const ids = profiles.map((p: any) => p.id);
    const [{ data: skills }, { data: ghs }, { data: projs }] = await Promise.all([
      supabase.from("skill_scores").select("*").in("user_id", ids),
      supabase.from("github_reports").select("user_id, username, total_stars, public_repos, quality_score, created_at").in("user_id", ids).order("created_at", { ascending: false }),
      supabase.from("project_reports").select("user_id").in("user_id", ids),
    ]);

    const skillMap = new Map<string, any>((skills ?? []).map((s: any) => [s.user_id, s]));
    const ghMap = new Map<string, any>();
    (ghs ?? []).forEach((g: any) => { if (!ghMap.has(g.user_id)) ghMap.set(g.user_id, g); });
    const projCount = new Map<string, number>();
    (projs ?? []).forEach((p: any) => projCount.set(p.user_id, (projCount.get(p.user_id) ?? 0) + 1));

    let candidates: Candidate[] = profiles.map((p: any) => {
      const s = skillMap.get(p.id);
      const g = ghMap.get(p.id);
      return {
        id: p.id,
        full_name: p.full_name ?? "Anonymous",
        headline: p.headline,
        avatar_url: p.avatar_url,
        composite: s?.composite ?? 0,
        skills: s ? { frontend: s.frontend, backend: s.backend, dsa: s.dsa, system_design: s.system_design, database: s.database, devops: s.devops, ai_ml: s.ai_ml, cloud: s.cloud } : null,
        strongest: s?.strongest ?? null,
        weakest: s?.weakest ?? null,
        github: g ? { username: g.username, total_stars: g.total_stars ?? 0, public_repos: g.public_repos ?? 0, quality_score: g.quality_score } : null,
        project_count: projCount.get(p.id) ?? 0,
      };
    });

    if (data.search) {
      const q = data.search.toLowerCase();
      candidates = candidates.filter((c) =>
        c.full_name.toLowerCase().includes(q) ||
        (c.headline ?? "").toLowerCase().includes(q) ||
        (c.github?.username ?? "").toLowerCase().includes(q)
      );
    }
    if (data.minScore > 0) candidates = candidates.filter((c) => c.composite >= data.minScore);

    candidates.sort((a, b) => b.composite - a.composite);
    if (candidates.length === 0) return { candidates: DEMO, is_demo: true };
    return { candidates, is_demo: false };
  });

export const getCandidatesByIds = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ ids: z.array(z.string()).min(1).max(4) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureRecruiter(supabase, userId);
    const demoIds = data.ids.filter((i) => i.startsWith("demo-"));
    const realIds = data.ids.filter((i) => !i.startsWith("demo-"));
    const demos = DEMO.filter((d) => demoIds.includes(d.id));
    if (realIds.length === 0) return demos;

    const { data: profiles } = await supabase.from("profiles").select("id, full_name, headline, avatar_url").in("id", realIds);
    const { data: skills } = await supabase.from("skill_scores").select("*").in("user_id", realIds);
    const { data: ghs } = await supabase.from("github_reports").select("*").in("user_id", realIds).order("created_at", { ascending: false });
    const skillMap = new Map((skills ?? []).map((s: any) => [s.user_id, s]));
    const ghMap = new Map<string, any>();
    (ghs ?? []).forEach((g: any) => { if (!ghMap.has(g.user_id)) ghMap.set(g.user_id, g); });

    const real: Candidate[] = (profiles ?? []).map((p: any) => {
      const s: any = skillMap.get(p.id);
      const g = ghMap.get(p.id);
      return {
        id: p.id, full_name: p.full_name ?? "Anonymous", headline: p.headline, avatar_url: p.avatar_url,
        composite: s?.composite ?? 0,
        skills: s ? { frontend: s.frontend, backend: s.backend, dsa: s.dsa, system_design: s.system_design, database: s.database, devops: s.devops, ai_ml: s.ai_ml, cloud: s.cloud } : null,
        strongest: s?.strongest ?? null, weakest: s?.weakest ?? null,
        github: g ? { username: g.username, total_stars: g.total_stars ?? 0, public_repos: g.public_repos ?? 0, quality_score: g.quality_score } : null,
        project_count: 0,
      };
    });
    return [...demos, ...real];
  });

export const getRecruiterAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await ensureRecruiter(supabase, userId);
    const { data: skills } = await supabase.from("skill_scores").select("composite, updated_at");
    const rows = skills ?? [];
    const isDemo = rows.length === 0;
    const source = isDemo ? DEMO.map((d) => ({ composite: d.composite, updated_at: new Date().toISOString() })) : rows;

    const buckets = ["60-65","65-70","70-75","75-80","80-85","85-90","90+"];
    const dist = buckets.map((b) => ({ b, c: 0 }));
    source.forEach((r: any) => {
      const c = r.composite ?? 0;
      let idx = -1;
      if (c >= 90) idx = 6; else if (c >= 85) idx = 5; else if (c >= 80) idx = 4;
      else if (c >= 75) idx = 3; else if (c >= 70) idx = 2; else if (c >= 65) idx = 1;
      else if (c >= 60) idx = 0;
      if (idx >= 0) dist[idx].c += 1;
    });

    const avg = source.length ? Math.round(source.reduce((a: number, r: any) => a + (r.composite ?? 0), 0) / source.length) : 0;
    const top = source.filter((r: any) => (r.composite ?? 0) >= 85).length;

    return { dist, total: source.length, avg, top, is_demo: isDemo };
  });
