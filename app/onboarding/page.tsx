"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Sparkles } from "lucide-react";

import MetricMendLogo from "@/components/shared/MetricMendLogo";
import { createCompanyWorkspace } from "@/lib/api/workspaces";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCompanyName = companyName.trim();

    if (!trimmedCompanyName) {
      setError("Company name is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      await createCompanyWorkspace({
        companyName: trimmedCompanyName,
        workspaceName: "Launchpad",
      });

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070810] px-6 py-10 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.22),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.14),transparent_30%),linear-gradient(180deg,#070810_0%,#0b1020_45%,#070810_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <MetricMendLogo variant="inverse" />

            <div className="mt-10 inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              Launchpad setup
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Start with your MetricMend Launchpad.
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-neutral-400">
              Your Launchpad is your personal sandbox for models, metrics,
              Mira chats, and experimentation. You can create shared workspaces
              later when your team is ready.
            </p>

            <div className="mt-8 grid max-w-xl gap-3">
              {[
                "Creates your company tenant",
                "Creates your default Launchpad",
                "Starts your free trial with 50 Mira credits",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-neutral-300"
                >
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 text-[#070810]">
              <Building2 className="h-6 w-6" />
            </div>

            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
              Get started
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Create your company
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-400">
              We’ll automatically create your Launchpad and make you the owner.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm text-neutral-400">
                  Company name
                </label>

                <input
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  required
                  placeholder="Acme Analytics"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#070810] px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-cyan-300/50"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 hover:shadow-[0_0_30px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Launchpad..." : "Create Launchpad"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
