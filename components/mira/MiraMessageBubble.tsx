"use client";

import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Lightbulb,
  ArrowUpRight,
  Database,
  Pencil,
  RefreshCw,
  Route,
  ShieldCheck,
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
import { createDecision } from "@/lib/api/insightmend";

type Props = {
  message: MiraMessage;
  workspaceId?: string;
  userId?: string;
  threadId?: string;
  onDrilldown?: (executionPrompt: string, displayText?: string) => void;
  onSendMessage?: (message: string) => void;
  sending?: boolean;
  retryQuestion?: string;
};

const processLabels: Record<string, string> = {
  reviewing_model: "Governed model reviewed",
  building_context: "Business context assembled",
  planning_intent: "Intent classified",
  resolving_time: "Reporting period resolved",
  resolving_metric: "Metric definition matched",
  resolving_dimensions: "Dimensions validated",
  resolving_filters: "Filters normalized",
  building_query: "Evidence plan prepared",
  running_query: "Governed analysis executed",
  running_supporting_analysis: "Supporting drivers checked",
  generating_insights: "Business narrative synthesized",
  preparing_actions: "Next steps prepared",
  completed: "Answer finalized",
};

function getProcessLabel(
  event:
    | string
    | {
        event?: string;
        label?: string;
      },
) {
  const eventName = typeof event === "string" ? event : event.event || "";

  if (eventName && processLabels[eventName]) {
    return processLabels[eventName];
  }

  if (typeof event !== "string" && event.label) {
    return event.label;
  }

  return (
    eventName
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Completed step"
  );
}

export default function MiraMessageBubble({
  message,
  workspaceId,
  userId,
  threadId,
  onDrilldown,
  onSendMessage,
  sending = false,
  retryQuestion,
}: Props) {
  const isUser = message.role === "user";

  const [loadingAction, setLoadingAction] = useState<MiraActionKey | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [showGovernedPath, setShowGovernedPath] = useState(false);
  const [showQuery, setShowQuery] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(message.content);

  const metadata = message.metadata as
    | {
        metric?: string;
        is_analytics_response?: boolean;
        actions_enabled?: boolean;
        progress_events?: Array<
          | string
          | {
              event?: string;
              label?: string;
            }
        >;
        semantic_context?: {
          metrics?: string[];
          dimensions?: string[];
          filters?: unknown[];
          time_context?: {
            type?: string;
            grain?: string;
          } | null;
        };
        sql_payload?: {
          sql?: string;
        } | null;
        citations?: Array<{
          id: string; label?: string; row?: Record<string, unknown>; metric?: string;
          dimensions?: string[]; filters?: unknown[]; time_period?: string; date_grain?: string;
        }>;
        metric_health?: {
          status?: string; trust_label?: string; query_guardrail_passed?: boolean;
          evidence_rows?: number; freshness?: string;
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
  const progressEvents = metadata?.progress_events || [];
  const querySql = metadata?.sql_payload?.sql?.trim();
  const citations = metadata?.citations || [];
  const metricHealth = metadata?.metric_health;
  const openCitation = citations.find((citation) => citation.id === selectedCitation);

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

  async function trackRecommendation(recommendation: string) {
    if (!workspaceId) return;
    try {
      setActionStatus(null);
      await createDecision({ workspace_id: workspaceId, title: recommendation.replace(/^Priority\s+[—-]\s*/i, "").slice(0, 120), recommendation, target_metric: metricLabel, source_thread_id: threadId, source_message_id: message.id, evidence: citations });
      setActionStatus("Recommendation added to Decision Workbench.");
    } catch (error) {
      setActionStatus(error instanceof Error ? error.message : "Decision could not be created.");
    }
  }

  return (
    <div
      className={[
        "flex gap-3",
        isUser ? "justify-end" : "justify-start",
      ].join(" ")}
    >
      {!isUser ? (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
          <Sparkles className="h-4 w-4" />
        </div>
      ) : null}

      <div
        className={[
          isUser
            ? "max-w-[78%] rounded-[22px] px-4 py-3 shadow-sm"
            : "w-full max-w-3xl rounded-[22px] px-0 py-0",
          isUser
            ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
            : "text-slate-800 dark:text-slate-100",
        ].join(" ")}
      >
        <p className="whitespace-pre-wrap text-[15px] leading-7">
          {message.content}
        </p>

        {isUser && onSendMessage ? (
          <div className="mt-2">
            {editingQuestion ? <div className="rounded-xl bg-white/10 p-2"><textarea value={editedQuestion} onChange={(event) => setEditedQuestion(event.target.value)} rows={2} className="w-full resize-none bg-transparent text-sm text-white outline-none dark:text-slate-950" /><div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditingQuestion(false)} className="rounded-lg px-2 py-1 text-xs opacity-70">Cancel</button><button type="button" disabled={!editedQuestion.trim() || sending} onClick={() => { onSendMessage(editedQuestion.trim()); setEditingQuestion(false); }} className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-950 dark:bg-slate-950 dark:text-white">Run edited question</button></div></div> : <button type="button" onClick={() => setEditingQuestion(true)} className="inline-flex items-center gap-1 text-[11px] font-medium text-white/60 hover:text-white dark:text-slate-600 dark:hover:text-slate-950"><Pencil className="h-3 w-3" />Edit & rerun</button>}
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

        {!isUser && message.insights?.length ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <BarChart3 className="h-4 w-4" />
              Key Insights
            </div>

            <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
              {message.insights.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <span className="mt-0.5 text-sky-600 dark:text-sky-300">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!isUser && (citations.length || metricHealth) ? (
          <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-50/40 p-4 dark:border-emerald-300/10 dark:bg-emerald-400/[0.045]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><ShieldCheck className="h-4 w-4 text-emerald-600" />Evidence & metric health</div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 shadow-sm dark:bg-white/[0.07] dark:text-emerald-300">{metricHealth?.trust_label || "Governed"}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="rounded-lg bg-white px-2.5 py-1.5 shadow-sm dark:bg-white/[0.06]">{metricHealth?.evidence_rows ?? citations.length} evidence rows</span>
              <span className="rounded-lg bg-white px-2.5 py-1.5 shadow-sm dark:bg-white/[0.06]">Guardrail {metricHealth?.query_guardrail_passed === false ? "needs review" : "passed"}</span>
              <span className="rounded-lg bg-white px-2.5 py-1.5 shadow-sm dark:bg-white/[0.06]">Freshness {metricHealth?.freshness === "not_available" ? "not reported" : metricHealth?.freshness}</span>
            </div>
            {citations.length ? <div className="mt-3 flex flex-wrap gap-2">{citations.slice(0, 10).map((citation) => <button key={citation.id} type="button" onClick={() => setSelectedCitation(selectedCitation === citation.id ? null : citation.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/15 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-500/30 dark:bg-white/[0.06] dark:text-emerald-300"><Database className="h-3 w-3" />[{citation.id}]</button>)}</div> : null}
            {openCitation ? <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#0b0d16]">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-900 dark:text-white">{openCitation.label || openCitation.id}</p><button type="button" onClick={() => setSelectedCitation(null)} className="text-[11px] text-slate-400 hover:text-slate-700">Close</button></div>
              <dl className="mt-2 grid gap-1 text-[11px] text-slate-500 dark:text-slate-400"><div>Metric: {openCitation.metric || "Not specified"}</div><div>Period: {openCitation.time_period || "Not specified"}</div></dl>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100"><code>{JSON.stringify(openCitation.row || {}, null, 2)}</code></pre>
            </div> : null}
          </div>
        ) : null}

        {!isUser && message.recommendations?.length ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-white via-white to-violet-50/60 shadow-sm dark:border-violet-300/10 dark:from-white/[0.055] dark:via-white/[0.04] dark:to-violet-400/[0.06]">
            <div className="flex items-start justify-between gap-4 border-b border-violet-500/10 px-4 py-3.5">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300"><Lightbulb className="h-4 w-4" /></span>
                  Recommended next moves
                </div>
                <p className="mt-1 pl-9 text-[11px] text-slate-500 dark:text-slate-400">Prioritized from the evidence in this analysis</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Evidence linked</span>
            </div>

            <div className="divide-y divide-slate-200/70 dark:divide-white/[0.07]">
              {message.recommendations.map((item, index) => (
                <div key={`${item}-${index}`} className="group flex gap-3 px-4 py-3.5 transition hover:bg-violet-500/[0.035]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/[0.07] text-[10px] font-bold text-violet-700 dark:text-violet-300">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</p>
                    {onSendMessage ? (
                      <div className="mt-2 flex flex-wrap gap-3"><button type="button" disabled={sending} onClick={() => onSendMessage(`Act on this recommendation using governed analysis. Validate the evidence, quantify the opportunity or risk, identify the strongest contributing segments, and propose a measurable next step. Recommendation: ${item}`)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 opacity-80 transition hover:opacity-100 disabled:opacity-40 dark:text-violet-300">Investigate <ArrowUpRight className="h-3 w-3" /></button>{workspaceId ? <button type="button" onClick={() => void trackRecommendation(item)} className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Track decision</button> : null}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!isUser && progressEvents.length ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowGovernedPath((current) => !current)}
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:hover:bg-emerald-400/20"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified · governed path
              {showGovernedPath ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showGovernedPath ? (
              <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-100">
                  <Route className="h-4 w-4" />
                  Governed analysis path
                </div>

                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  {progressEvents.slice(0, 8).map((event, index) => {
                    const label = getProcessLabel(event);

                    return (
                      <div
                        key={`${label}-${index}`}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="leading-5">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {!isUser && querySql ? (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowQuery((current) => !current)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
            >
              <Code2 className="h-3.5 w-3.5" />
              View query
              {showQuery ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showQuery ? (
              <pre className="mt-2 max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-xs leading-6 text-slate-100 dark:border-white/10">
                <code>{querySql}</code>
              </pre>
            ) : null}
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
              Continue with Mira
            </div>

            <MiraActions
              onAction={handleAction}
              disabled={sending}
              loadingAction={loadingAction}
            />

            {actionStatus ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
                {actionStatus}
              </div>
            ) : null}
          </div>
        ) : null}

        {!isUser && retryQuestion && onSendMessage ? <button type="button" disabled={sending} onClick={() => onSendMessage(retryQuestion)} className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:text-white"><RefreshCw className="h-3 w-3" />Retry analysis</button> : null}
      </div>

      {isUser ? (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <UserRound className="h-4 w-4" />
        </div>
      ) : null}
    </div>
  );
}
