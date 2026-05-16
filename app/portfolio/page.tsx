"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function AkhilPortfolioSite() {
  const links = {
    github: "https://github.com/akhil993",
    linkedin: "https://www.linkedin.com/in/akhil-devabhakthuni-609684182/",
    product: "https://www.metricmendai.com",
  };
  const walkthroughSteps = [
  {
    title: "Landing Experience",
    image: "/portfolio/01-landing.png",
    description:
      "MetricMend introduces a decision intelligence layer designed to align teams on trusted metrics and insights.",
  },
  {
    title: "Secure Login",
    image: "/portfolio/02-login.png",
    description:
      "Secure access ensures only authorized users can enter governed analytics workspaces.",
  },
  {
    title: "Launchpad",
    image: "/portfolio/03-launchpad.png",
    description:
      "The launchpad gives users a central starting point for workspaces, models, and analytics workflows.",
  },
  {
    title: "Workspaces",
    image: "/portfolio/04-workspaces.png",
    description:
      "Workspaces organize analytics by business domain while keeping governance and access control in place.",
  },
  {
    title: "Workspace Overview",
    image: "/portfolio/05-workspace-overview.png",
    description:
      "Each workspace manages connections, semantic models, Mira access, and workspace settings.",
  },
  {
    title: "Data Connections",
    image: "/portfolio/06-connections.png",
    description:
      "Users can connect to cloud data platforms like AWS Athena as the foundation for governed analytics.",
  },
  {
    title: "Semantic Models",
    image: "/portfolio/07-semantic-models.png",
    description:
      "Semantic models define reusable business logic, metrics, and relationships.",
  },
  {
    title: "Model Diagram",
    image: "/portfolio/08-model-diagram.png",
    description:
      "The model diagram shows how facts and dimensions connect to create a trusted analytics layer.",
  },
  {
    title: "Mira Assistant",
    image: "/portfolio/09-mira-empty.png",
    description:
      "Mira lets users ask natural-language questions on top of governed semantic models.",
  },
  {
    title: "Revenue Insight",
    image: "/portfolio/10-mira-revenue.png",
    description:
      "Mira returns KPI-level summaries with visual and business-friendly explanations.",
  },
  {
    title: "Top Products",
    image: "/portfolio/11-mira-products.png",
    description:
      "Users can identify top revenue drivers and understand what is performing well.",
  },
  {
    title: "Low Performing Products",
    image: "/portfolio/12-mira-low-performing.png",
    description:
      "Mira helps surface optimization opportunities by highlighting underperforming products.",
  },
];
function ProductWalkthrough() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const active = walkthroughSteps[activeIndex];

  function nextStep() {
    setActiveIndex((prev) => (prev + 1) % walkthroughSteps.length);
  }

  function prevStep() {
    setActiveIndex((prev) =>
      prev === 0 ? walkthroughSteps.length - 1 : prev - 1
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
            posthog.capture("product_walkthrough_opened", {
              step: active.title,
            });
          }}
          className="group block w-full text-left"
        >
          <div className="overflow-hidden rounded-xl border border-white/10">
            <img
              src={active.image}
              alt={active.title}
              className="h-[260px] w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:opacity-90"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-violet-300">
              Step {activeIndex + 1} of {walkthroughSteps.length}
            </p>
            <h4 className="mt-1 text-lg font-semibold text-white">
              {active.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {active.description}
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Click preview to open walkthrough
            </p>
          </div>
        </button>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prevStep}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            ← Prev
          </button>

          <div className="flex gap-1">
            {walkthroughSteps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition ${
                  index === activeIndex
                    ? "w-6 bg-violet-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Next →
          </button>
        </div>
      </div>
      {modalOpen &&
  createPortal(
    <div className="fixed inset-0 z-[99999] h-screen w-screen overflow-hidden bg-[#03040a] text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 bg-[#03040a] px-6">
        <div>
          <p className="text-xs text-violet-300">
            Step {activeIndex + 1} of {walkthroughSteps.length}
          </p>
          <h3 className="text-lg font-semibold">{active.title}</h3>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          ✕ Close
        </button>
      </div>

      <div className="grid h-[calc(100vh-64px)] w-screen grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black">
          <img
            src={active.image}
            alt={active.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <aside className="flex min-h-0 flex-col justify-between overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Product walkthrough
            </p>

            <h2 className="mt-3 text-2xl font-semibold">{active.title}</h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              {active.description}
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
              Mira is evolving from query responses to full decision intelligence.
              Current capabilities include governed analytics and insights, with
              ongoing enhancements focused on recommendations and action planning.
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-1">
              {walkthroughSteps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition ${
                    index === activeIndex
                      ? "w-8 bg-violet-400"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/10"
              >
                ← Prev
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Next →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>,
    document.body
  )}
      
    </>
  );
}
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050713] text-white">
      {/* Premium background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[460px] w-[460px] rounded-full bg-violet-600/25 blur-[130px]" />
        <div className="absolute right-[-12%] top-[18%] h-[460px] w-[460px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-[-12%] left-[30%] h-[460px] w-[460px] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10">
        {/* HERO */}
        <header className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-violet-950/30 backdrop-blur-xl md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                Founder @ MetricMend • Senior Data & Analytics Engineer • AI Analytics Builder
              </p>

              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Building the next layer of analytics:
                <span className="block bg-gradient-to-r from-violet-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  BI + Cloud + AI Decision Intelligence
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                Founder of MetricMend and Senior Data & Analytics Engineer with 9+
                years of experience building enterprise analytics platforms, Power BI
                semantic models, cloud data pipelines, and AI-powered decision
                intelligence products.
              </p>

              <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                I bring a rare combination of hands-on engineering, BI architecture,
                and product ownership — helping teams move from fragmented reports to
                governed, scalable, AI-ready analytics systems.
              </p>

              <p className="mt-4 text-sm text-slate-400">
                Power BI • Microsoft Fabric • Azure Data Factory • AWS Athena • Databricks • SQL • Python • Semantic Layer • AI Analytics
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={links.product}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.02]"
                  onClick={() => posthog.capture("product_clicked")}
                >
                  View MetricMend
                </a>

                <a
                  href={links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
                  onClick={() => posthog.capture("github_clicked")}
                >
                  GitHub
                </a>

                <Link
                  href="/resume"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
                  onClick={() => posthog.capture("resume_link_clicked")}
                >
                  Resume
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur">
              <p className="text-sm uppercase tracking-widest text-slate-400">
                Why teams hire me
              </p>

              <ul className="mt-4 space-y-3">
                {[
                  "Modernize legacy BI into scalable cloud analytics platforms",
                  "Build governed Power BI semantic models and KPI frameworks",
                  "Design lakehouse-style architectures across Azure, Fabric, AWS, and Databricks",
                  "Bring AI product thinking into analytics and decision intelligence",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-slate-200"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        {/* VALUE CARDS */}
        <section className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            {
              label: "9+ Years",
              text: "Enterprise BI, analytics engineering, and data platform delivery",
            },
            {
              label: "Founder",
              text: "Building MetricMend, an AI-powered analytics product",
            },
            {
              label: "Power BI",
              text: "Semantic models, advanced DAX, OLS, incremental refresh",
            },
            {
              label: "Cloud + AI",
              text: "Azure, Fabric, AWS, Databricks, OpenAI, and semantic layers",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <p className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-2xl font-bold text-transparent">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
            </div>
          ))}
        </section>

        {/* PLATFORM + TECH STACK */}
        <section className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">
              MetricMend — AI Decision Intelligence Platform
            </h2>

            <p className="mt-3 text-slate-300">
              MetricMend is my founder-led product initiative focused on the future
              of business intelligence: governed metrics, natural-language analytics,
              semantic modeling, and AI-generated insights that help teams make better
              decisions faster.
            </p>

            <h3 className="mt-6 text-lg font-semibold">Platform Capabilities</h3>

            <ul className="mt-3 space-y-2 text-slate-300">
              <li>• Designed a governed semantic layer mapping business concepts to data models</li>
              <li>• Built AI-driven query planning and SQL generation workflows</li>
              <li>• Integrated AWS Athena for scalable, serverless query execution</li>
              <li>• Explored Databricks-style lakehouse execution patterns for large-scale transformations</li>
              <li>• Developed full-stack architecture using FastAPI and Next.js</li>
              <li>• Enabled conversational analytics with follow-up context and auto-generated insights</li>
            </ul>

            <p className="mt-5 text-sm text-slate-400">
              Designed to reduce dependency on static dashboards and make trusted
              analytics accessible through natural language.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Tech Stack
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Python",
                "FastAPI",
                "React",
                "Next.js",
                "SQL",
                "AWS Athena",
                "Databricks",
                "OpenAI",
                "Semantic Modeling",
                "Power BI",
                "Microsoft Fabric",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT + POWER BI */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl backdrop-blur-xl">
          <h2 className="text-2xl font-semibold">Product & Analytics Showcase</h2>

          <p className="mt-3 max-w-2xl text-slate-300">
            A combination of founder-led AI product development, cloud data
            engineering, and enterprise-grade Power BI analytics work.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">


              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
  <h3 className="mb-3 text-lg font-semibold">AI Product Walkthrough</h3>

  <ProductWalkthrough />



              
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <h3 className="mb-3 text-lg font-semibold">Power BI Dashboard</h3>

              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <img
                  src="/powerbi-preview.png"
                  alt="Power BI dashboard preview"
                  className="w-full rounded-xl"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href="/Sales Performance Dashboard.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => posthog.capture("dashboard_pdf_viewed")}
                >
                  View Dashboard
                </a>

                <a
                  href="/Sales Performance Dashboard.pdf"
                  download
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                  onClick={() => posthog.capture("dashboard_pdf_downloaded")}
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE HIGHLIGHTS */}
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Power BI & Semantic Models",
              text: "Built enterprise Power BI semantic models, advanced DAX, OLS, incremental refresh, governed datasets, and executive reporting solutions.",
            },
            {
              title: "Cloud Data Platforms",
              text: "Designed lakehouse-style architectures across Azure, Microsoft Fabric, AWS S3, Athena, and Databricks-aligned processing patterns.",
            },
            {
              title: "AI Analytics Product",
              text: "Building MetricMend to convert natural language into governed metrics, insights, visualizations, and business recommendations.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
            </div>
          ))}
        </section>

        {/* CONTACT */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl backdrop-blur-xl">
          <h2 className="text-2xl font-semibold">Let’s Connect</h2>

          <p className="mt-3 text-slate-300">
            Open to Senior Data & Analytics, BI, Data Platform, and AI Analytics roles.
          </p>

          <div className="mt-4 space-y-4 text-slate-300">
            <div className="flex items-center gap-3">
              <span>📧</span>
              <a
                href="mailto:akhildeva93@gmail.com"
                className="underline"
                onClick={() => posthog.capture("email_clicked")}
              >
                akhildeva93@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span>💼</span>
              <a
                href={links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="underline"
                onClick={() => posthog.capture("linkedin_clicked")}
              >
                LinkedIn Profile
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span>📍</span>
              <p>Los Angeles, CA</p>
            </div>

            <div className="flex items-center gap-3">
              <span>🚀</span>
              <p>Founder by product mindset. Engineer by core execution.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}