import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const ACTION_VERBS = [
  "built", "led", "shipped", "designed", "architected", "launched", "scaled",
  "optimized", "migrated", "reduced", "increased", "improved", "delivered",
  "owned", "mentored", "automated",
];

export default defineTool({
  name: "score_resume",
  title: "Score resume text",
  description:
    "Analyze pasted resume text and return a DevScan-style breakdown: ATS-friendliness, quantified impact, action verbs, and concrete improvement suggestions.",
  inputSchema: {
    text: z.string().trim().min(50).describe("Full resume text (plain text)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ text }) => {
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean).length;
    const bullets = (text.match(/^[\s]*[-•*]/gm) ?? []).length;
    const numbers = (text.match(/\b\d+(\.\d+)?%?\b/g) ?? []).length;
    const verbHits = ACTION_VERBS.filter((v) => lower.includes(v)).length;

    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
    const atsScore = clamp(60 + (bullets >= 8 ? 20 : bullets * 2) + (words > 300 ? 10 : 0));
    const impactScore = clamp(40 + numbers * 6);
    const verbScore = clamp(40 + verbHits * 6);
    const overall = clamp((atsScore + impactScore + verbScore) / 3);

    const suggestions: string[] = [];
    if (numbers < 4) suggestions.push("Add concrete metrics (%, $, users, latency) to at least 4 bullets.");
    if (verbHits < 4) suggestions.push("Start more bullets with strong action verbs (led, shipped, scaled, reduced).");
    if (bullets < 6) suggestions.push("Break long paragraphs into 6+ concise bullets — recruiters scan, not read.");
    if (words < 250) suggestions.push("Resume is short — expand experience bullets with context + result.");
    if (words > 900) suggestions.push("Resume is long — trim to 1 page for <5 YoE, 2 max otherwise.");

    const result = {
      overall,
      breakdown: { atsScore, impactScore, verbScore },
      signals: { wordCount: words, bulletCount: bullets, quantifiedMetrics: numbers, actionVerbsFound: verbHits },
      suggestions,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
