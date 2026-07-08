import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card, Progress } from "@/components/dashboard/page-scaffold";
import { Upload, FileText, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import clipboard from "@/assets/clipboard-handoff.asset.json";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { extractResumeText } from "@/lib/resume/parse-client";
import { analyzeResume, saveResumeMeta, getLatestReport } from "@/lib/resume/analyze.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/resume")({
  head: () => ({ meta: [{ title: "Resume Analyzer — DevScan AI" }] }),
  component: ResumePage,
});

function ResumePage() {
  const qc = useQueryClient();
  const fetchLatest = useServerFn(getLatestReport);
  const runAnalyze = useServerFn(analyzeResume);
  const runSave = useServerFn(saveResumeMeta);
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ["latest-ats"],
    queryFn: () => fetchLatest(),
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      setProgress("Extracting text…");
      const text = await extractResumeText(file);
      if (text.length < 50) throw new Error("Could not extract enough text from this file.");

      setProgress("Uploading to secure storage…");
      const { data: sess } = await supabase.auth.getUser();
      const uid = sess.user?.id;
      if (!uid) throw new Error("Sign in required.");
      const path = `${uid}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (upErr) throw upErr;

      setProgress("Saving resume…");
      const resume = await runSave({
        data: {
          fileName: file.name,
          filePath: path,
          mimeType: file.type,
          sizeBytes: file.size,
          extractedText: text,
        },
      });

      setProgress("Analyzing with AI…");
      const rep = await runAnalyze({ data: { resumeId: resume.id, text } });
      return rep;
    },
    onSuccess: () => {
      setProgress(null);
      toast.success("Analysis complete");
      qc.invalidateQueries({ queryKey: ["latest-ats"] });
    },
    onError: (e: Error) => {
      setProgress(null);
      toast.error(e.message);
    },
  });

  const busy = upload.isPending;
  const stats = report
    ? [
        { label: "ATS Score", value: String(report.ats_score) },
        { label: "Grammar", value: String(report.grammar_score) },
        { label: "Keywords", value: `${report.keyword_match}%` },
      ]
    : undefined;

  return (
    <FeaturePage
      role="student"
      eyebrow="Resume Analyzer"
      title="Your resume, X-rayed."
      description="Upload a PDF, DOCX or TXT — we extract skills, score ATS-readiness, and find every gap a recruiter would catch."
      image={clipboard.url}
      stats={stats}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Upload resume" subtitle="PDF · DOCX · TXT · up to 10MB" icon={Upload}>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload.mutate(f);
              e.target.value = "";
            }}
          />
          <div
            onClick={() => !busy && fileRef.current?.click()}
            className={`rounded-xl border-2 border-dashed border-white/10 p-8 text-center ${busy ? "opacity-60" : "cursor-pointer hover:border-accent-purple/40"}`}
          >
            {busy ? (
              <>
                <Loader2 className="mx-auto size-8 animate-spin text-accent-purple" />
                <p className="mt-3 text-sm">{progress ?? "Working…"}</p>
              </>
            ) : (
              <>
                <FileText className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 text-sm">Drop your resume here</p>
                <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                <button className="mt-4 rounded-lg gradient-primary px-4 py-2 text-xs font-semibold text-white glow-purple">
                  Choose file
                </button>
              </>
            )}
          </div>
        </Card>

        <Card title="Extracted skills" subtitle={report ? "From your latest analysis" : "Upload to see"} className="lg:col-span-2">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" /> Loading…</div>
          ) : report ? (
            <>
              <div className="flex flex-wrap gap-2">
                {(report.hard_skills as string[]).map((t) => (
                  <span key={t} className="rounded-full bg-accent-purple/10 px-3 py-1 text-xs text-accent-purple ring-1 ring-accent-purple/20">{t}</span>
                ))}
                {(report.soft_skills as string[]).map((t) => (
                  <span key={t} className="rounded-full bg-accent-blue/10 px-3 py-1 text-xs text-accent-blue ring-1 ring-accent-blue/20">{t}</span>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <Progress label="ATS score" value={report.ats_score} />
                <Progress label="Grammar" value={report.grammar_score} accent="blue" />
                <Progress label="Keyword match" value={report.keyword_match} accent="green" />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Upload a resume to see extracted skills and scores here.</p>
          )}
        </Card>

        <Card title="AI suggestions" subtitle="Priority fixes" icon={Sparkles} className="lg:col-span-3">
          {report ? (
            <>
              {report.summary && (
                <p className="mb-4 rounded-xl bg-white/[0.02] p-4 text-sm ring-1 ring-white/5">{report.summary}</p>
              )}
              <ul className="grid gap-3 md:grid-cols-2">
                {(report.suggestions as string[]).map((s, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                    <span className="font-mono text-xs text-accent-purple">0{i + 1}</span>
                    <span className="text-sm">{s}</span>
                  </li>
                ))}
              </ul>
              {(report.missing_skills as string[]).length > 0 && (
                <div className="mt-6">
                  <div className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">Missing skills to add</div>
                  <div className="flex flex-wrap gap-2">
                    {(report.missing_skills as string[]).map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs ring-1 ring-white/10">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-accent-green" /> Saved to your account · analyzed {new Date(report.created_at).toLocaleString()}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Suggestions appear here after your first upload.</p>
          )}
        </Card>
      </div>
    </FeaturePage>
  );
}
