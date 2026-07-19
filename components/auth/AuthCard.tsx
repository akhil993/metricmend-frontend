"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import MetricMendLogo from "../shared/MetricMendLogo";

type AuthCardProps = {
  mode: "login" | "signup";
};

const trustItems = [
  "Governed metric definitions",
  "Workspace-level access",
  "Mira answers with context",
];

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
          "Account created. Check your email to confirm your account, then sign in."
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
    <main className="min-h-screen bg-[linear-gradient(135deg,#f5fbf7_0%,#e9f7ff_40%,#fff0df_100%)] text-[#102f36]">
      <div className="grid min-h-screen lg:grid-cols-[1.04fr_0.96fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image
            src="/portfolio/05-workspace-Overview.png"
            alt="MetricMend governed analytics workspace"
            fill
            priority
            className="object-cover object-left-top"
            sizes="52vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(216,247,239,0.92)_0%,rgba(230,237,255,0.82)_46%,rgba(255,231,214,0.68)_100%)]" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between px-10 py-8">
            <Link href="/" className="inline-flex w-fit rounded-full bg-[#0b2d34] px-3 py-2">
              <MetricMendLogo variant="inverse" />
            </Link>

            <div className="max-w-2xl pb-10">
              <p className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-[#31515b] shadow-sm backdrop-blur-xl">
                {isSignup ? "Start your workspace" : "Secure workspace access"}
              </p>

              <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-[#102f36]">
                {isSignup
                  ? "Build your trusted analytics layer beautifully."
                  : "Return to the workspace where your metrics make sense."}
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-[#31515b]">
                MetricMend brings connections, semantic models, certified
                metrics, and Mira into one clear product experience.
              </p>

              <div className="mt-8 grid max-w-xl gap-3">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-white/80 bg-white/70 px-4 py-3 text-sm font-semibold text-[#102f36] shadow-sm backdrop-blur-xl"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#0fa882]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between px-5 py-5 lg:hidden">
            <Link href="/" className="rounded-full bg-[#0b2d34] px-3 py-2">
              <MetricMendLogo variant="inverse" />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#0f8f72]">
                  MetricMend
                </p>
                <h2 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-[#102f36]">
                  {isSignup ? "Create your account." : "Welcome back."}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#557077]">
                  {isSignup
                    ? "Set up your account, then MetricMend will guide you through company and workspace setup."
                    : "Sign in to continue building models, managing metrics, and asking Mira governed questions."}
                </p>
              </div>

              <div className="rounded-lg border border-white/80 bg-white/78 p-6 shadow-[0_24px_80px_rgba(31,82,92,0.14)] backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#d8f7ef] text-[#075844]">
                    {isSignup ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <LockKeyhole className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#102f36]">
                      {isSignup ? "New workspace account" : "Workspace login"}
                    </p>
                    <p className="text-xs text-[#6b8389]">
                      {isSignup
                        ? "Free trial includes Mira credits"
                        : "Use your MetricMend credentials"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {isSignup ? (
                    <Field
                      label="Full name"
                      icon={UserRound}
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Jane Rivera"
                      autoComplete="name"
                    />
                  ) : null}

                  <Field
                    label="Work email"
                    icon={Mail}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />

                  <Field
                    label="Password"
                    icon={LockKeyhole}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Minimum 6 characters"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={6}
                  />

                  {message ? (
                    <div className="rounded-lg border border-[#f2c6a5] bg-[#fff4e8] px-4 py-3 text-sm leading-6 text-[#8c3d16]">
                      {message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0b2d34] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(11,45,52,0.18)] transition hover:bg-[#16444d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>
                        {isSignup ? "Create workspace account" : "Enter workspace"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 rounded-lg border border-[#cfe7e7] bg-[#f8fffc] p-4">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-[#0f8f72]" />
                    <p className="text-xs leading-5 text-[#557077]">
                      {isSignup
                        ? "Signup creates a customer workspace account only. MetricMend internal employee access is granted separately by an existing internal admin."
                        : "Your session opens MetricMend with workspace context, billing status, and Mira access ready."}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-center text-sm text-[#557077]">
                  {isSignup ? "Already have an account?" : "New to MetricMend?"}{" "}
                  <Link
                    href={isSignup ? "/login" : "/signup"}
                    className="font-semibold text-[#0f8f72] hover:text-[#075844]"
                  >
                    {isSignup ? "Sign in" : "Create account"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  minLength,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#31515b]">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-lg border border-[#cfe7e7] bg-white/85 px-3 py-3 transition focus-within:border-[#1ad7a8] focus-within:ring-4 focus-within:ring-[#d8f7ef]">
        <Icon className="h-4 w-4 text-[#6b8389]" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#102f36] outline-none placeholder:text-[#8ba0a5]"
          placeholder={placeholder}
        />
      </span>
    </label>
  );
}
