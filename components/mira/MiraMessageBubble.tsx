"use client";

import {
  Lightbulb,
  Sparkles,
  UserRound,
} from "lucide-react";

import type { MiraMessage } from "@/lib/api/mira";

import MiraVisual from "./MiraVisual";

import {
  buildDrilldownQuestion,
  type MiraDrilldownPayload,
} from "@/components/mira/visuals/miraDrilldownUtils";

import MiraSuggestedQuestions from "@/components/mira/MiraSuggestedQuestions";
import MiraActions, {
  type MiraActionKey,
} from "@/components/mira/MiraActions";

type Props = {
  message: MiraMessage;
  onDrilldown?: (message: string) => void;
  onSendMessage?: (message: string) => void;
  sending?: boolean;
};

export default function MiraMessageBubble({
  message,
  onDrilldown,
  onSendMessage,
  sending = false,
}: Props) {
  const isUser = message.role === "user";

  function handleDrilldown(payload: MiraDrilldownPayload) {
    const question = buildDrilldownQuestion(payload);

    if (!question || !onDrilldown) {
      return;
    }

    onDrilldown(question);
  }

  function handleSuggestedQuestion(question: string) {
    if (!onSendMessage) {
      return;
    }

    onSendMessage(question);
  }

  function handleAction(action: MiraActionKey) {
    if (!onSendMessage) {
      return;
    }

    const prompts: Record<MiraActionKey, string> = {
      save_insight:
        "Save this governed insight with its metric, filters, visual, and semantic context for future reference.",
      share_workspace:
        "Prepare this governed analysis to share with my workspace, including summary, insights, recommendations, and semantic context.",
      export_visual:
        "Prepare an export-ready version of the current visual with title, metric, filters, and governed context.",
      export_table:
        "Prepare an export-ready table from this governed result, including columns, filters, and semantic context.",
      create_dashboard_card:
        "Create a dashboard card proposal from this analysis with metric, visualization type, filters, and recommended title.",
      root_cause_analysis:
        "Run root-cause analysis on this result and identify the strongest semantic drivers.",
      executive_summary:
        "Generate an executive summary for this analysis with key findings, business impact, and recommended next steps.",
    };

    onSendMessage(prompts[action]);
  }

  return (
    <div
      className={[
        "flex gap-3",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      {!isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-indigo-600 dark:border-white/10 dark:bg-indigo-500/15 dark:text-indigo-200">
          <Sparkles className="h-4 w-4" />
        </div>
      ) : null}

      <div
        className={[
          isUser
            ? "max-w-[72%] rounded-3xl border px-5 py-4 shadow-sm"
            : "w-full max-w-4xl rounded-3xl border px-5 py-4 shadow-sm",
          isUser
            ? "border-indigo-500 bg-indigo-500 text-white"
            : "border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {message.content}
        </p>

        {!isUser && message.recommendations?.length ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-100">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </div>

            <ul className="space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-50">
              {message.recommendations.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex gap-2"
                >
                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-300">
                    •
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {message.visual_payload ? (
          <div className="mt-4">
            <MiraVisual
              visual={message.visual_payload}
              metadata={message.metadata}
              onDrilldown={handleDrilldown}
            />
          </div>
        ) : null}

        {!isUser && message.suggested_questions?.length ? (
          <div className="mt-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Suggested Analysis
            </div>

            <MiraSuggestedQuestions
              questions={message.suggested_questions}
              onSelect={handleSuggestedQuestion}
            />
          </div>
        ) : null}

        {!isUser ? (
          <div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Actions
            </div>

            <MiraActions
              onAction={handleAction}
              disabled={sending}
            />
          </div>
        ) : null}
      </div>

      {isUser ? (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-200">
          <UserRound className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}