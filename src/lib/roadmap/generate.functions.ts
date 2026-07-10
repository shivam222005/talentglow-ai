import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createGateway } from "@/lib/ai-gateway.server";

const WeekSchema = z.object({
  week: z.string(),
  title: z.string(),
  focus: z.string(),
  tasks: z.array(z.string()).default([]),
});
type Week = z.infer<typeof WeekSchema>;

export const generateRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      goal: z.string().min(3).max(200),
      weeks: z.number().int().min(2).max(16).default(6),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Pull the user's latest signals for personalization.
    const [{ data: ats }, { data: gh }, { data: skills }] = await Promise.all([
      supabase.from("ats_reports").select("hard_skills,missing_skills,weaknesses").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("github_reports").select("top_languages,ai_insights").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("skill_scores").select("*").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const context_str = JSON.stringify({
      goal: data.goal,
      hard_skills: ats?.hard_skills ?? [],
      missing_skills: ats?.missing_skills ?? [],
      weaknesses: ats?.weaknesses ?? [],
      languages: gh?.top_languages ?? [],
      skills: skills ?? null,
    });

    const gateway = createGateway();
    const model = gateway("google/gemini-2.5-flash");
    const prompt = `You are a senior engineering mentor. Build a ${data.weeks}-week personalized learning roadmap.

USER CONTEXT (JSON):
${context_str}

Output STRICT JSON, no prose, no code fences. Shape:
{"weeks":[{"week":"Week 1","title":"...","focus":"one sentence","tasks":["...","...","..."]}]}
Rules:
- Exactly ${data.weeks} weeks.
- Each week has 3-5 concrete tasks (verbs, measurable).
- Prioritize the user's weakest/missing skills first, build up to the goal.
- No filler weeks. Real resources allowed (LeetCode, System Design Primer, etc.).`;

    const { text } = await generateText({ model, prompt });
    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    let parsed: { weeks: Week[] };
    try {
      const raw = JSON.parse(cleaned);
      parsed = { weeks: z.array(WeekSchema).parse(raw.weeks) };
    } catch {
      throw new Error("AI returned malformed roadmap. Please retry.");
    }

    const { data: row, error } = await supabase
      .from("learning_roadmaps")
      .insert({
        user_id: userId,
        title: data.goal.slice(0, 120),
        goal: data.goal,
        weeks: parsed.weeks,
        progress: {},
      })
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });

export const listRoadmaps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("learning_roadmaps")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const toggleRoadmapTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      key: z.string().min(1).max(200),
      done: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("learning_roadmaps")
      .select("progress")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();
    const progress = { ...(row?.progress as Record<string, boolean> ?? {}) };
    if (data.done) progress[data.key] = true; else delete progress[data.key];
    const { error } = await supabase
      .from("learning_roadmaps")
      .update({ progress })
      .eq("id", data.id)
      .eq("user_id", userId);
    if (error) throw error;
    return { ok: true, progress };
  });

export const deleteRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("learning_roadmaps")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
