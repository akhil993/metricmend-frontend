"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import MetricMendLogo from "@/components/shared/MetricMendLogo";
import { createClient } from "@/lib/supabase/client";

export default function FounderLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/internal/metricmend/founder");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fffaf3_0%,#ffe8d1_48%,#fff4ec_100%)] px-5 py-8 text-[#211a17]">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col">
        <div className="flex items-center justify-between">
          <Link href="/" className="rounded-full bg-[#211a17] px-3 py-2">
            <MetricMendLogo variant="inverse" />
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-[#efd9ca] bg-white/70 px-4 py-2 text-sm font-semibold text-[#211a17] backdrop-blur-xl"
          >
            Standard login
          </Link>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_420px]">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#5c4b43] shadow-sm backdrop-blur-xl">
              <ShieldCheck className="h-4 w-4 text-[#ff6a2a]" />
              Founder-only access
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Private founder view for MetricMend operations.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#6f5f55]">
              This sign-in opens an aggregate-only founder console. It avoids raw
              customer data, connector credentials, user message text, and
              personal customer records.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
              <PrivacyNote
                icon={EyeOff}
                title="Privacy-aware"
                body="Designed for operating signals, not raw customer inspection."
              />
              <PrivacyNote
                icon={LockKeyhole}
                title="Role gated"
                body="Requires Supabase auth plus an active founder internal role."
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/80 bg-white/78 p-6 shadow-[0_24px_80px_rgba(80,56,104,0.14)] backdrop-blur-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Founder login
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6f5f55]">
              Use a MetricMend account with an active founder internal role.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field
                label="Founder email"
                icon={Mail}
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="founder@metricmend.com"
                autoComplete="email"
              />

              <Field
                label="Password"
                icon={LockKeyhole}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Your founder password"
                autoComplete="current-password"
              />

              {message ? (
                <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-6 text-orange-800">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#211a17] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(33,26,23,0.18)] transition hover:bg-[#35231c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    Open founder view
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function PrivacyNote({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof EyeOff;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/70 p-4 backdrop-blur-xl">
      <Icon className="h-5 w-5 text-[#ff6a2a]" />
      <h3 className="mt-3 text-sm font-semibold text-[#211a17]">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-[#6f5f55]">{body}</p>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  icon: typeof Mail;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#5c4b43]">{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-2xl border border-[#efd9ca] bg-white/85 px-3 py-3 transition focus-within:border-[#ff6a2a] focus-within:ring-4 focus-within:ring-orange-100">
        <Icon className="h-4 w-4 text-[#8a6f60]" />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          autoComplete={autoComplete}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#211a17] outline-none placeholder:text-[#9f8d82]"
          placeholder={placeholder}
        />
      </span>
    </label>
  );
}
