"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MetricMendLogo from "../shared/MetricMendLogo";

type AuthCardProps = {
  mode: "login" | "signup";
};

export default function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const supabase = createClient();

  const isSignup = mode === "signup";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (isSignup) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    setMessage(error.message);
    setLoading(false);
    return;
  }

  if (!data.session) {
    setMessage(
      "Account created successfully. Please check your email and confirm your account before signing in."
    );
    setLoading(false);
    return;
  }

  router.push("/onboarding");
  return;
}

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/app");
  }

  return (
    <main className="min-h-screen bg-[#070810] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
        <div className="mb-8">
          <MetricMendLogo />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
            {isSignup ? "Create account" : "Welcome back"}
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {isSignup ? "Start building MetricMend." : "Sign in to MetricMend."}
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <div>
                <label className="text-sm text-neutral-400">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#070810] px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
                  placeholder="Full name"
                />
              </div>
            )}

            <div>
              <label className="text-sm text-neutral-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070810] px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#070810] px-4 py-3 text-white outline-none transition focus:border-cyan-300/50"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-400">
            {isSignup ? "Already have an account?" : "New to MetricMend?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-medium text-cyan-300 hover:text-cyan-200"
            >
              {isSignup ? "Login" : "Create account"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}