import { defineMcp } from "@lovable.dev/mcp-js";
import analyzeGithubTool from "./tools/analyze-github";
import scoreResumeTool from "./tools/score-resume";
import listFeaturesTool from "./tools/list-features";

export default defineMcp({
  name: "devscan-ai-mcp",
  title: "DevScan AI",
  version: "0.1.0",
  instructions:
    "Tools for DevScan AI — developer portfolio intelligence. Use `analyze_github_profile` to summarize a GitHub user, `score_resume` to grade resume text, and `list_devscan_features` to discover platform capabilities.",
  tools: [analyzeGithubTool, scoreResumeTool, listFeaturesTool],
});
