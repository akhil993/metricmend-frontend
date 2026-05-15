import Link from "next/link";
import MetricMendLogo from "../shared/MetricMendLogo";
import MiraAnimatedPreview from "./MiraAnimatedPreview";
import MetricMendAdminNavLink from "./MetricMendAdminNavLink";


type StatCardProps = {
  value: string;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101422]/70 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-200/20 hover:bg-white/[0.06]">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
    </div>
  );
}

type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] p-6 text-left backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200/20">
      <p className="text-sm font-medium text-cyan-200/70">{step}</p>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
    </div>
  );
}

type TrustCardProps = {
  title: string;
  description: string;
};

function TrustCard({ title, description }: TrustCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#070810]/60 p-5 transition hover:border-emerald-200/20 hover:bg-white/[0.04]">
      <div className="mb-4 h-2 w-2 rounded-full bg-emerald-300" />
      <p className="font-medium text-neutral-200">{title}</p>
      <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
    </div>
  );
}

/* ================= PAGE ================= */

export default function HomePage() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#070810] text-white">
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300" />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_10%,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.10),transparent_32%),linear-gradient(180deg,#070810_0%,#0b1020_42%,#070810_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.16]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6">
        {/* NAV */}
        <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-[#070810]/90 via-[#070810]/60 to-transparent py-5 backdrop-blur-2xl">
          <MetricMendLogo />

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 text-sm text-neutral-400 backdrop-blur md:flex">
            <a href="#platform" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Platform
            </a>
            <a href="#mira" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Mira
            </a>
            <a href="#why" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Why
            </a>
            <a href="#security" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
              Trust
            </a>
          </div>

          <div className="flex items-center gap-3">
            <MetricMendAdminNavLink />
            <Link
              href="/login"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-4 py-2 text-sm font-medium text-[#070810] transition hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section
          id="platform"
          className="flex min-h-[calc(100vh-80px)] items-center pt-12 pb-20"
        >
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-sm backdrop-blur">
              Governed AI analytics for teams that cannot afford wrong answers
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Ask your business data questions. Get governed answers instantly.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
              MetricMend turns semantic models, approved metrics, role-based
              access, and{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text font-semibold text-transparent">
                Mira
              </span>{" "}
              into one decision intelligence layer for trusted analytics.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-6 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
              >
                Sign up
              </Link>

              <a
                href="#mira"
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-center text-sm font-semibold text-neutral-300 transition duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                Watch Mira think
              </a>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8 text-left">
              <StatCard value="Semantic" label="model first" />
              <StatCard value="Secure" label="OLS + RLS" />
              <StatCard value="Mira" label="AI analyst" />
            </div>
          </div>
        </section>

        {/* INTERACTIVE MIRA PREVIEW */}
        <section
          id="mira"
          className="-mt-2 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
              Interactive preview
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Try Mira’s thinking flow, one step at a time.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-neutral-400">
              Click each preview prompt in order to see how Mira moves from a
              business question to a chart, then diagnosis, recommendation, and
              action plan.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl">
            <MiraAnimatedPreview />
          </div>
        </section>

        {/* WHY */}
        <section
          id="why"
          className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] px-6 py-16 shadow-2xl backdrop-blur-xl md:px-10"
        >
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">
              Why MetricMend
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              Most AI analytics tools answer fast. MetricMend answers with
              context, governance, and trust.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              title="Semantic model first"
              description="Mira only answers through modeled facts, dimensions, relationships, and approved metric definitions."
            />

            <FeatureCard
              title="Security built into the answer"
              description="Role access, OLS, RLS, and SQL guardrails are part of the query path, not an afterthought."
            />

            <FeatureCard
              title="AI that improves the model"
              description="When Mira creates complex metrics, they are saved separately with provenance and routed for review."
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
            How it works
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            Connect data. Define meaning. Ask Mira.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <StepCard
              step="01"
              title="Connect your data platform"
              description="Connect warehouses and lakehouse platforms while keeping the frontend separate from backend services."
            />

            <StepCard
              step="02"
              title="Build the semantic model"
              description="Define facts, dimensions, relationships, base metrics, and time-intelligence logic once."
            />

            <StepCard
              step="03"
              title="Ask governed questions"
              description="Mira turns business questions into secured SQL, trusted data, charts, insights, and next-step analysis."
            />
          </div>
        </section>

        {/* TRUST */}
        <section
          id="security"
          className="grid gap-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-8 shadow-2xl backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr] md:p-10"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">
              Built for governance
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              AI analytics should respect your data model, not bypass it.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TrustCard
              title="Semantic model validation"
              description="Every answer starts from modeled facts, dimensions, and relationships."
            />

            <TrustCard
              title="Metric lineage"
              description="Metrics stay traceable whether approved, adhoc, or generated by Mira."
            />

            <TrustCard
              title="Role-aware access"
              description="Admins, builders, members, executives, and viewers see only what they should."
            />

            <TrustCard
              title="SQL guardrails"
              description="Unsafe SQL patterns are blocked before execution."
            />
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-28 text-center">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 ... px-10 py-14">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
              Early access
            </p>

            <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              The future of BI is{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                governed
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                explainable
              </span>
              , and{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                AI-native
              </span>
              .
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-neutral-400 leading-7">
              It is a governed AI layer that understands metrics, protects data,
              explains answers, and helps teams move faster.
            </p>

            <Link
              href="/signup"
              className="mt-10 inline-flex rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-7 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            >
              Sign up
            </Link>
          </div>
        </section>

        <footer className="grid gap-4 border-t border-white/10 py-6 text-sm text-neutral-500 md:grid-cols-3">
          <p className="font-medium text-neutral-400">MetricMend</p>

          <p className="md:text-center">
            AI decision intelligence layer for governed analytics.
          </p>

          <p className="md:text-right">
            © 2026 MetricMend. All rights reserved.
          </p>
        </footer>
      </section>
    </main>
  );
}