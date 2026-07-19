import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — DevScan AI" },
      { name: "description", content: "Set a new password for your DevScan AI account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase auto-consumes the recovery token from the URL hash and creates a session.
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setHasSession(true);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) return setError("Password must be at least 8 characters.");
    if (pw !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: pw });
      if (err) throw err;
      setDone(true);
      toast.success("Password updated. Redirecting…");
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lightui min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="size-8 rounded-xl gradient-blue shadow-lg shadow-blue-500/20" />
          <span className="text-base font-bold tracking-tight">DevScan AI</span>
        </Link>

        <div className="w-full rounded-2xl bg-white p-8 shadow-xl ring-1 ring-[oklch(0.9_0.015_250)]">
          {!ready ? (
            <div className="flex items-center justify-center py-10 text-[oklch(0.5_0.02_260)]">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : done ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
              <h1 className="mt-4 text-xl font-semibold">Password updated</h1>
              <p className="mt-2 text-sm text-[oklch(0.5_0.02_260)]">Redirecting to your dashboard…</p>
            </div>
          ) : !hasSession ? (
            <div className="text-center">
              <AlertCircle className="mx-auto size-10 text-amber-500" />
              <h1 className="mt-4 text-xl font-semibold">Invalid or expired link</h1>
              <p className="mt-2 text-sm text-[oklch(0.5_0.02_260)]">
                This password reset link is no longer valid. Please request a new one.
              </p>
              <Link
                to="/auth"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl gradient-blue px-5 text-sm font-semibold text-white"
              >
                Back to sign in <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
              <p className="mt-2 text-sm text-[oklch(0.5_0.02_260)]">
                Choose a strong password you haven't used before.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[oklch(0.35_0.02_260)]">New password</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      className="h-11 w-full rounded-xl bg-white px-4 pr-11 text-sm outline-none ring-1 ring-[oklch(0.9_0.015_250)] focus:ring-2 focus:ring-[oklch(0.62_0.18_260/0.45)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.55_0.02_260)]"
                    >
                      {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[oklch(0.35_0.02_260)]">Confirm password</label>
                  <input
                    type={show ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Repeat your new password"
                    className="h-11 w-full rounded-xl bg-white px-4 text-sm outline-none ring-1 ring-[oklch(0.9_0.015_250)] focus:ring-2 focus:ring-[oklch(0.62_0.18_260/0.45)]"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl gradient-blue text-sm font-semibold text-white shadow-lg shadow-blue-500/25 disabled:opacity-70"
                >
                  {loading ? <><Loader2 className="size-4 animate-spin" /> Updating…</> : <>Update password <ArrowRight className="size-4" /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
