"use client";

import {
  BarChart3,
  LineChart,
  Search,
  Sparkles,
} from "lucide-react";

type Props = {
  onPrompt: (prompt: string) => void;
};

const prompts = [
  {
    icon: BarChart3,
    label: "Revenue snapshot",
    prompt: "Show me a revenue snapshot for the latest available period.",
  },
  {
    icon: LineChart,
    label: "Trend analysis",
    prompt: "Analyze revenue trends over the last 3 months.",
  },
  {
    icon: Search,
    label: "Find drivers",
    prompt: "What are the top drivers behind recent performance changes?",
  },
];

export default function MiraEmptyState({ onPrompt }: Props) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-white/10 dark:bg-white/[0.08] dark:text-white">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="text-3xl font-semibold tracking-normal text-slate-950 dark:text-slate-50 sm:text-4xl">
          How can Mira help?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
          Ask a governed analytics question. Mira uses your selected semantic model,
          approved metrics, and workspace context to answer with traceable analysis.
        </p>

        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {prompts.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onPrompt(item.prompt)}
                className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white dark:bg-white/[0.08] dark:text-slate-300 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-950">
                  <Icon className="h-4 w-4" />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-950 dark:text-white">
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
