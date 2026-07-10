import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText } from "ai";
import { z } from "zod";
import { createGateway } from "@/lib/ai-gateway.server";

// Parses "https://github.com/owner/repo" (with optional trailing bits) -> {owner, repo}.
function parseRepoUrl(url: string): { owner: string; repo: string } {
  const cleaned = url.trim().replace(/\.git$/, "").replace(/\/+$/, "");
  const m = cleaned.match(/github\.com[:/]([^/]+)\/([^/?#]+)/i);
  if (!m) throw new Error("Not a valid GitHub repository URL");
  return { owner: m[1], repo: m[2] };
}

const gh = (path: string) =>
  fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "DevScanAI" },
  });

export const analyzeRepo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ url: z.string().url().max(300) }).parse(d))
  .handler(async ({ data, context }) => {
    const { owner, repo } = parseRepoUrl(data.url);
    const repoRes = await gh(`/repos/${owner}/${repo}`);
    if (!repoRes.ok) {
      throw new Error(repoRes.status === 404 ? "Repository not found or private" : `GitHub error ${repoRes.status}`);
    }
    const info = await repoRes.json();

    const [languagesRes, readmeRes, contentsRes] = await Promise.all([
      gh(`/repos/${owner}/${repo}/languages`),
      gh(`/repos/${owner}/${repo}/readme`),
      gh(`/repos/${owner}/${repo}/contents/`),
    ]);
    const languages: Record<string, number> = languagesRes.ok ? await languagesRes.json() : {};
    let readme = "";
    if (readmeRes.ok) {
      const j = await readmeRes.json();
      try { readme = atob((j.content ?? "").replace(/\n/g, "")); } catch { readme = ""; }
    }
    const contents: Array<{ name: string; type: string }> = contentsRes.ok ? await contentsRes.json() : [];
    const fileNames = contents.map((c) => c.name);
    const has = (n: string) => fileNames.some((f) => f.toLowerCase() === n.toLowerCase());

    const signals = {
      hasReadme: readme.length > 0,
      readmeLen: readme.length,
      hasLicense: has("LICENSE") || has("LICENSE.md"),
      hasTests: fileNames.some((f) => /^(tests?|__tests__|spec)$/i.test(f)),
      hasCI: contents.some((c) => c.name === ".github"),
      hasDocker: has("Dockerfile") || has("docker-compose.yml"),
      hasContributing: has("CONTRIBUTING.md"),
      topLangs: Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([l]) => l),
    };

    // Heuristic scores 0-100
    const documentation = Math.min(100,
      (signals.hasReadme ? 40 : 0) +
      Math.min(30, Math.floor(signals.readmeLen / 80)) +
      (signals.hasContributing ? 15 : 0) +
      (signals.hasLicense ? 15 : 0),
    );
    const maintainability = Math.min(100,
      40 + (signals.hasTests ? 25 : 0) + (signals.hasCI ? 20 : 0) + (signals.hasLicense ? 15 : 0),
    );
    const scalability = Math.min(100,
      50 + (signals.hasDocker ? 20 : 0) + Math.min(20, (info.stargazers_count ?? 0) / 2) + (signals.topLangs.length >= 3 ? 10 : 0),
    );
    const security = Math.min(100,
      45 + (signals.hasCI ? 20 : 0) + (signals.hasLicense ? 15 : 0) + (info.has_issues ? 10 : 0) + (signals.hasDocker ? 10 : 0),
    );
    const innovation = Math.min(100,
      55 + Math.min(25, (info.stargazers_count ?? 0) / 3) + Math.min(20, (info.forks_count ?? 0)),
    );
    const quality = Math.round((documentation + maintainability + scalability + security + innovation) / 5);

    const gateway = createGateway();
    const model = gateway("google/gemini-2.5-flash");
    const readmeSnippet = readme.slice(0, 1500);
    const prompt = `Analyze this GitHub repo for a hiring/portfolio review. Output STRICT JSON, no prose, no code fences:
{"stack":"short comma-separated tech stack","suggestions":["...", "...", "..."]}

Repo: ${owner}/${repo}
Description: ${info.description ?? "n/a"}
Stars: ${info.stargazers_count} · Forks: ${info.forks_count} · Open issues: ${info.open_issues_count}
Top languages: ${signals.topLangs.join(", ") || "unknown"}
Signals: README=${signals.hasReadme}(${signals.readmeLen}c) LICENSE=${signals.hasLicense} TESTS=${signals.hasTests} CI=${signals.hasCI} DOCKER=${signals.hasDocker}
README excerpt:
${readmeSnippet}

Give 4-6 concrete, actionable suggestions (each <=140 chars) focused on documentation, architecture, testing, or portfolio impact.`;
    const { text } = await generateText({ model, prompt });
    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    let stack = signals.topLangs.join(", ");
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.stack === "string") stack = parsed.stack;
      if (Array.isArray(parsed.suggestions)) suggestions = parsed.suggestions.slice(0, 8).map(String);
    } catch { /* keep heuristic fallback */ }

    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("project_reports")
      .insert({
        user_id: userId,
        repo_name: `${owner}/${repo}`,
        repo_url: info.html_url,
        stack,
        quality,
        documentation,
        innovation,
        scalability,
        maintainability,
        security,
        suggestions,
      })
      .select("*")
      .single();
    if (error) throw error;
    return row;
  });

export const listRepoReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("project_reports")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    return data ?? [];
  });

export const deleteRepoReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("project_reports")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
