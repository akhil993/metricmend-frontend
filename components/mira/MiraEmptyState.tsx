"use client";

import {
  BarChart3,
  LineChart,
  Sparkles,
} from "lucide-react";

type Props = {
  onPrompt: (prompt: string) => void;
};

const prompts = [
  {
    icon: BarChart3,
    label: "Revenue snapshot",
    prompt:
      "Show me a revenue snapshot for the latest available period.",
  },
  {
    icon: LineChart,
    label: "Trend analysis",
    prompt:
      "Analyze revenue trends over the last 3 months.",
  },
  {
    icon: Sparkles,
    label: "Find drivers",
    prompt:
      "What are the top drivers behind recent performance changes?",
  },
];

export default function MiraEmptyState({
  onPrompt,
}: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-100 text-indigo-600 shadow-sm dark:border-white/10 dark:bg-indigo-500/15 dark:text-indigo-200">
          <Sparkles className="h-7 w-7" />
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Ask Mira about your business
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Mira answers using governed semantic models,
          approved metrics, mmQL definitions, and
          workspace-aware analytics context.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {prompts.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  onPrompt(item.prompt)
                }
                className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-500 group-hover:text-white dark:bg-indigo-500/15 dark:text-indigo-200">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="mt-5 text-sm font-semibold text-slate-950 dark:text-white">
                  {item.label}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.prompt}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}