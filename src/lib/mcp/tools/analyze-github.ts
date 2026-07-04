import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "analyze_github_profile",
  title: "Analyze GitHub profile",
  description:
    "Fetch public GitHub profile stats (repos, followers, top languages) for a username and return a compact summary suitable for recruiter screening.",
  inputSchema: {
    username: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-zA-Z0-9-]+$/, "GitHub usernames are alphanumeric with dashes")
      .describe("GitHub username to analyze (e.g. 'torvalds')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ username }) => {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!userRes.ok) {
      return {
        content: [{ type: "text", text: `GitHub user "${username}" not found (${userRes.status}).` }],
        isError: true,
      };
    }
    const user = (await userRes.json()) as {
      login: string;
      name: string | null;
      bio: string | null;
      public_repos: number;
      followers: number;
      following: number;
      created_at: string;
      html_url: string;
    };

    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    const repos = reposRes.ok
      ? ((await reposRes.json()) as Array<{ name: string; language: string | null; stargazers_count: number }>)
      : [];

    const langs = new Map<string, number>();
    let stars = 0;
    for (const r of repos) {
      stars += r.stargazers_count;
      if (r.language) langs.set(r.language, (langs.get(r.language) ?? 0) + 1);
    }
    const topLanguages = [...langs.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([l]) => l);
    const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);

    const summary = {
      login: user.login,
      name: user.name,
      bio: user.bio,
      url: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars: stars,
      topLanguages,
      topRepos: topRepos.map((r) => ({ name: r.name, stars: r.stargazers_count })),
      accountCreated: user.created_at,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
