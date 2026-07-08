import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createGateway } from "@/lib/ai-gateway.server";

export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      targetJob: z.string().min(10).max(4000),
      baseResumeText: z.string().optional(),
      template: z.string().default("modern"),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const gateway = createGateway();
    const model = gateway("google/gemini-2.5-flash");
    const prompt = `Write a tailored one-page resume in clean Markdown for this target job:

TARGET JOB:
${data.targetJob}

${data.baseResumeText ? `EXISTING RESUME CONTEXT (stay truthful to this):\n${data.baseResumeText.slice(0, 8000)}` : "No existing resume provided — invent a plausible senior candidate profile."}

Format:
# Full Name
Contact line (email · phone · city)

## Summary
2 lines.

## Experience
### Role · Company · Dates
- Bullet with a quantified metric.
- Bullet with a quantified metric.

## Projects
### Project Name — one-line tag
- Bullet.

## Skills
Comma-separated.

## Education
Degree · School · Year.

Use strong action verbs. Every experience bullet must contain a metric. No filler. Return ONLY the markdown, no code fences.`;

    const { text } = await generateText({ model, prompt });
    const cleaned = text.replace(/^```(?:markdown)?\n?|\n?```$/g, "").trim();

    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("generated_resumes")
      .insert({
        user_id: userId,
        target_job: data.targetJob,
        template: data.template,
        content_markdown: cleaned,
      })
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });
