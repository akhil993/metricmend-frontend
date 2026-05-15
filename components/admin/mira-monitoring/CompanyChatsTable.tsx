import React from "react";
import { Folder, MessageSquare } from "lucide-react";
import type { CompanyChat } from "./types";
import { formatDate, formatMs } from "./utils";
import { EmptyTableRow, LatencyBadge } from "./shared";

export default function CompanyChatsTable({
    chats,
    loading,
    expandedUsers,
    search,
    onToggleUser,
    onOpen,
    onDelete,
}: {
    chats: CompanyChat[];
    loading: boolean;
    expandedUsers: Record<string, boolean>;
    search: string;
    onToggleUser: (userKey: string) => void;
    onOpen: (threadId: string) => void;
    onDelete: (threadId: string) => void;
}) {
    const filteredChats = chats.filter((chat) => {
        const haystack = [
            chat.title,
            chat.user_name,
            chat.user_email,
            chat.created_by_name,
            chat.created_by_email,
            chat.workspace_name,
            chat.launchpad_name,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(search.trim().toLowerCase());
    });

    const groupedChats = filteredChats.reduce<Record<string, CompanyChat[]>>(
        (groups, chat) => {
            const userKey = chat.created_by || chat.user_id || "unknown-user";

            if (!groups[userKey]) groups[userKey] = [];
            groups[userKey].push(chat);

            return groups;
        },
        {}
    );

    const userGroups = Object.entries(groupedChats);

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                    <tr>
                        <th className="px-5 py-3 font-medium">User / Chat</th>
                        <th className="px-5 py-3 font-medium">Messages</th>
                        <th className="px-5 py-3 font-medium">Queries</th>
                        <th className="px-5 py-3 font-medium">Success</th>
                        <th className="px-5 py-3 font-medium">Failed</th>
                        <th className="px-5 py-3 font-medium">Avg Execution</th>
                        <th className="px-5 py-3 font-medium">Workspace</th>
                        <th className="px-5 py-3 font-medium">Last Activity</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {loading ? (
                        <EmptyTableRow colSpan={9} text="Loading company chats..." />
                    ) : userGroups.length === 0 ? (
                        <EmptyTableRow colSpan={9} text="No company chats found." />
                    ) : (
                        userGroups.map(([userKey, userChats]) => {
                            const isExpanded = expandedUsers[userKey] ?? false;
                            const firstChat = userChats[0];

                            const userLabel =
                                firstChat.user_name ||
                                firstChat.created_by_name ||
                                firstChat.user_email ||
                                firstChat.created_by_email ||
                                "User";

                            return (
                                <React.Fragment key={userKey}>
                                    <tr className="bg-slate-50/80 dark:bg-slate-950/50">
                                        <td colSpan={9} className="px-5 py-3">
                                            <button
                                                onClick={() => onToggleUser(userKey)}
                                                className="flex w-full items-center gap-2 text-left"
                                            >
                                                <Folder className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                <span className="font-semibold">{userLabel}</span>
                                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {userChats.length} chat
                                                    {userChats.length === 1 ? "" : "s"}
                                                </span>
                                                <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                                                    {isExpanded ? "Collapse" : "Expand"}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>

                                    {isExpanded &&
                                        userChats.map((chat, index) => {
                                            const threadId = chat.thread_id ?? `missing-thread-${index}`;
                                            const workspaceName =
                                                chat.workspace_name || chat.launchpad_name || "Launchpad";

                                            return (
                                                <tr
                                                    key={`${userKey}-${threadId}-${index}`}
                                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-start gap-3 pl-6">
                                                            <div className="mt-0.5 rounded-xl bg-slate-100 p-2 dark:bg-slate-800">
                                                                <MessageSquare className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                                            </div>

                                                            <div>
                                                                <p className="line-clamp-1 font-medium">
                                                                    {chat.title || "Untitled Mira Chat"}
                                                                </p>
                                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                                    {chat.user_email ||
                                                                        chat.created_by_email ||
                                                                        "No email available"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {chat.message_count ?? "—"}
                                                    </td>
                                                    <td className="px-5 py-4">{chat.query_count ?? "—"}</td>
                                                    <td className="px-5 py-4">{chat.success_count ?? 0}</td>
                                                    <td className="px-5 py-4">{chat.failed_count ?? 0}</td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span>{formatMs(chat.avg_execution_ms)}</span>
                                                            <LatencyBadge value={chat.avg_execution_ms} />
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                            {workspaceName}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                                                        {formatDate(chat.last_activity_at || chat.created_at)}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => onOpen(threadId)}
                                                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                                            >
                                                                Open
                                                            </button>

                                                            <button
                                                                onClick={() => onDelete(threadId)}
                                                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/30"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}