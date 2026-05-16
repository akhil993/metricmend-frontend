"use client";

import posthog from "posthog-js";
export default function ResumePage() {
  return (
      <>
       
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold">Resume</h1>

        <p className="mt-4 text-slate-300 max-w-2xl">
          Senior Data & Analytics Engineer with 9+ years of experience building
          scalable data platforms, semantic layers, and AI-driven analytics products.
        </p>

        {/* HIGHLIGHTS 🔥 */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold">AI + Analytics</h3>
            <p className="mt-2 text-sm text-slate-300">
              Built a full-stack AI decision intelligence platform translating
              natural language into SQL, insights, and recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold">Cloud & Data Engineering</h3>
            <p className="mt-2 text-sm text-slate-300">
              Designed scalable data pipelines using Azure, AWS, and Microsoft Fabric
              with Bronze/Silver/Gold architecture.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold">Business Impact</h3>
            <p className="mt-2 text-sm text-slate-300">
              Delivered executive dashboards and analytics solutions used by
              leadership for decision-making across sales and operations.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold">Modern BI & Semantic Layer</h3>
            <p className="mt-2 text-sm text-slate-300">
              Built governed semantic models enabling consistent KPIs and
              self-service analytics.
            </p>
          </div>

        </div> 

        {/* CTA 🔥 */}
        <div className="mt-10 text-center">
<p className="text-slate-400 mb-4">
  Trusted experience across enterprise BI, cloud data platforms, and AI-driven analytics
</p>
          <a
            href="/Akhil_Devabhakthuni_Senior_Data_Analytics_Engineer.pdf"
            download
            className="bg-violet-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-violet-500 transition"
            onClick={() => posthog.capture("resume_downloaded")}
          >
            Download Full Resume
          </a>
        </div>

      </div>
    </div>
    </>
  );
}
