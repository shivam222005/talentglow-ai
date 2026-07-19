import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Github, Mail, Check, ArrowRight, Sparkles, TrendingUp, GitBranch, Activity, Loader2, AlertCircle } from "lucide-react";
import authHero from "@/assets/auth-hero.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

type AuthSearch = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — DevScan AI" },
      { name: "description", content: "Sign in or create your DevScan AI account to unlock developer portfolio intelligence." },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup" | "forgot";

const REDIRECT_KEY = "devscan.postAuthRedirect";

function safeRedirect(target: string | undefined): string {
  if (!target) return "/dashboard";
  // Only allow same-origin relative paths.
  if (target.startsWith("/") && !target.startsWith("//")) return target;
  return "/dashboard";
}

function passwordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" }) as AuthSearch;
  const dest = safeRedirect(search.redirect);
  const [mode, setMode] = useState<Mode>("login");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const strength = useMemo(() => passwordStrength(pw), [pw]);

  // If already authenticated, send to intended dest
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: dest, replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: dest, replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, dest]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // FORGOT PASSWORD flow
    if (mode === "forgot") {
      setLoading(true);
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setInfo("If an account exists for that email, a reset link is on its way.");
        toast.success("Password reset email sent.");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Could not send reset email.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (strength < 2) {
        setError("Password is too weak. Use 8+ chars with letters, numbers, or symbols.");
        return;
      }
    } else if (pw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password: pw,
          options: {
            emailRedirectTo: `${window.location.origin}${dest}`,
            data: { full_name: name.trim() },
          },
        });
        if (err) throw err;
        toast.success("Account created. Welcome to DevScan AI!");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pw,
        });
        if (err) throw err;
        toast.success("Signed in successfully.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      const friendly = /invalid login credentials/i.test(msg)
        ? "Incorrect email or password."
        : /user already registered/i.test(msg)
          ? "An account with this email already exists. Try signing in instead."
          : /password.*(pwned|leaked|compromised)/i.test(msg)
            ? "This password has appeared in a data breach. Please choose another."
            : msg;
      setError(friendly);
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    setOauthLoading("google");
    try {
      // Remember destination across the OAuth round-trip.
      try { sessionStorage.setItem(REDIRECT_KEY, dest); } catch { /* ignore */ }
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
        extraParams: { prompt: "select_account" },
      });

      if (result.error) throw result.error;
      if (result.redirected) return;

      toast.success("Signed in with Google.");
      let target = dest;
      try {
        const saved = sessionStorage.getItem(REDIRECT_KEY);
        if (saved) target = safeRedirect(saved);
        sessionStorage.removeItem(REDIRECT_KEY);
      } catch { /* ignore */ }
      navigate({ to: target, replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(msg);
      toast.error(msg);
      setOauthLoading(null);
    }
  };

  const signInWithGithub = () => {
    const msg = "GitHub sign-in is not supported by this backend yet. Please use Google or email/password.";
    setError(msg);
    toast.error(msg);
  };

  return (
    <div className="lightui min-h-screen w-full">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ============ LEFT — Auth Forms ============ */}
        <div className="relative flex flex-col px-6 py-8 sm:px-12 lg:px-16">
          {/* soft background blooms */}
          <div className="pointer-events-none absolute -top-24 -left-24 -z-10 size-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.18_260/0.15),transparent_70%)] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 -z-10 size-[360px] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.16_290/0.12),transparent_70%)] blur-3xl" />

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-xl gradient-blue shadow-lg shadow-blue-500/20" />
            <span className="text-base font-bold tracking-tight">DevScan AI</span>
          </Link>

          {/* Form */}
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">
              {/* Mode toggle */}
              <div className="mb-8 inline-flex rounded-full bg-[oklch(0.94_0.01_250)] p-1 text-sm font-medium ring-1 ring-[oklch(0.88_0.015_250)]">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`relative rounded-full px-5 py-1.5 transition-colors ${mode === m ? "text-white" : "text-[oklch(0.45_0.02_260)] hover:text-[oklch(0.25_0.02_260)]"}`}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="mode-pill"
                        className="absolute inset-0 -z-0 rounded-full gradient-blue shadow-md shadow-blue-500/25"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{m === "login" ? "Sign in" : "Create account"}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
                    {mode === "login" ? "Welcome back." : mode === "signup" ? "Create your account." : "Reset your password."}
                  </h1>
                  <p className="mt-2 text-sm text-[oklch(0.5_0.02_260)]">
                    {mode === "login"
                      ? "Sign in to your developer intelligence workspace."
                      : mode === "signup"
                        ? "Free forever for students. No credit card required."
                        : "Enter your email and we'll send you a secure reset link."}
                  </p>

                  {mode !== "forgot" && (
                    <>
                      {/* OAuth */}
                      <div className="mt-7 grid grid-cols-2 gap-3">
                        <OauthButton
                          icon={oauthLoading === "google" ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon />}
                          label={oauthLoading === "google" ? "Google…" : "Google"}
                          onClick={signInWithGoogle}
                          disabled={Boolean(oauthLoading || loading)}
                        />
                        <OauthButton
                          icon={<Github className="size-4" />}
                          label="GitHub"
                          onClick={signInWithGithub}
                          disabled={Boolean(oauthLoading || loading)}
                        />
                      </div>

                      <div className="my-6 flex items-center gap-3 text-xs text-[oklch(0.55_0.02_260)]">
                        <div className="h-px flex-1 bg-[oklch(0.9_0.015_250)]" />
                        <span>or continue with email</span>
                        <div className="h-px flex-1 bg-[oklch(0.9_0.015_250)]" />
                      </div>
                    </>
                  )}

                  <form className={`space-y-4 ${mode === "forgot" ? "mt-7" : ""}`} onSubmit={submit}>
                    {mode === "signup" && (
                      <TextField
                        label="Full name"
                        value={name}
                        onChange={setName}
                        placeholder="Alex Rivera"
                        icon={<UserGlyph />}
                      />
                    )}
                    <TextField
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@college.edu"
                      icon={<Mail className="size-4 text-[oklch(0.55_0.02_260)]" />}
                    />
                    {mode !== "forgot" && (
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className="text-xs font-medium text-[oklch(0.35_0.02_260)]">Password</label>
                          {mode === "login" && (
                            <button
                              type="button"
                              onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}
                              className="text-xs font-medium text-[oklch(0.5_0.18_260)] hover:underline"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={show ? "text" : "password"}
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            required
                            placeholder={mode === "login" ? "••••••••" : "At least 8 characters"}
                            className="h-11 w-full rounded-xl bg-white px-4 pr-11 text-sm text-[oklch(0.2_0.02_260)] outline-none ring-1 ring-[oklch(0.9_0.015_250)] transition-all placeholder:text-[oklch(0.6_0.02_260)] focus:ring-2 focus:ring-[oklch(0.62_0.18_260/0.45)]"
                          />
                          <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0.02_260)] hover:text-[oklch(0.25_0.02_260)]"
                          >
                            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                          </button>
                        </div>
                        {mode === "signup" && pw.length > 0 && (
                          <PasswordMeter strength={strength} />
                        )}
                      </div>
                    )}

                    {mode === "login" && (
                      <label className="flex items-center gap-2 text-xs text-[oklch(0.45_0.02_260)]">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="size-4 rounded border-[oklch(0.85_0.02_250)] text-[oklch(0.55_0.18_260)] focus:ring-[oklch(0.62_0.18_260/0.4)]"
                        />
                        Remember me for 30 days
                      </label>
                    )}

                    {error && (
                      <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
                        <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    {info && (
                      <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 ring-1 ring-emerald-200">
                        <Check className="mt-0.5 size-3.5 shrink-0" />
                        <span>{info}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="group mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-blue text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          {mode === "login" ? "Signing in…" : mode === "signup" ? "Creating account…" : "Sending link…"}
                        </>
                      ) : (
                        <>
                          {mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    {mode === "forgot" && (
                      <button
                        type="button"
                        onClick={() => { setMode("login"); setError(null); setInfo(null); }}
                        className="w-full text-center text-xs font-medium text-[oklch(0.5_0.18_260)] hover:underline"
                      >
                        ← Back to sign in
                      </button>
                    )}

                    {mode === "signup" && (
                      <p className="text-center text-[11px] text-[oklch(0.55_0.02_260)]">
                        By signing up you agree to our{" "}
                        <a href="#" className="text-[oklch(0.5_0.18_260)] hover:underline">Terms</a>{" "}
                        and{" "}
                        <a href="#" className="text-[oklch(0.5_0.18_260)] hover:underline">Privacy Policy</a>.
                      </p>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>

              {mode !== "forgot" && (
                <p className="mt-8 text-center text-sm text-[oklch(0.45_0.02_260)]">
                  {mode === "login" ? "New to DevScan AI?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}
                    className="font-semibold text-[oklch(0.5_0.18_260)] hover:underline"
                  >
                    {mode === "login" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="text-center text-[11px] text-[oklch(0.55_0.02_260)]">
            © 2026 DevScan AI · <Link to="/about" className="hover:underline">About DevScan</Link>
          </div>
        </div>

        {/* ============ RIGHT — Image + Floating cards ============ */}
        <div className="relative hidden overflow-hidden bg-[oklch(0.96_0.01_255)] lg:block">
          {/* gradient washes */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[oklch(0.92_0.06_260/0.55)] via-transparent to-[oklch(0.92_0.08_290/0.45)]" />
          <img
            src={authHero.url}
            alt="Developers collaborating around a laptop"
            className="absolute inset-0 size-full object-cover opacity-95"
            width={1024}
            height={1280}
          />
          {/* soft overlay for legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[oklch(0.6_0.18_260/0.18)] via-transparent to-[oklch(0.7_0.16_290/0.18)]" />

          {/* Floating analytics cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute left-10 top-16 w-72"
          >
            <div className="animate-float-slow rounded-2xl light-glass p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg gradient-blue text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[oklch(0.25_0.02_260)]">AI Resume Score</div>
                    <div className="text-[10px] text-[oklch(0.5_0.02_260)]">Last analyzed 2m ago</div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">+12</span>
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-bold text-gradient-blue">94</span>
                <span className="pb-1 text-xs text-[oklch(0.5_0.02_260)]">/ 100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[oklch(0.92_0.015_250)]">
                <div className="h-full w-[94%] gradient-blue" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { l: "ATS", v: "98" },
                  { l: "Format", v: "92" },
                  { l: "Keywords", v: "89" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-white/70 py-1.5 ring-1 ring-[oklch(0.92_0.015_250)]">
                    <div className="text-sm font-bold text-[oklch(0.25_0.02_260)]">{s.v}</div>
                    <div className="text-[9px] uppercase tracking-wide text-[oklch(0.5_0.02_260)]">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute right-8 top-1/3 w-64"
          >
            <div className="animate-float-slow rounded-2xl light-glass p-5" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[oklch(0.25_0.02_260)]">GitHub Activity</span>
                <GitBranch className="size-3.5 text-[oklch(0.55_0.18_260)]" />
              </div>
              <div className="mt-3 grid grid-cols-12 gap-[3px]">
                {Array.from({ length: 60 }).map((_, i) => {
                  const opacities = [0.1, 0.25, 0.45, 0.7, 1];
                  const o = opacities[(i * 7) % 5];
                  return <div key={i} className="aspect-square rounded-[2px]" style={{ background: `oklch(0.6 0.18 260 / ${o})` }} />;
                })}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-[oklch(0.2_0.02_260)]">1,482</div>
                  <div className="text-[10px] text-[oklch(0.5_0.02_260)]">commits / year</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <TrendingUp className="size-3" /> 23%
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute bottom-12 left-12 w-80"
          >
            <div className="animate-float-slow rounded-2xl light-glass p-5" style={{ animationDelay: "3s" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-[oklch(0.55_0.18_260)]" />
                  <span className="text-xs font-semibold text-[oklch(0.25_0.02_260)]">Placement Readiness</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Interview-ready</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  { l: "Technical skills", v: 86, c: "from-blue-500 to-indigo-500" },
                  { l: "Project quality", v: 92, c: "from-indigo-500 to-violet-500" },
                  { l: "Communication", v: 74, c: "from-violet-500 to-purple-500" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="text-[oklch(0.4_0.02_260)]">{s.l}</span>
                      <span className="font-semibold text-[oklch(0.25_0.02_260)]">{s.v}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[oklch(0.92_0.015_250)]">
                      <div className={`h-full rounded-full bg-gradient-to-r ${s.c}`} style={{ width: `${s.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tag line */}
          <div className="absolute bottom-8 right-8 max-w-xs text-right">
            <div className="rounded-2xl bg-white/60 px-4 py-3 text-xs font-medium text-[oklch(0.3_0.02_260)] backdrop-blur-xl ring-1 ring-white/60">
              Trusted by <span className="font-bold">10M+ developers</span> across 500+ campuses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[oklch(0.35_0.02_260)]">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className={`h-11 w-full rounded-xl bg-white text-sm text-[oklch(0.2_0.02_260)] outline-none ring-1 ring-[oklch(0.9_0.015_250)] transition-all placeholder:text-[oklch(0.6_0.02_260)] focus:ring-2 focus:ring-[oklch(0.62_0.18_260/0.45)] ${icon ? "pl-10 pr-4" : "px-4"}`}
        />
      </div>
    </div>
  );
}

function PasswordMeter({ strength }: { strength: number }) {
  const labels = ["Too weak", "Weak", "Fair", "Strong", "Excellent"];
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-blue-500",
    "bg-emerald-500",
  ];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? colors[strength] : "bg-[oklch(0.92_0.015_250)]"}`}
          />
        ))}
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px]">
        <span className="text-[oklch(0.5_0.02_260)]">{labels[strength]}</span>
        {strength >= 3 && (
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <Check className="size-3" /> Good to go
          </span>
        )}
      </div>
    </div>
  );
}

function OauthButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-[oklch(0.25_0.02_260)] ring-1 ring-[oklch(0.9_0.015_250)] transition-all hover:bg-[oklch(0.97_0.005_250)] hover:ring-[oklch(0.8_0.04_260)]"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}

function UserGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 text-[oklch(0.55_0.02_260)]">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
