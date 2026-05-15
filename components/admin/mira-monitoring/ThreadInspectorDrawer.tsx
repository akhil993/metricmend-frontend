import type { ThreadInspector } from "./types";
import { Check, Copy, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatDate, formatMs, summarizeObject } from "./utils";
import {
    AuditField,
    EmptyPanel,
    LatencyBadge,
    MiniStat,
    SectionTitle,
    StatusBadge,
} from "./shared";

export default function ThreadInspectorDrawer({
    loading,
    data,
    onClose,
    onDelete,
}: {
    loading: boolean;
    data: ThreadInspector | null;
    onClose: () => void;
    onDelete: () => void;
}) {
    const thread = data?.thread;
    const messages = data?.messages ?? [];
    const auditLogs = data?.audit_logs ?? [];
    const [copiedSqlId, setCopiedSqlId] = useState<string | null>(null);

    async function copySql(logId: string, sql: string) {
        await navigator.clipboard.writeText(sql);
        setCopiedSqlId(logId);

        window.setTimeout(() => {
            setCopiedSqlId(null);
        }, 1500);
    }

    const userName =
        thread?.user_name ||
        thread?.created_by_name ||
        thread?.user_email ||
        thread?.created_by_email ||
        "Unknown user";

    const email =
        thread?.user_email || thread?.created_by_email || "No email available";

    const workspaceName =
        thread?.workspace_name || thread?.launchpad_name || "Launchpad";

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm">
            <aside className="flex h-full w-full max-w-4xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Thread Inspector
                            </p>

                            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                                {userName}
                            </h3>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span>{email}</span>
                                <span>•</span>
                                <span>{workspaceName}</span>
                                <span>•</span>
                                <span>Created {formatDate(thread?.created_at)}</span>
                                <span>•</span>
                                <span>
                                    Last active{" "}
                                    {formatDate(thread?.last_activity_at || thread?.created_at)}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <MiniStat
                                    label="Messages"
                                    value={thread?.message_count ?? messages.length}
                                />
                                <MiniStat
                                    label="Queries"
                                    value={thread?.query_count ?? auditLogs.length}
                                />
                                <MiniStat label="Success" value={thread?.success_count ?? 0} />
                                <MiniStat label="Failed" value={thread?.failed_count ?? 0} />
                                <MiniStat
                                    label="Avg execution"
                                    value={
                                        thread?.avg_execution_ms != null
                                            ? `${Math.round(thread.avg_execution_ms)} ms`
                                            : "—"
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onDelete}
                                className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30"
                                title="Delete thread"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>

                            <button
                                onClick={onClose}
                                className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                title="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {loading ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Loading thread...
                        </p>
                    ) : (
                        <div className="space-y-8">
                            <section>
                                <SectionTitle
                                    title="Conversation"
                                    subtitle="User and Mira messages in this thread."
                                />

                                <div className="mt-4 space-y-4">
                                    {messages.length === 0 ? (
                                        <EmptyPanel text="No messages found for this thread." />
                                    ) : (
                                        messages.map((message, index) => {
                                            const role = String(
                                                message.role || "assistant"
                                            ).toLowerCase();
                                            const isUser = role === "user";

                                            return (
                                                <div
                                                    key={message.id ?? index}
                                                    className={`flex ${isUser ? "justify-end" : "justify-start"
                                                        }`}
                                                >
                                                    <div
                                                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isUser
                                                            ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                                                            : "border border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                                                            }`}
                                                    >
                                                        <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                                            <span>{isUser ? "User" : "Mira"}</span>
                                                            <span>{formatDate(message.created_at)}</span>
                                                        </div>

                                                        <p className="whitespace-pre-wrap leading-6">
                                                            {message.content ||
                                                                message.message ||
                                                                message.question ||
                                                                "—"}
                                                        </p>

                                                        {(message.visual_payload ||
                                                            message.metadata ||
                                                            message.payload) && (
                                                                <details className="mt-3 rounded-xl bg-black/5 p-3 text-xs dark:bg-white/10">
                                                                    <summary className="cursor-pointer font-medium">
                                                                        Payload summary
                                                                    </summary>

                                                                    <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words">
                                                                        {JSON.stringify(
                                                                            {
                                                                                payload: summarizeObject(message.payload),
                                                                                visual_payload: summarizeObject(
                                                                                    message.visual_payload
                                                                                ),
                                                                                metadata: summarizeObject(
                                                                                    message.metadata
                                                                                ),
                                                                            },
                                                                            null,
                                                                            2
                                                                        )}
                                                                    </pre>
                                                                </details>
                                                            )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </section>

                            <section>
                                <SectionTitle
                                    title="Audit Logs"
                                    subtitle="Planner, guardrail, execution, and SQL observability."
                                />

                                <div className="mt-4 space-y-4">
                                    {auditLogs.length === 0 ? (
                                        <EmptyPanel text="No audit logs found for this thread." />
                                    ) : (
                                        auditLogs.map((log) => (
                                            <div
                                                key={log.id}
                                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <StatusBadge status={log.status} />

                                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {log.query_type || "query"}
                                                            </span>

                                                            {log.is_follow_up && (
                                                                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                                                                    Follow-up
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-3 text-sm font-medium">
                                                            {log.question || "—"}
                                                        </p>
                                                    </div>

                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {formatDate(log.created_at)}
                                                    </p>
                                                </div>

                                                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    <AuditField label="Metric" value={log.metric} />
                                                    <AuditField label="Dimension" value={log.dimension} />
                                                    <AuditField
                                                        label="Execution"
                                                        value={formatMs(log.execution_time_ms)}
                                                    />
                                                    <AuditField
                                                        label="Connector"
                                                        value={log.connector_key}
                                                    />
                                                    <AuditField
                                                        label="Guardrail"
                                                        value={
                                                            log.guardrail_status ||
                                                            (log.guardrail_passed == null
                                                                ? "—"
                                                                : log.guardrail_passed
                                                                    ? "Passed"
                                                                    : "Blocked")
                                                        }
                                                    />
                                                    <AuditField
                                                        label="Planner"
                                                        value={log.planner_source}
                                                    />
                                                    <AuditField label="Rows" value={log.row_count} />
                                                </div>
                                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span>Latency:</span>
                                                    <LatencyBadge value={log.execution_time_ms} />
                                                </div>

                                                {log.error_message && (
                                                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                                                        {log.error_message}
                                                    </div>
                                                )}

                                                {log.sql && (
                                                    <details className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
                                                        <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                                                            SQL
                                                        </summary>

                                                        <div className="mt-3 flex justify-end">
                                                            <button
                                                                onClick={() => copySql(log.id, log.sql || "")}
                                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                                            >
                                                                {copiedSqlId === log.id ? (
                                                                    <>
                                                                        <Check className="h-3.5 w-3.5" />
                                                                        Copied
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy className="h-3.5 w-3.5" />
                                                                        Copy SQL
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>

                                                        <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                                            {log.sql}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}