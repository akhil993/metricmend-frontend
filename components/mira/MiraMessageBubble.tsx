"use client";

import {
  BarChart3,
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

  // BEGIN: context extraction for action prompts
  const metadata = message.metadata as
    | {
        metric?: string;
        semantic_context?: {
          metrics?: string[];
          dimensions?: string[];
          filters?: unknown[];
          time_context?: {
            type?: string;
            grain?: string;
          } | null;
        };
      }
    | undefined;

  const visualPayload = message.visual_payload as
    | {
        metric?: string;
        type?: string;
      }
    | undefined;

  const semanticContext = metadata?.semantic_context;
  const metricLabel =
    semanticContext?.metrics?.[0] ||
    metadata?.metric ||
    visualPayload?.metric ||
    "the current analysis";
  const dimensionLabel = semanticContext?.dimensions?.[0];
  const filters = semanticContext?.filters || [];
  const timeContext = semanticContext?.time_context;

  const actionContext = [
    `Metric: ${metricLabel}`,
    dimensionLabel ? `Dimension: ${dimensionLabel}` : null,
    timeContext?.type ? `Time period: ${timeContext.type}` : null,
    timeContext?.grain ? `Date grain: ${timeContext.grain}` : null,
    filters.length ? `Filters: ${JSON.stringify(filters)}` : null,
    message.summary ? `Summary: ${message.summary}` : null,
    message.insights?.length
      ? `Key insights: ${message.insights.join(" | ")}`
      : null,
    message.recommendations?.length
      ? `Recommendations: ${message.recommendations.join(" | ")}`
      : null,
    visualPayload?.type ? `Visual type: ${visualPayload.type}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  // END: context extraction for action prompts

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
      save_insight: `Save this insight for future reference using the current analysis context.\n\n${actionContext}`,

      share_workspace: `Prepare a workspace-shareable summary of this analysis. Include the metric, time context, key insights, recommendations, and any filters. Do not rerun the analysis unless necessary.\n\n${actionContext}`,

      export_visual: `Prepare an export-ready visual package for ${metricLabel}. Include a clean title, subtitle, metric, time context, filters, key insights, and chart notes from the current result. Do not ask for a metric because the metric is provided below.\n\n${actionContext}`,

      export_table: `Prepare an export-ready table package for ${metricLabel}. Include column descriptions, metric context, filters, time context, and a short interpretation of the current rows. Do not ask for a metric because the metric is provided below.\n\n${actionContext}`,

      create_dashboard_card: `Create a dashboard card definition for ${metricLabel} using the current analysis. Include card title, metric, time context, visual type, filters, business interpretation, and recommended dashboard placement. Do not ask for a metric because the metric is provided below.\n\n${actionContext}`,

      root_cause_analysis: `Run root-cause analysis for ${metricLabel} using the current analysis as context. Focus on explaining the observed performance, strongest drivers, weakest segments, and recommended actions. Do not ask for a metric because the metric is provided below.\n\n${actionContext}`,

      executive_summary: `Create an executive summary for ${metricLabel} using the current analysis. Include what happened, business impact, risks, key drivers, and recommended next actions. Do not ask for a metric because the metric is provided below.\n\n${actionContext}`,
    };

    const prompt = prompts[action];

    if (!prompt.trim()) {
      return;
    }

    onSendMessage(prompt);
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

        {message.visual_payload ? (
          <div className="mt-4">
            <MiraVisual
              visual={message.visual_payload}
              metadata={message.metadata}
              onDrilldown={handleDrilldown}
            />
          </div>
        ) : null}

        {!isUser && message.insights?.length ? (
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-400/20 dark:bg-indigo-400/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-indigo-800 dark:text-indigo-100">
              <BarChart3 className="h-4 w-4" />
              Key Insights
            </div>

            <ul className="space-y-2 text-sm leading-6 text-indigo-900 dark:text-indigo-50">
              {message.insights.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <span className="mt-0.5 text-indigo-600 dark:text-indigo-300">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!isUser && message.recommendations?.length ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-400/20 dark:bg-emerald-400/10">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-100">
              <Lightbulb className="h-4 w-4" />
              Recommendations
            </div>

            <ul className="space-y-2 text-sm leading-6 text-emerald-900 dark:text-emerald-50">
              {message.recommendations.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <span className="mt-0.5 text-emerald-600 dark:text-emerald-300">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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