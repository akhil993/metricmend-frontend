"use client";

import Link from "next/link";
import posthog from "posthog-js";

export default function ResumePage() {
  const highlights = [
    {
      title: "Power BI & Executive Analytics",
      text: "Built semantic models, KPI scorecards, advanced DAX calculations, and executive reporting solutions for business and leadership teams.",
    },
    {
      title: "Semantic Modeling & Governance",
      text: "Designed reusable metrics, dimensional models, and governed analytics layers to improve consistency across reporting.",
    },
    {
      title: "Cloud Data Platforms",
      text: "Hands-on experience across SQL Server, Azure, Microsoft Fabric, AWS, Athena, and Databricks analytics environments.",
    },
    {
      title: "Analytics Engineering",
      text: "Built scalable data foundations, reporting workflows, and business-friendly analytics experiences that teams can trust.",
    },
  ];

  const skills = [
    "Power BI",
    "Semantic Modeling",
    "Microsoft Fabric",
    "Azure Data Factory",
    "AWS",
    "Athena",
    "Databricks",
    "SQL",
    "DAX",
    "Python",
    "Executive Reporting",
    "Data Architecture",
    "Analytics Engineering",
    "KPI Governance",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050713] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[460px] w-[460px] rounded-full bg-violet-600/25 blur-[140px]" />
        <div className="absolute right-[-12%] top-[15%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-[-12%] left-[25%] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
        >
          ← Back to Portfolio
        </Link>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl ring-1 ring-white/5 md:p-12">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Resume
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Akhil Devabhakthuni
          </h1>

          <p className="mt-3 text-xl text-slate-300">
            Senior Data & Analytics Engineer
          </p>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-400">
            9+ years of experience across Power BI, semantic modeling, cloud data
            platforms, analytics engineering, and executive reporting. Focused on
            building trusted analytics foundations that help organizations make
            better business decisions.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/Akhil_Devabhakthuni_Senior_Data_Analytics_Engineer.pdf"
              download
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02]"
              onClick={() => posthog.capture("resume_downloaded")}
            >
              Download Resume PDF
            </a>

            <a
              href="/Akhil_Devabhakthuni_Senior_Data_Analytics_Engineer.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
              onClick={() => posthog.capture("resume_viewed")}
            >
              View PDF
            </a>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-xl shadow-black/20 ring-1 ring-white/5"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.045] p-8 text-center shadow-xl shadow-black/20 ring-1 ring-white/5">
          <h2 className="text-2xl font-semibold">Areas of Expertise</h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}