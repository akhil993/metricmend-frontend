"use client";

import {
  BarChart3,
  Lightbulb,
  Sparkles,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import {
  createMiraDashboardCard,
  exportMiraTable,
  exportMiraVisual,
  saveMiraInsight,
  shareMiraArtifact,
  type MiraMessage,
} from "@/lib/api/mira";

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
  workspaceId?: string;
  userId?: string;
  threadId?: string;
  onDrilldown?: (executionPrompt: string, displayText?: string) => void;
  onSendMessage?: (message: string) => void;
  sending?: boolean;
};

export default function MiraMessageBubble({
  message,
  workspaceId,
  userId,
  threadId,
  onDrilldown,
  onSendMessage,
  sending = false,
}: Props) {
  const isUser = message.role === "user";

  const [loadingAction, setLoadingAction] = useState<MiraActionKey | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const metadata = message.metadata as
    | {
        metric?: string;
        is_analytics_response?: boolean;
        actions_enabled?: boolean;
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
        title?: string;
      }
    | undefined;

  const actionsEnabled =
    !isUser &&
    metadata?.actions_enabled !== false &&
    metadata?.is_analytics_response !== false &&
    Boolean(
      message.visual_payload ||
        message.rows?.length ||
        message.insights?.length ||
        message.recommendations?.length,
    );

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

  function handleDrilldown(payload: MiraDrilldownPayload) {
    const drilldown = buildDrilldownQuestion(payload);

    if (!drilldown || !onDrilldown) {
      return;
    }

    onDrilldown(
      drilldown.executionPrompt,
      drilldown.displayText,
    );
  }

  function handleSuggestedQuestion(question: string) {
    if (!onSendMessage) {
      return;
    }

    onSendMessage(question);
  }

  async function handleAction(action: MiraActionKey) {
    if (!message.id) {
      return;
    }

    const realActionPayload = {
      workspace_id: workspaceId || "",
      user_id: userId || "",
      thread_id: threadId || "",
      message_id: message.id,
      title:
        visualPayload?.title ||
        message.summary ||
        message.content?.slice(0, 90) ||
        "Mira analysis",
    };

    const requiresBackendAction =
      action === "save_insight" ||
      action === "share_workspace" ||
      action === "export_visual" ||
      action === "export_table" ||
      action === "create_dashboard_card";

    if (requiresBackendAction) {
      if (!workspaceId || !userId || !threadId) {
        setActionStatus(
          "Unable to complete action because workspace context is missing.",
        );
        return;
      }

      try {
        setLoadingAction(action);
        setActionStatus(null);

        if (action === "save_insight") {
          await saveMiraInsight(realActionPayload);
          setActionStatus("Insight saved.");
        }

        if (action === "share_workspace") {
          const response = await shareMiraArtifact(realActionPayload);
          const shareUrl = response.data?.thread_url;

          if (shareUrl) {
            await navigator.clipboard.writeText(shareUrl);
            setActionStatus("Share link copied.");
          } else {
            setActionStatus("Share artifact created.");
          }
        }

        if (action === "export_visual") {
          const response = await exportMiraVisual(realActionPayload);

          const blob = new Blob(
            [
              JSON.stringify(
                response.data?.visual_payload || {},
                null,
                2,
              ),
            ],
            {
              type: "application/json",
            },
          );

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = url;
          link.download = "mira-visual-export.json";
          document.body.appendChild(link);
          link.click();
          link.remove();

          window.URL.revokeObjectURL(url);
          setActionStatus("Visual exported.");
        }

        if (action === "export_table") {
          await exportMiraTable({
            ...realActionPayload,
            filename: "mira-table-export.csv",
          });

          setActionStatus("Table exported.");
        }

        if (action === "create_dashboard_card") {
          await createMiraDashboardCard(realActionPayload);
          setActionStatus("Dashboard card created.");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Action failed. Please try again.";

        setActionStatus(errorMessage);
      } finally {
        setLoadingAction(null);
      }

      return;
    }

    if (!onSendMessage) {
      return;
    }

    const prompts: Record<MiraActionKey, string> = {
      save_insight: "",
      share_workspace: "",
      export_visual: "",
      export_table: "",
      create_dashboard_card: "",

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

        {actionsEnabled ? (
          <div className="mt-5 border-t border-slate-200 pt-5 dark:border-white/10">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Actions
            </div>

            <MiraActions
              onAction={handleAction}
              disabled={sending}
              loadingAction={loadingAction}
            />

            {actionStatus ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
                {actionStatus}
              </div>
            ) : null}
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