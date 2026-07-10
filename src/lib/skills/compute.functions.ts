import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createGateway } from "@/lib/ai-gateway.server";

const SkillSchema = z.object({
  frontend: z.number().min(0).max(100),
  backend: z.number().min(0).max(100),
  dsa: z.number().min(0).max(100),
  system_design: z.number().min(0).max(100),
  database: z.number().min(0).max(100),
  devops: z.number().min(0).max(100),
  ai_ml: z.number().min(0).max(100),
  cloud: z.number().min(0).max(100),
});

export const computeSkills = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: ats }, { data: gh }] = await Promise.all([
      supabase.from("ats_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("github_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    if (!ats && !gh) throw new Error("Analyze a resume or GitHub profile first.");

    const context_text = `RESUME SKILLS: ${JSON.stringify(ats?.hard_skills ?? [])}
RESUME SUMMARY: ${ats?.summary ?? "n/a"}
GITHUB LANGUAGES: ${JSON.stringify(gh?.top_languages ?? [])}
GITHUB TOP REPOS: ${JSON.stringify(gh?.top_repos ?? [])}
GITHUB STARS: ${gh?.total_stars ?? 0}`;

    const gateway = createGateway();
    const model = gateway("google/gemini-2.5-flash");

    let scores: z.infer<typeof SkillSchema>;
    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: SkillSchema }),
        prompt: `Rate this candidate 0-100 on each of 8 skills based on the evidence. Be honest — most people score 40-75.
${context_text}
Return strict JSON.`,
      });
      scores = output;
    } catch (e) {
      if (NoObjectGeneratedError.isInstance(e)) {
        const cleaned = e.text?.replace(/```json|```/g, "").trim() ?? "{}";
        scores = SkillSchema.parse(JSON.parse(cleaned));
      } else throw e;
    }

    const entries = Object.entries(scores) as [keyof typeof scores, number][];
    const composite = Math.round(entries.reduce((a, [, v]) => a + v, 0) / entries.length);
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    const strongest = sorted[0][0];
    const weakest = sorted[sorted.length - 1][0];

    const { data: row, error } = await supabase
      .from("skill_scores")
      .upsert(
        {
          user_id: userId,
          ...scores,
          composite,
          strongest,
          weakest,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });

const DEMO_SKILLS = {
  id: "demo-skills",
  is_demo: true,
  user_id: "demo",
  frontend: 88,
  backend: 82,
  dsa: 74,
  system_design: 71,
  database: 78,
  devops: 62,
  ai_ml: 58,
  cloud: 76,
  composite: 74,
  strongest: "frontend",
  weakest: "ai_ml",
  updated_at: new Date().toISOString(),
};

export const getSkills = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase.from("skill_scores").select("*").eq("user_id", userId).maybeSingle();
    return data ?? DEMO_SKILLS;
  });
