import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Sparkles, Download, Loader2 } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateResume } from "@/lib/resume/build.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard/resume-builder")({
  head: () => ({ meta: [{ title: "Resume Builder — DevScan AI" }] }),
  component: ResumeBuilder,
});

function ResumeBuilder() {
  const [job, setJob] = useState(
    "Senior Backend Engineer at Stripe. 5+ years Python, distributed systems, payment infra, gRPC, Kafka.",
  );
  const [markdown, setMarkdown] = useState<string>("");
  const run = useServerFn(generateResume);
  const gen = useMutation({
    mutationFn: async () => run({ data: { targetJob: job, template: "modern" } }),
    onSuccess: (r) => {
      setMarkdown(r.content_markdown);
      toast.success("Resume drafted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const download = (type: "txt" | "html") => {
    if (!markdown) return;
    const body = type === "html"
      ? `<!doctype html><html><head><meta charset=utf-8><title>Resume</title><style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:0 24px;color:#111;line-height:1.5}h1{margin:0 0 4px}h2{margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}h3{margin:12px 0 4px}ul{padding-left:20px}</style></head><body>${mdToHtml(markdown)}</body></html>`
      : markdown;
    const blob = new Blob([body], { type: type === "html" ? "text/html" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    if (!markdown) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><head><title>Resume</title><style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:0 24px;color:#111;line-height:1.5}h1{margin:0 0 4px}h2{margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:4px}h3{margin:12px 0 4px}ul{padding-left:20px}</style></head><body>${mdToHtml(markdown)}<script>window.onload=()=>window.print()</script></body></html>`,
    );
    w.document.close();
  };

  return (
    <FeaturePage
      role="student"
      eyebrow="Resume Builder"
      title="One target job. One perfect resume."
      description="Paste a job description — we rewrite every bullet to match while staying true to your experience."
      image={clipboard.url}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Target job" icon={Sparkles}>
          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            rows={10}
            className="w-full rounded-lg bg-white/5 p-3 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
          />
          <button
            onClick={() => gen.mutate()}
            disabled={gen.isPending || job.trim().length < 10}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg gradient-primary py-2.5 text-sm font-semibold text-white glow-purple disabled:opacity-50"
          >
            {gen.isPending ? <><Loader2 className="size-4 animate-spin" /> Generating…</> : "Rewrite resume"}
          </button>
        </Card>
        <Card title="AI-rewritten preview">
          <div className="max-h-[520px] overflow-auto rounded-xl bg-white p-5 text-sm leading-relaxed text-neutral-900 ring-1 ring-white/10">
            {markdown ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: mdToHtml(markdown) }} />
            ) : (
              <p className="text-neutral-500">Your generated resume will appear here.</p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={printPdf} disabled={!markdown} className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40">
              <Download className="size-4" /> PDF
            </button>
            <button onClick={() => download("html")} disabled={!markdown} className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40">
              <Download className="size-4" /> HTML
            </button>
            <button onClick={() => download("txt")} disabled={!markdown} className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2.5 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-40">
              <Download className="size-4" /> TXT
            </button>
          </div>
        </Card>
      </div>
    </FeaturePage>
  );
}

// Tiny markdown → HTML (headings, bullets, bold, paragraphs). Good enough for resume output.
function mdToHtml(md: string) {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  const flush = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    if (line.startsWith("### ")) { flush(); out.push(`<h3>${inline(line.slice(4))}</h3>`); continue; }
    if (line.startsWith("## ")) { flush(); out.push(`<h2>${inline(line.slice(3))}</h2>`); continue; }
    if (line.startsWith("# ")) { flush(); out.push(`<h1>${inline(line.slice(2))}</h1>`); continue; }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    flush();
    out.push(`<p>${inline(line)}</p>`);
  }
  flush();
  return out.join("\n");
  function inline(s: string) {
    return escape(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
  }
}
