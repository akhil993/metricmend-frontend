"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { useState } from "react";
import { createPortal } from "react-dom";

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
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/5">
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
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
            <img
              src={active.image}
              alt={active.title}
              className="h-[260px] w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
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
                className={`h-2 rounded-full transition ${index === activeIndex
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

              <aside className="flex min-h-0 flex-col justify-between overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-2xl ring-1 ring-white/5">
                <div>
                  <p className="text-sm uppercase tracking-widest text-slate-500">
                    Founder project walkthrough
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold">
                    {active.title}
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {active.description}
                  </p>

                  <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
                    MetricMend is a personal founder project exploring governed
                    metrics, semantic modeling, conversational analytics, and AI
                    decision intelligence.
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {walkthroughSteps.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition ${index === activeIndex
                          ? "w-8 bg-violet-400"
                          : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                        aria-label={`Go to step ${index + 1}`}
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

function AccordionSection({
  title,
  eyebrow,
  children,
  defaultOpen = true,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 shadow-xl shadow-black/20 ring-1 ring-white/5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-slate-300">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {open && <div className="border-t border-white/10 px-6 pb-6 pt-5">{children}</div>}
    </div>
  );
}

export default function AkhilPortfolioSite() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050713] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[480px] w-[480px] rounded-full bg-violet-600/25 blur-[140px]" />
        <div className="absolute right-[-12%] top-[12%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[10%] h-[360px] w-[360px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-12%] right-[20%] h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:px-10">
        <header className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl ring-1 ring-white/5 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.45fr_1fr] md:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100">
                Senior Data & Analytics Engineer • Power BI • Semantic Modeling • Cloud Analytics
              </p>

              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Building trusted analytics platforms
                <span className="block bg-gradient-to-r from-violet-300 via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                  from data pipelines to executive decisions.
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                I’m Akhil Devabhakthuni, a Senior Data & Analytics Engineer with 9+ years of
                experience across Power BI, semantic modeling, cloud data platforms, analytics
                engineering, and executive reporting.
              </p>

              <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                I help teams modernize reporting, standardize metrics, build scalable data
                foundations, and create analytics experiences that business users actually trust.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                {[
                  "Power BI",
                  "Semantic Modeling",
                  "Azure",
                  "Microsoft Fabric",
                  "AWS",
                  "Databricks",
                  "SQL",
                  "Python",
                  "Analytics Leadership",
                  "AI Analytics",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/resume"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-900/40 transition hover:scale-[1.02]"
                  onClick={() => posthog.capture("resume_link_clicked")}
                >
                  View Resume
                </Link>

                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
                  onClick={() => posthog.capture("linkedin_clicked")}
                >
                  LinkedIn
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
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur ring-1 ring-white/5">
              <p className="text-sm uppercase tracking-widest text-slate-400">
                Impact I Create
              </p>

              <ul className="mt-4 space-y-3">
                {[
                  "Modernize fragmented reporting into governed analytics platforms",
                  "Design trusted KPI frameworks and semantic models for business users",
                  "Build scalable cloud analytics systems across Azure, Fabric, AWS, and Databricks",
                  "Translate business problems into reliable data products and executive insights",
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

        <section className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            {
              label: "9+ Years",
              text: "Enterprise BI, analytics engineering, and data platform delivery",
            },
            {
              label: "BI Architecture",
              text: "Power BI semantic models, DAX, KPI governance, and executive reporting",
            },
            {
              label: "Cloud Platforms",
              text: "Hands-on experience across on-prem, Azure, Fabric, AWS, and Databricks",
            },
            {
              label: "AI Mindset",
              text: "Applying semantic layers and AI to make analytics more conversational and actionable",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/5 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <p className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-2xl font-bold text-transparent">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/5">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              What I’ve learned building analytics platforms
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Most teams do not struggle because they lack dashboards.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              They struggle when metrics are defined differently across teams, data lives in
              too many places, or people do not fully trust the numbers. The work I enjoy most
              is solving those problems by building clean semantic models, reliable data
              foundations, and reporting experiences people actually use.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Business-first analytics",
                text: "I start with the decision, then design the data model, metric logic, and reporting experience around it.",
              },
              {
                title: "Governed by design",
                text: "I focus on trusted definitions, reusable semantic layers, secure access, and scalable reporting foundations.",
              },
              {
                title: "Built for adoption",
                text: "The best analytics system is one business teams actually use, understand, and trust.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 ring-1 ring-white/5"
              >
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/5">
          <p className="text-sm uppercase tracking-[0.24em] text-amber-300">
            Selected Work
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Experience across BI, semantic modeling, cloud analytics, and AI exploration.
          </h2>

          <p className="mt-3 max-w-3xl text-slate-300">
            These sections highlight the types of analytics systems I have built and supported:
            executive Power BI reporting, governed semantic models, cloud data platforms, and
            a personal founder project exploring AI-powered analytics.
          </p>

          <div className="mt-7 space-y-5">
            <AccordionSection
              eyebrow="Business Intelligence"
              title="Power BI & Executive Analytics"
              defaultOpen
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="leading-7 text-slate-300">
                    Over the course of my career, I have designed and delivered Power BI
                    solutions for executive leadership, operational teams, finance,
                    ecommerce, and business stakeholders.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      "Semantic model design",
                      "Advanced DAX calculations",
                      "Incremental refresh strategies",
                      "Row-level and object-level security",
                      "Executive KPI scorecards",
                      "Self-service analytics enablement",
                      "Performance optimization",
                      "Governed metric definitions",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-400">
                    The goal has always been the same: provide trusted metrics that
                    help leaders make faster, clearer business decisions.
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-white">
                    Sample Power BI Dashboard
                  </p>

                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg">
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
                      View PDF
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
            </AccordionSection>

            <AccordionSection
              eyebrow="Architecture"
              title="Semantic Modeling & Data Architecture"
              defaultOpen
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="leading-7 text-slate-300">
                    I have worked across on-premises, Azure, Microsoft Fabric, AWS,
                    and modern cloud analytics environments to design semantic models
                    and analytics architectures that make reporting consistent,
                    scalable, and business-friendly.
                  </p>

                  <p className="mt-4 leading-7 text-slate-400">
                    My focus is creating a trusted analytics layer where facts,
                    dimensions, relationships, calculations, and KPI definitions are
                    reusable across teams instead of being rebuilt differently in every
                    report.
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                  <p className="text-sm uppercase tracking-widest text-slate-500">
                    Experience Across
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      "On-prem SQL Server",
                      "Azure",
                      "Microsoft Fabric",
                      "AWS Athena",
                      "Power BI",
                      "Databricks",
                      "Dimensional Modeling",
                      "Star Schema",
                      "KPI Governance",
                      "Semantic Layer",
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
              </div>
            </AccordionSection>

            <AccordionSection
              eyebrow="Cloud Analytics"
              title="Cloud Data Platforms & Analytics Engineering"
              defaultOpen
            >
              <p className="max-w-4xl leading-7 text-slate-300">
                I have designed and supported analytics workflows across cloud and
                hybrid environments, including Azure Data Factory, Microsoft Fabric,
                AWS S3, AWS Athena, Databricks-aligned patterns, SQL-based
                transformations, and data warehouse optimization.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  {
                    title: "Pipeline Design",
                    text: "Reliable movement and transformation of business data across systems.",
                  },
                  {
                    title: "Warehouse Optimization",
                    text: "SQL design, model structure, and performance-minded analytics layers.",
                  },
                  {
                    title: "Scalable Reporting",
                    text: "Cloud-ready foundations that support BI, self-service, and executive reporting.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                  >
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection
              eyebrow="Founder Project"
              title="Founder Project: MetricMend"
              defaultOpen={false}
            >
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <p className="leading-7 text-slate-300">
                    MetricMend is a personal founder-led project where I am exploring
                    the future of analytics through semantic modeling, governed metrics,
                    conversational AI, and decision intelligence.
                  </p>

                  <p className="mt-4 leading-7 text-slate-400">
                    It demonstrates my ability to combine product thinking, full-stack
                    execution, data architecture, AI workflows, and analytics strategy —
                    but it is intentionally positioned as a founder project, not the main
                    proof of my professional experience.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Next.js",
                      "FastAPI",
                      "OpenAI",
                      "AWS Athena",
                      "Semantic Modeling",
                      "Governed Metrics",
                      "Mira Assistant",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <a
                    href={links.product}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                    onClick={() => posthog.capture("product_clicked")}
                  >
                    View MetricMend
                  </a>
                </div>

                <ProductWalkthrough />
              </div>
            </AccordionSection>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Analytics Platform Leadership",
              text: "Owned analytics ecosystems that support business stakeholders across operations, finance, ecommerce, and executive leadership.",
            },
            {
              title: "BI Transformation",
              text: "Modernized reporting environments through semantic modeling, trusted KPIs, scalable datasets, and improved reporting workflows.",
            },
            {
              title: "Product Thinking",
              text: "Approach analytics like a product: adoption, trust, usability, governance, and business value matter as much as the technology.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/5 transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-xl shadow-black/20 backdrop-blur-xl ring-1 ring-white/5">
          <h2 className="text-2xl font-semibold">Let’s Connect</h2>

          <p className="mt-3 text-slate-300">
            Open to Senior Data & Analytics, BI, Data Platform, Analytics Engineering,
            and AI Analytics roles.
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
              <p>Business-first analytics. Governed systems. Executive-ready decisions.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}