import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  CheckCircle2,
  DatabaseZap,
  GitBranch,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import MetricMendLogo from "../shared/MetricMendLogo";
import MiraAnimatedPreview from "./MiraAnimatedPreview";

const journey = [
  {
    icon: DatabaseZap,
    label: "Connect",
    title: "Bring data in safely",
    body: "Connect warehouses and lakehouses through managed workspace flows while credentials stay protected on the backend.",
    color: "bg-[#ffe8d1] text-[#7a3414]",
  },
  {
    icon: Workflow,
    label: "Model",
    title: "Give metrics meaning",
    body: "Define facts, dimensions, relationships, time logic, and approved metrics once for the whole team.",
    color: "bg-[#fff4ec] text-[#8f3a17]",
  },
  {
    icon: Bot,
    label: "Ask",
    title: "Let Mira explain",
    body: "Ask business questions and get governed charts, drivers, follow-ups, and recommendations.",
    color: "bg-[#ffd7c2] text-[#a43f18]",
  },
];

const trustControls = [
  {
    icon: BadgeCheck,
    title: "Certified answers",
    body: "Promote trusted metrics and models through review before teams depend on them.",
  },
  {
    icon: GitBranch,
    title: "Visible lineage",
    body: "Trace how sources, models, metrics, deployments, and Mira responses connect.",
  },
  {
    icon: LockKeyhole,
    title: "Role-aware access",
    body: "Keep every workspace, model, and answer inside the right permission boundary.",
  },
  {
    icon: ShieldCheck,
    title: "Query guardrails",
    body: "Validate AI-generated SQL before it reaches governed data systems.",
  },
];

const showcaseScreens = [
  {
    src: "/portfolio/06-connections.png",
    label: "Connections",
    title: "Secure data source setup",
    tint: "bg-[#ffe8d1]",
  },
  {
    src: "/portfolio/08-model-diagram.png",
    label: "Semantic layer",
    title: "Facts, dimensions, and relationships",
    tint: "bg-[#fff4ec]",
  },
  {
    src: "/portfolio/09-mira-empty.png",
    label: "Mira",
    title: "Premium AI analyst workspace",
    tint: "bg-[#ffd7c2]",
  },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-[#5c4b43] transition hover:bg-white/80 hover:text-[#211a17]"
    >
      {children}
    </a>
  );
}

function JourneyStep({
  icon: Icon,
  label,
  title,
  body,
  color,
}: (typeof journey)[number]) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/78 p-5 shadow-[0_18px_60px_rgba(80,56,104,0.12)] backdrop-blur-xl">
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}>
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-[#211a17]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#6f5f55]">{body}</p>
    </div>
  );
}

function TrustControl({
  icon: Icon,
  title,
  body,
}: (typeof trustControls)[number]) {
  return (
    <div className="rounded-lg border border-[#f0d6c7] bg-[#fffaf3] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd7c2] text-[#a43f18]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-[#211a17]">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#6f5f55]">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#211a17]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#efd9ca] bg-[#fffaf3]/95 shadow-[0_10px_34px_rgba(80,56,104,0.08)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="rounded-full bg-[#211a17] px-3 py-2">
            <MetricMendLogo variant="inverse" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink href="#platform">Platform</NavLink>
            <NavLink href="#mira">Mira</NavLink>
            <NavLink href="#trust">Trust</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[#d7bba7] bg-white px-4 py-2 text-sm font-semibold text-[#211a17] shadow-sm transition hover:border-[#bd947a] hover:bg-[#fff8f1]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="hidden items-center justify-center gap-2 rounded-full bg-[#ff6a2a] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,111,97,0.28)] transition hover:bg-[#ff7c45] sm:inline-flex"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fffaf3_0%,#ffe8d1_24%,#eaf1ff_48%,#ffd7c2_74%,#fff1e6_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-12 text-center md:pt-20">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#5c4b43] shadow-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-[#ff6a2a]" />
            Governed AI analytics with a signature feel
          </p>

          <h1 className="mx-auto mt-7 max-w-5xl text-6xl font-semibold leading-[0.98] tracking-tight text-[#211a17] md:text-8xl">
            MetricMend
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-xl font-medium leading-8 text-[#5c4b43] md:text-2xl md:leading-9">
            A beautiful workspace where data teams connect sources, define
            trusted metrics, and ask Mira questions with governance built in.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a17] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(27,21,55,0.20)] transition hover:bg-[#35231c]"
            >
              Create your workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#efd9ca] bg-white/72 px-6 py-3 text-sm font-semibold text-[#211a17] backdrop-blur-xl transition hover:bg-white"
            >
              See product
              <BarChart3 className="h-4 w-4" />
            </a>
          </div>

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="rounded-lg border border-white/80 bg-white/58 p-3 shadow-[0_28px_90px_rgba(80,56,104,0.18)] backdrop-blur-2xl">
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#ffe8d1]">
                <Image
                  src="/portfolio/09-mira-empty.png"
                  alt="MetricMend Mira AI analyst workspace"
                  fill
                  priority
                  className="object-cover object-left-top"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#2368ff]">The product flow</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-[#211a17] md:text-6xl">
              One calm path from raw data to trusted answer.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#6f5f55]">
              MetricMend makes the operating model obvious: connect your data,
              model your business language, then let Mira answer inside those
              rules.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {journey.map((step) => (
              <JourneyStep key={step.label} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="bg-[#fff1e6] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-4 md:grid-cols-3">
            {showcaseScreens.map((screen) => (
              <div
                key={screen.label}
                className="overflow-hidden rounded-lg border border-white/80 bg-white/82 shadow-[0_18px_60px_rgba(80,56,104,0.12)] backdrop-blur-xl"
              >
                <div className={`relative aspect-[16/10] ${screen.tint}`}>
                  <Image
                    src={screen.src}
                    alt={`${screen.label} screenshot`}
                    fill
                    className="object-cover object-left-top"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f60]">
                    {screen.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#211a17]">
                    {screen.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mira" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold text-[#ff6a2a]">Mira AI analyst</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-[#211a17] md:text-6xl">
              Ask. Understand. Decide.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#6f5f55]">
              Mira turns governed models into answers people can read. It
              resolves metrics, builds safe SQL, visualizes results, explains
              drivers, and recommends the next move.
            </p>

            <div className="mt-7 grid gap-3">
              {[
                "Business-friendly summaries",
                "Charts connected to trusted metric definitions",
                "Driver analysis and suggested follow-up questions",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-[#5c4b43]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#2368ff]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#efd9ca] bg-[#211a17] p-3 shadow-[0_24px_90px_rgba(27,21,55,0.22)]">
            <MiraAnimatedPreview />
          </div>
        </div>
      </section>

      <section id="trust" className="bg-[#fff3e3] py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-[#b64a1b]">Enterprise trust</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-[#211a17] md:text-6xl">
                Governance you can see, not just promise.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#755948]">
                Every team sees where answers came from, which assets are
                certified, and whether Mira is operating inside approved
                boundaries.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trustControls.map((control) => (
                <TrustControl key={control.title} {...control} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 rounded-lg border border-[#efd9ca] bg-[linear-gradient(135deg,#ffe8d1_0%,#fff4ec_45%,#ffd7c2_100%)] p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-sm font-semibold text-[#2368ff]">Start beautifully</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-[#211a17]">
              Give your team an analytics workspace that feels clear from the
              first click.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5c4b43]">
              Create an account, set up a workspace, connect a source, and let
              Mira answer through trusted metrics.
            </p>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a17] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(27,21,55,0.18)] transition hover:bg-[#35231c]"
          >
            Create account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#efd9ca] bg-[#fffaf3]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 text-sm text-[#8a6f60] md:grid-cols-3">
          <p className="font-semibold text-[#211a17]">MetricMend</p>
          <p className="md:text-center">
            Governed AI analytics with a product experience people understand.
          </p>
          <p className="md:text-right">2026 MetricMend. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
