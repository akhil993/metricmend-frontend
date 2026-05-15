import type { RecentQuery } from "./types";
import { formatDate, formatMs } from "./utils";
import { EmptyTableRow, LatencyBadge, StatusBadge } from "./shared";

export default function QueryLogsTable({
    queries,
    loading,
}: {
    queries: RecentQuery[];
    loading: boolean;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                    <tr>
                        <th className="px-5 py-3 font-medium">Question</th>
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Rows</th>
                        <th className="px-5 py-3 font-medium">Execution</th>
                        <th className="px-5 py-3 font-medium">Connector</th>
                        <th className="px-5 py-3 font-medium">Guardrail</th>
                        <th className="px-5 py-3 font-medium">Planner</th>
                        <th className="px-5 py-3 font-medium">Follow-up</th>
                        <th className="px-5 py-3 font-medium">Created</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loading ? (
                        <EmptyTableRow colSpan={10} text="Loading query logs..." />
                    ) : queries.length === 0 ? (
                        <EmptyTableRow colSpan={10} text="No query logs found." />
                    ) : (
                        queries.map((query) => (
                            <tr
                                key={query.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                            >
                                <td className="max-w-[360px] px-5 py-4">
                                    <p className="line-clamp-2 font-medium">
                                        {query.question || "—"}
                                    </p>
                                </td>

                                <td className="px-5 py-4">
                                    {query.user_email || query.user_id || "—"}
                                </td>

                                <td className="px-5 py-4">
                                    <StatusBadge status={query.status} />
                                </td>

                                <td className="px-5 py-4">{query.row_count ?? "—"}</td>

                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span>{formatMs(query.execution_time_ms)}</span>
                                        <LatencyBadge value={query.execution_time_ms} />
                                    </div>
                                </td>

                                <td className="px-5 py-4">{query.connector_key || "—"}</td>

                                <td className="px-5 py-4">
                                    {query.guardrail_passed == null
                                        ? "—"
                                        : query.guardrail_passed
                                            ? "Passed"
                                            : "Blocked"}
                                </td>

                                <td className="px-5 py-4">{query.planner_source || "—"}</td>

                                <td className="px-5 py-4">
                                    {query.is_follow_up ? "Yes" : "No"}
                                </td>

                                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                    {formatDate(query.created_at)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}