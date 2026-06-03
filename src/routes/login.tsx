import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Mail, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — DevScan AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_295/0.2),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-20 -z-10 size-72 rounded-full bg-[radial-gradient(circle,oklch(0.68_0.18_250/0.25),transparent_70%)] blur-3xl" />

      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="size-7 rounded-md gradient-primary glow-purple" />
          <span className="text-base font-bold">DevScan AI</span>
        </Link>

        <div className="rounded-2xl glass-strong p-8 ring-1 ring-white/10">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your developer intelligence workspace.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-colors hover:bg-white/10">
              <Github className="size-4" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2.5 text-sm font-medium ring-1 ring-white/10 transition-colors hover:bg-white/10">
              <Mail className="size-4" /> Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/5" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/dashboard" }); }}
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5 w-full rounded-lg bg-white/5 px-3 py-2.5 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={show ? "text" : "password"} required value={pw} onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-white/5 px-3 py-2.5 pr-10 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/50"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="size-3.5 rounded bg-white/5" /> Remember me
              </label>
              <a href="#" className="text-accent-purple hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="w-full rounded-lg gradient-primary py-2.5 text-sm font-semibold text-white glow-purple transition-transform hover:scale-[1.01]">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-accent-purple hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
