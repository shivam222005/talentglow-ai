import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Github } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — DevScan AI" }] }),
  component: SignupPage,
});

type FormData = {
  name: string; email: string; password: string; confirm: string;
  github: string; college: string; branch: string; year: string;
};

const steps = [
  { title: "Your account", desc: "Basic information" },
  { title: "Security", desc: "Set a strong password" },
  { title: "Academic profile", desc: "Help us personalize your dashboard" },
];

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({
    name: "", email: "", password: "", confirm: "",
    github: "", college: "", branch: "", year: "",
  });
  const set = <K extends keyof FormData>(k: K, v: string) => setData((d) => ({ ...d, [k]: v }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const submit = () => navigate({ to: "/dashboard" });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_295/0.2),transparent_60%)] blur-3xl" />

      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="size-7 rounded-md gradient-primary glow-purple" />
          <span className="text-base font-bold">DevScan AI</span>
        </Link>

        <div className="rounded-2xl glass-strong p-8 ring-1 ring-white/10">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-1 items-center">
                <div className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  i < step ? "gradient-primary text-white" :
                  i === step ? "bg-accent-purple/20 text-accent-purple ring-2 ring-accent-purple/50" :
                  "bg-white/5 text-muted-foreground"
                }`}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`mx-2 h-px flex-1 ${i < step ? "bg-accent-purple" : "bg-white/10"}`} />
                )}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{steps[step].title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{steps[step].desc}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-4"
            >
              {step === 0 && (
                <>
                  <Field label="Full name" value={data.name} onChange={(v) => set("name", v)} placeholder="Alex Rivera" />
                  <Field label="Email" type="email" value={data.email} onChange={(v) => set("email", v)} placeholder="you@college.edu" />
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10">
                    <Github className="size-4" /> Sign up with GitHub
                  </button>
                </>
              )}
              {step === 1 && (
                <>
                  <Field label="Password" type="password" value={data.password} onChange={(v) => set("password", v)} placeholder="At least 8 characters" />
                  <Field label="Confirm password" type="password" value={data.confirm} onChange={(v) => set("confirm", v)} />
                  <Field label="GitHub URL" value={data.github} onChange={(v) => set("github", v)} placeholder="https://github.com/yourname" />
                </>
              )}
              {step === 2 && (
                <>
                  <Field label="College name" value={data.college} onChange={(v) => set("college", v)} placeholder="MIT" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Branch" value={data.branch} onChange={(v) => set("branch", v)} placeholder="CSE" />
                    <Field label="Graduation year" value={data.year} onChange={(v) => set("year", v)} placeholder="2026" />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={back} disabled={step === 0}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-white glow-purple">
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button onClick={submit} className="flex items-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-white glow-purple">
                Create account <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/login" className="text-accent-purple hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg bg-white/5 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/50"
      />
    </div>
  );
}
