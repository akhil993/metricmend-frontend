"use client";

import posthog from "posthog-js";

export default function ResumePage() {
  const highlights = [
    {
      title: "Power BI & Executive Analytics",
      text: "Built semantic models, KPI scorecards, advanced DAX calculations, and executive reporting solutions used across business teams.",
    },
    {
      title: "Semantic Modeling & Governance",
      text: "Designed reusable metrics, dimensional models, and governed analytics layers that improved reporting consistency.",
    },
    {
      title: "Cloud Data Platforms",
      text: "Hands-on experience across SQL Server, Azure, Microsoft Fabric, AWS, Athena, and Databricks analytics environments.",
    },
    {
      title: "Analytics Engineering & AI",
      text: "Combining analytics engineering, product thinking, and AI-driven analytics to create modern decision-support systems.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-violet-300">
            Resume
          </p>

          <h1 className="mt-4 text-5xl font-bold">
            Akhil Devabhakthuni
          </h1>

          <p className="mt-3 text-xl text-slate-300">
            Senior Data & Analytics Engineer
          </p>

          <p className="mx-auto mt-6 max-w-3xl leading-8 text-slate-400">
            9+ years of experience across business intelligence, semantic
            modeling, cloud data platforms, analytics engineering, and executive
            reporting. Focused on building trusted analytics foundations that
            help organizations make better decisions.
          </p>

          <div className="mt-8">
            <a
              href="/Akhil_Devabhakthuni_Senior_Data_Analytics_Engineer.pdf"
              download
              className="inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:scale-[1.02]"
              onClick={() => posthog.capture("resume_downloaded")}
            >
              Download Resume PDF
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20"
            >
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <h2 className="text-2xl font-semibold">
            Areas of Expertise
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              "Power BI",
              "Semantic Modeling",
              "Microsoft Fabric",
              "Azure",
              "AWS",
              "Athena",
              "Databricks",
              "SQL",
              "Python",
              "Analytics Engineering",
              "Executive Reporting",
              "Data Architecture",
              "AI Analytics",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}