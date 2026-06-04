import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage, Card } from "@/components/dashboard/page-scaffold";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import aiHiring from "@/assets/ai-hiring.asset.json";

export const Route = createFileRoute("/dashboard/assistant")({
  head: () => ({ meta: [{ title: "AI Career Assistant — DevScan AI" }] }),
  component: AssistantPage,
});

type Msg = { from: "you" | "ai"; text: string };

function AssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Hi Alex — I've got your full profile loaded. Ask me anything: career direction, salary negotiation, what to learn next." },
  ]);
  const [v, setV] = useState("");
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.trim()) return;
    setMsgs((m) => [...m, { from: "you", text: v }, { from: "ai", text: "Given your strong Frontend score (92) and weaker DevOps (65), I'd recommend targeting Full-stack Senior roles at growth-stage startups — companies like Vercel, Linear, and Supabase weight your strengths heavily. Want me to draft a 6-week prep plan?" }]);
    setV("");
  };
  return (
    <FeaturePage
      role="student"
      eyebrow="AI Career Assistant"
      title="Your 24/7 career copilot."
      description="Trained on millions of hiring outcomes. Knows your profile inside out."
      image={aiHiring.url}
    >
      <Card icon={Sparkles} title="Conversation">
        <div className="space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "you" ? "justify-end" : ""}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "you" ? "gradient-primary text-white" : "bg-white/5 ring-1 ring-white/10"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="mt-5 flex gap-2">
          <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Ask anything..." className="flex-1 rounded-lg bg-white/5 px-4 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
          <button className="flex size-10 items-center justify-center rounded-lg gradient-primary text-white glow-purple"><Send className="size-4" /></button>
        </form>
      </Card>
    </FeaturePage>
  );
}
