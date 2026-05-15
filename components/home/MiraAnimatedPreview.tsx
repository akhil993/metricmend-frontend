"use client";

import { useEffect, useState } from "react";

const demoSteps = [
  {
    key: "ask",
    label: "Ask",
    button: "Show me revenue for last 3 months",
    user: "Show me revenue for last 3 months",
    miraTitle: "Revenue decreased 12.8% in the most recent month",
    miraBody:
      "Revenue was steady for the first two months, then dropped in the latest month. Mira detected the decline and prepared the result as a chart-ready trend.",
    mode: "chart",
  },
  {
    key: "diagnose",
    label: "Diagnose",
    button: "What went wrong with the revenue drop?",
    user: "What went wrong with the revenue drop?",
    miraTitle: "The drop appears driven by fewer orders, not lower order value",
    miraBody:
      "Mira compared revenue, order count, and average order value. Order count declined while AOV stayed mostly stable, suggesting demand or conversion softened.",
    mode: "diagnosis",
  },
  {
    key: "recommend",
    label: "Recommend",
    button: "What can we do to improve revenue?",
    user: "What can we do to improve revenue?",
    miraTitle: "Recommended plan: recover conversion and repeat purchases",
    miraBody:
      "Prioritize win-back campaigns, review top product availability, test targeted offers, and monitor channel-level conversion weekly.",
    mode: "recommendation",
  },
  {
    key: "action",
    label: "Action Plan",
    button: "Create an action plan",
    user: "Create an action plan",
    miraTitle: "30-day revenue recovery action plan",
    miraBody:
      "Week 1: identify weak channels and products. Week 2: launch win-back offers. Week 3: optimize campaigns. Week 4: review lift, retention, and revenue recovery.",
    mode: "plan",
  },
];

function RevenueLineChart() {
  const points = [
    { x: 8, y: 42, label: "M1" },
    { x: 50, y: 34, label: "M2" },
    { x: 92, y: 62, label: "M3" },
  ];

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(34,211,238,0.10),transparent)] p-4">
      <svg viewBox="0 0 100 76" className="h-44 w-full overflow-visible">
        <path
          d="M 8 68 H 96"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
        />
        <path
          d="M 8 50 H 96"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
        <path
          d="M 8 32 H 96"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />

        <path
          d={path}
          fill="none"
          stroke="url(#revenueGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <g key={point.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3.4"
              fill="white"
              stroke="rgba(34,211,238,0.9)"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y="74"
              textAnchor="middle"
              className="fill-neutral-500 text-[5px]"
            >
              {point.label}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="revenueGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function DetailList({ mode }: { mode: string }) {
  const items =
    mode === "diagnosis"
      ? ["Orders declined", "AOV stayed stable", "Repeat purchases weakened"]
      : mode === "recommendation"
        ? ["Launch win-back campaign", "Review product availability", "Monitor channel conversion"]
        : ["Week 1: diagnose", "Week 2: launch", "Week 3: optimize", "Week 4: review"];

  return (
    <div className="mt-4 grid gap-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-neutral-300"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default function MiraAnimatedPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  const currentStep = demoSteps[activeIndex];

  useEffect(() => {
    setTypedText("");

    let charIndex = 0;

    const interval = window.setInterval(() => {
      charIndex += 1;
      setTypedText(currentStep.user.slice(0, charIndex));

      if (charIndex >= currentStep.user.length) {
        window.clearInterval(interval);
      }
    }, 35);

    return () => window.clearInterval(interval);
  }, [currentStep.user]);

  function handleStepClick(index: number) {
    if (index > maxUnlockedIndex) return;

    setActiveIndex(index);

    if (index === maxUnlockedIndex && index < demoSteps.length - 1) {
      setMaxUnlockedIndex(index + 1);
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-cyan-400/10 blur-3xl motion-safe:animate-pulse" />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b12] p-4 shadow-2xl transition duration-500 hover:-translate-y-1 hover:border-cyan-200/20">
        <div className="rounded-[1.4rem] border border-white/10 bg-[#070810] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Mira interactive preview
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Ask → Diagnose → Recommend → Act
              </h3>
            </div>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {activeIndex + 1}/{demoSteps.length}
            </span>
          </div>

          <div className="mb-4 grid gap-2">
            {demoSteps.map((step, index) => {
              const isActive = index === activeIndex;
              const isEnabled = index <= maxUnlockedIndex;

              return (
                <button
                  key={step.key}
                  type="button"
                  disabled={!isEnabled}
                  onClick={() => handleStepClick(index)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50"
                      : isEnabled
                        ? "border-white/10 bg-white/[0.04] text-neutral-300 hover:bg-white/[0.07]"
                        : "cursor-not-allowed border-white/5 bg-white/[0.02] text-neutral-600"
                  }`}
                >
                  <span className="font-medium">{step.label}:</span>{" "}
                  {step.button}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/60">
              User asks
            </p>
            <p className="mt-2 min-h-6 text-sm font-medium text-cyan-50">
              {typedText}
              <span className="ml-1 animate-pulse">|</span>
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                Mira answers
              </p>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300">
                governed
              </span>
            </div>

            <h4 className="text-base font-semibold leading-6 text-white">
              {currentStep.miraTitle}
            </h4>

            <p className="mt-2 text-sm leading-6 text-neutral-400">
              {currentStep.miraBody}
            </p>

            {currentStep.mode === "chart" ? (
              <RevenueLineChart />
            ) : (
              <DetailList mode={currentStep.mode} />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Metric Resolver", "Time Intelligence", "OLS", "RLS", "SQL Guardrails"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-neutral-400"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-neutral-500">
        Click each step to unlock Mira’s full governed analytics workflow.
      </p>
    </div>
  );
}