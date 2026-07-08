import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createGateway } from "@/lib/ai-gateway.server";

const AnalysisSchema = z.object({
  ats_score: z.number().min(0).max(100),
  grammar_score: z.number().min(0).max(100),
  keyword_match: z.number().min(0).max(100),
  hard_skills: z.array(z.string()),
  soft_skills: z.array(z.string()),
  missing_skills: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  summary: z.string(),
});

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ resumeId: z.string().uuid(), text: z.string().min(20), targetRole: z.string().optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const gateway = createGateway({ structuredOutputs: false });
    const model = gateway("google/gemini-2.5-flash");
    const prompt = `You are a senior technical recruiter and ATS grader. Analyze this resume${
      data.targetRole ? ` for a "${data.targetRole}" role` : ""
    } and return strict JSON matching the schema.

Score 0-100 for each of ats_score, grammar_score, keyword_match.
Extract 6-15 hard_skills and 3-8 soft_skills actually present in the text.
List 5-10 missing_skills that top candidates for this role would have.
Give 3-5 concrete strengths and 3-5 concrete weaknesses.
Give 4-6 actionable suggestions (imperative voice, ≤ 20 words each).
summary = 1-2 sentences.

Resume:
"""
${data.text.slice(0, 12000)}
"""`;

    let analysis: z.infer<typeof AnalysisSchema>;
    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: AnalysisSchema }),
        prompt,
      });
      analysis = output;
    } catch (e) {
      if (NoObjectGeneratedError.isInstance(e)) {
        // Fallback attempt at parsing
        try {
          const cleaned = e.text?.replace(/```json|```/g, "").trim() ?? "{}";
          analysis = AnalysisSchema.parse(JSON.parse(cleaned));
        } catch {
          throw new Error("AI failed to produce a structured report. Try again.");
        }
      } else {
        throw e;
      }
    }

    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("ats_reports")
      .insert({
        user_id: userId,
        resume_id: data.resumeId,
        ats_score: Math.round(analysis.ats_score),
        grammar_score: Math.round(analysis.grammar_score),
        keyword_match: Math.round(analysis.keyword_match),
        hard_skills: analysis.hard_skills,
        soft_skills: analysis.soft_skills,
        missing_skills: analysis.missing_skills,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        summary: analysis.summary,
      })
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });

export const saveResumeMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      fileName: z.string(),
      filePath: z.string(),
      mimeType: z.string().optional(),
      sizeBytes: z.number().optional(),
      extractedText: z.string(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("resumes")
      .insert({
        user_id: userId,
        file_name: data.fileName,
        file_path: data.filePath,
        mime_type: data.mimeType,
        size_bytes: data.sizeBytes,
        extracted_text: data.extractedText,
      })
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });

export const getLatestReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("ats_reports")
      .select("*, resumes(file_name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  });
