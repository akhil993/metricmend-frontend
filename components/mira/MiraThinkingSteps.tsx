"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  DatabaseZap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const stepCopy: Record<string, { label: string; detail: string }> = {
  reviewing_model: { label: "Verifying governed model", detail: "Checking model access and approved definitions." },
  building_context: { label: "Assembling business context", detail: "Connecting the request to relevant business meaning." },
  planning_intent: { label: "Designing the analysis", detail: "Selecting the safest analytical path." },
  resolving_time: { label: "Resolving reporting period", detail: "Matching dates and comparison windows." },
  resolving_metric: { label: "Matching governed metrics", detail: "Using approved metric definitions." },
  resolving_dimensions: { label: "Validating dimensions", detail: "Checking breakdowns and model relationships." },
  resolving_filters: { label: "Validating filters", detail: "Confirming requested segments and values." },
  building_query: { label: "Preparing evidence plan", detail: "Building a governed retrieval plan." },
  running_query: { label: "Retrieving primary evidence", detail: "Querying the connected source securely." },
  running_supporting_analysis: { label: "Checking supporting signals", detail: "Testing comparisons and explanatory evidence." },
  generating_insights: { label: "Synthesizing the answer", detail: "Turning verified results into business insight." },
  preparing_actions: { label: "Preparing next steps", detail: "Grounding recommendations in the result." },
  completed: { label: "Analysis complete", detail: "Final response is ready." },
};

type ProgressEventItem = string | {
  event?: string;
  label?: string;
  detail?: string;
  phase?: string;
  progress?: number;
  sequence?: number;
  elapsed_ms?: number;
  receivedAt?: number;
};

type NormalizedStep = {
  event: string;
  label: string;
  detail: string;
  progress: number;
  elapsedMs?: number;
};

type Props = {
  progressEvents?: ProgressEventItem[];
  question?: string;
  workspaceLabel?: string;
  modelName?: string | null;
};

function humanize(event: string) {
  return event.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalize(item: ProgressEventItem, index: number): NormalizedStep | null {
  const event = typeof item === "string" ? item : item.event;
  if (!event) return null;
  const copy = stepCopy[event];
  return {
    event,
    label: copy?.label || (typeof item === "object" && item.label) || humanize(event),
    detail: (typeof item === "object" && item.detail) || copy?.detail || "Continuing governed analysis.",
    progress: typeof item === "object" && typeof item.progress === "number"
      ? item.progress
      : Math.min(92, 12 + index * 10),
    elapsedMs: typeof item === "object" ? item.elapsed_ms : undefined,
  };
}

export default function MiraThinkingSteps({ progressEvents, question, workspaceLabel, modelName }: Props) {
  const [expanded, setExpanded] = useState(true);
  const steps = useMemo(
    () => (progressEvents || []).map(normalize).filter(Boolean) as NormalizedStep[],
    [progressEvents],
  );
  const active = steps.at(-1);
  const progress = active?.progress ?? 4;
  const context = [workspaceLabel, modelName].filter(Boolean).join(" · ");

  return (
    <section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/15 bg-white/95 shadow-[0_18px_55px_-32px_rgba(8,145,178,0.55)] backdrop-blur-xl dark:border-cyan-300/10 dark:bg-[#0b0d16]/95">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-500/[0.08] via-blue-500/[0.05] to-violet-500/[0.08]" />

      <div className="relative px-4 pb-3.5 pt-4 sm:px-5">
        <div className="flex items-start gap-3.5">
          <div className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
            <Sparkles className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-emerald-400 dark:border-[#0b0d16]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Mira analysis</p>
                <h3 className="mt-0.5 truncate text-sm font-semibold text-slate-950 dark:text-white">
                  {active?.label || "Securing your analysis"}
                </h3>
              </div>
              <span className="shrink-0 text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">{progress}%</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {active?.detail || "Establishing a secure connection to the governed semantic model."}
            </p>
          </div>
        </div>

        <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />Governed</span>
          <span className="inline-flex items-center gap-1.5"><DatabaseZap className="h-3.5 w-3.5 text-blue-500" />Live evidence</span>
          {active?.elapsedMs !== undefined ? <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{(active.elapsedMs / 1000).toFixed(1)}s</span> : null}
          {context ? <span className="truncate">{context}</span> : null}
        </div>
      </div>

      <button type="button" onClick={() => setExpanded((value) => !value)} className="relative flex w-full items-center justify-between border-t border-slate-100 px-4 py-2.5 text-left text-xs font-medium text-slate-600 transition hover:bg-slate-50/80 dark:border-white/[0.07] dark:text-slate-300 dark:hover:bg-white/[0.03]" aria-expanded={expanded}>
        <span>{expanded ? "Hide" : "Show"} analysis path · {steps.length || 1} live {steps.length === 1 ? "stage" : "stages"}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded ? (
        <div className="relative border-t border-slate-100 px-4 py-3.5 dark:border-white/[0.07] sm:px-5">
          <div className="space-y-0">
            {steps.length ? steps.map((step, index) => {
              const isActive = index === steps.length - 1;
              return (
                <div key={`${step.event}-${index}`} className="relative flex gap-3 pb-3 last:pb-0">
                  {index < steps.length - 1 ? <span className="absolute left-[9px] top-5 h-[calc(100%-8px)] w-px bg-slate-200 dark:bg-white/10" /> : null}
                  <span className={`relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full ${isActive ? "bg-cyan-500 text-white shadow-[0_0_0_4px_rgba(6,182,212,0.10)]" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                    {isActive ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> : <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={`truncate text-xs font-medium ${isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{step.label}</p>
                      {step.elapsedMs !== undefined ? <span className="text-[10px] tabular-nums text-slate-400">{(step.elapsedMs / 1000).toFixed(1)}s</span> : null}
                    </div>
                    {isActive ? <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{step.detail}</p> : null}
                  </div>
                </div>
              );
            }) : (
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />Waiting for the first verified analysis stage…
              </div>
            )}
          </div>
          {question ? <p className="mt-3 truncate rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:bg-white/[0.035] dark:text-slate-400">Analyzing: “{question}”</p> : null}
          <p className="mt-2 text-[10px] leading-4 text-slate-400 dark:text-slate-500">This trace shows verified process milestones, not private model reasoning.</p>
        </div>
      ) : null}
    </section>
  );
}
