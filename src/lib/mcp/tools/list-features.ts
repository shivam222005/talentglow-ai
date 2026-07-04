import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const FEATURES = [
  { id: "resume", name: "Resume Analyzer", audience: "student", summary: "ATS + impact scoring with AI rewrites." },
  { id: "github", name: "GitHub Analytics", audience: "student", summary: "Commit heatmap, language mix, project quality signals." },
  { id: "skills", name: "Skill Radar", audience: "student", summary: "Multi-axis strength map across frontend, backend, DSA, systems." },
  { id: "projects", name: "Project Analyzer", audience: "student", summary: "Per-repo grading on quality, docs, innovation, scalability." },
  { id: "roadmap", name: "Learning Roadmap", audience: "student", summary: "Personalized week-by-week upskilling plan." },
  { id: "jobs", name: "Job Matches", audience: "student", summary: "Daily-refreshed matches ranked by composite fit score." },
  { id: "internships", name: "Internships", audience: "student", summary: "Auto-filled applications and deadline tracking." },
  { id: "resume-builder", name: "Resume Builder", audience: "student", summary: "One-target-job resume rewriting." },
  { id: "mock-interview", name: "Mock Interview", audience: "student", summary: "AI-driven voice interviews with rubric feedback." },
  { id: "interviews", name: "Interview Tracker", audience: "student", summary: "Kanban of every application, synced from email." },
  { id: "placement", name: "Placement Readiness", audience: "student", summary: "Composite hireability score from 7 signals." },
  { id: "assistant", name: "AI Career Assistant", audience: "student", summary: "24/7 career copilot trained on your full profile." },
  { id: "candidates", name: "Candidate Search", audience: "recruiter", summary: "Semantic search across analyzed developers." },
  { id: "ranking", name: "Candidate Ranking", audience: "recruiter", summary: "Rank candidates by role-specific criteria." },
  { id: "compare", name: "Candidate Compare", audience: "recruiter", summary: "Side-by-side comparison across scores." },
  { id: "analytics", name: "Talent Analytics", audience: "recruiter", summary: "Pipeline funnel and market benchmarks." },
  { id: "reports", name: "Recruiter Reports", audience: "recruiter", summary: "Shareable PDF reports on candidate shortlists." },
];

export default defineTool({
  name: "list_devscan_features",
  title: "List DevScan AI features",
  description:
    "List every feature available in DevScan AI, optionally filtered by audience ('student' or 'recruiter'), for orientation and capability discovery.",
  inputSchema: {
    audience: z
      .enum(["student", "recruiter", "all"])
      .default("all")
      .describe("Filter features by audience."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ audience }) => {
    const items = audience === "all" ? FEATURES : FEATURES.filter((f) => f.audience === audience);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { features: items },
    };
  },
});
