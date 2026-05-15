"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import AppAccountMenu from "@/components/app/AppAccountMenu";
import { createClient } from "@/lib/supabase/client";
import {
    askMira,
    createMiraThread,
    deleteMiraThread,
    getMiraThreadMessages,
    getMiraThreads,
    type MiraMessage,
    type MiraThread,
} from "@/lib/api/mira";
import { getWorkspaceModels } from "@/lib/api/models";

import MiraChatSidebar from "./MiraChatSidebar";
import MiraChatWorkspace from "./MiraChatWorkspace";

type SemanticModel = {
    id: string;
    name: string;
};

type MiraShellMode = "global" | "workspace" | "launchpad";

type Props = {
    mode?: MiraShellMode;
};

export default function MiraShell({ mode = "global" }: Props) {
    const supabase = createClient();
    const { activeWorkspace } = useAppWorkspace();
    const params = useParams<{ workspaceId?: string }>();

    const routeWorkspaceId =
        typeof params?.workspaceId === "string" ? params.workspaceId : null;

    const effectiveWorkspaceId =
        activeWorkspace?.workspace_id || routeWorkspaceId;
    const workspaceLabel = activeWorkspace?.workspace_name || "Workspace";

    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [threads, setThreads] = useState<MiraThread[]>([]);
    const [messages, setMessages] = useState<MiraMessage[]>([]);
    const [models, setModels] = useState<SemanticModel[]>([]);

    const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
    const [activeModelId, setActiveModelId] = useState<string | null>(null);

    const [loadingThreads, setLoadingThreads] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);

    const modeLabel =
        mode === "launchpad"
            ? "Launchpad Mira"
            : mode === "workspace"
                ? "Workspace Mira"
                : "Global Mira";

    const activeThread = useMemo(
        () => threads.find((thread) => thread.id === activeThreadId) || null,
        [threads, activeThreadId]
    );

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                setUserEmail(user.email ?? null);
            }
        }

        loadUser();
    }, [supabase]);

    useEffect(() => {
        setThreads([]);
        setMessages([]);
        setActiveThreadId(null);
        setSelectedThreadIds([]);
        setSelectionMode(false);
        setModels([]);
        setError(null);
    }, [effectiveWorkspaceId]);

    useEffect(() => {
        if (!effectiveWorkspaceId) {
            setModels([]);
            setActiveModelId(null);
            return;
        }

        let cancelled = false;

        async function loadModels() {
            setLoadingModels(true);
            setError(null);

            try {
                const workspaceModels = await getWorkspaceModels(
                    effectiveWorkspaceId as string
                );
                if (cancelled) return;

                setModels(workspaceModels);

                const savedModelId = localStorage.getItem(
                    `mira_active_model_${effectiveWorkspaceId}`
                );

                if (
                    savedModelId &&
                    workspaceModels.some(
                        (model) => model.id === savedModelId
                    )
                ) {
                    setActiveModelId((current) => {
                        if (current === savedModelId) {
                            return current;
                        }

                        return savedModelId;
                    });
                } else {
                    setActiveModelId(
                        workspaceModels[0]?.id ?? null
                    );
                }
            } catch (err) {
                if (cancelled) return;

                setModels([]);
                setActiveModelId(null);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load semantic models"
                );
            } finally {
                if (!cancelled) {
                    setLoadingModels(false);
                }
            }
        }

        loadModels();

        return () => {
            cancelled = true;
        };
    }, [effectiveWorkspaceId]);

    useEffect(() => {
        if (!effectiveWorkspaceId || !userId) return;

        let cancelled = false;

        async function loadThreads() {
            setLoadingThreads(true);

            try {
                const data = await getMiraThreads({
                    workspaceId: effectiveWorkspaceId as string,
                    userId: userId as string,
                });

                if (cancelled) return;

                setThreads(data);
                setActiveThreadId(data[0]?.id ?? null);
            } catch (err) {
                if (cancelled) return;

                setThreads([]);
                setActiveThreadId(null);
                setError(
                    err instanceof Error ? err.message : "Failed to load Mira chats"
                );
            } finally {
                if (!cancelled) {
                    setLoadingThreads(false);
                }
            }
        }

        loadThreads();

        return () => {
            cancelled = true;
        };
    }, [effectiveWorkspaceId, userId]);

    useEffect(() => {
        if (!activeThreadId) {
            setMessages([]);
            return;
        }

        const threadId = activeThreadId;
        let cancelled = false;

        async function loadMessages() {
            setLoadingMessages(true);

            try {
                const data = await getMiraThreadMessages(threadId);

                if (!cancelled) {
                    setMessages(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load messages"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingMessages(false);
                }
            }
        }

        loadMessages();

        return () => {
            cancelled = true;
        };
    }, [activeThreadId]);

    async function handleNewThread() {
        if (!effectiveWorkspaceId || !activeModelId || !userId) {
            setError("Workspace, user, or semantic model missing.");
            return;
        }

        try {
            const thread = await createMiraThread({
                workspace_id: effectiveWorkspaceId as string,
                model_id: activeModelId,
                user_id: userId,
                title: "New Chat",
            });

            setThreads((current) => [thread, ...current]);
            setActiveThreadId(thread.id);
            setMessages([]);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to create thread"
            );
        }
    }

    function handleToggleSelectionMode() {
        setSelectionMode((current) => !current);
        setSelectedThreadIds([]);
    }

    function handleToggleThreadSelection(threadId: string) {
        setSelectedThreadIds((current) =>
            current.includes(threadId)
                ? current.filter((id) => id !== threadId)
                : [...current, threadId]
        );
    }

    async function handleDeleteSelectedThreads() {
        const idsToDelete = selectedThreadIds;

        if (idsToDelete.length === 0) return;

        const previousThreads = threads;
        const previousActiveThreadId = activeThreadId;
        const previousMessages = messages;

        setError(null);

        const remainingThreads = threads.filter(
            (thread) => !idsToDelete.includes(thread.id)
        );

        setThreads(remainingThreads);
        setSelectedThreadIds([]);
        setSelectionMode(false);

        if (activeThreadId && idsToDelete.includes(activeThreadId)) {
            const nextThread = remainingThreads[0] ?? null;
            setActiveThreadId(nextThread?.id ?? null);

            if (!nextThread) {
                setMessages([]);
            }
        }

        try {
            await Promise.all(idsToDelete.map((id) => deleteMiraThread(id)));
        } catch (err) {
            setThreads(previousThreads);
            setActiveThreadId(previousActiveThreadId);
            setMessages(previousMessages);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete selected Mira chats"
            );
        }
    }

    async function handleDeleteThread(threadId: string) {
        const previousThreads = threads;
        const previousActiveThreadId = activeThreadId;
        const previousMessages = messages;

        setError(null);
        setSelectedThreadIds((current) =>
            current.filter((id) => id !== threadId)
        );

        setThreads((current) =>
            current.filter((thread) => thread.id !== threadId)
        );

        if (activeThreadId === threadId) {
            const nextThread = threads.find((thread) => thread.id !== threadId);

            setActiveThreadId(nextThread?.id ?? null);

            if (!nextThread) {
                setMessages([]);
            }
        }

        try {
            await deleteMiraThread(threadId);
        } catch (err) {
            setThreads(previousThreads);
            setActiveThreadId(previousActiveThreadId);
            setMessages(previousMessages);

            setError(
                err instanceof Error ? err.message : "Failed to delete Mira chat"
            );
        }
    }

    function getFriendlyErrorMessage(error: unknown) {
        if (!(error instanceof Error)) {
            return "Mira couldn't complete the request.";
        }

        const message = error.message.toLowerCase();

        if (message.includes("failed to fetch")) {
            return "Mira couldn't reach the analytics service. Please try again.";
        }

        if (message.includes("timeout")) {
            return "The governed query took too long to complete.";
        }

        if (message.includes("network")) {
            return "A network issue interrupted the request.";
        }

        return "Mira couldn't complete the governed analysis.";
    }

    async function handleSend(question: string) {
        if (!effectiveWorkspaceId || !activeModelId || !userId) {
            setError("Workspace, user, or semantic model missing.");
            return;
        }

        const optimisticUserMessage: MiraMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: question,
            created_at: new Date().toISOString(),
        };

        setMessages((current) => [...current, optimisticUserMessage]);

        setSending(true);
        setError(null);

        try {
            const response = await askMira({
                workspace_id: effectiveWorkspaceId,
                model_id: activeModelId,
                user_id: userId,
                thread_id: activeThreadId,
                question,
            });

            setActiveThreadId(response.thread_id);

            const assistantMessage: MiraMessage = {
                ...response.assistant_message,
                summary: response.assistant_message.summary ?? response.summary,
                insights:
                    response.assistant_message.insights ?? response.insights ?? [],
                recommendations:
                    response.assistant_message.recommendations ??
                    response.recommendations ??
                    [],
                visual_payload:
                    response.assistant_message.visual_payload ?? response.visual_payload,
                rows: response.assistant_message.rows ?? response.rows ?? [],
                metadata: response.assistant_message.metadata ?? response.metadata,
                suggested_questions:
                    response.assistant_message.suggested_questions ??
                    response.suggested_questions ??
                    [],
            };

            setMessages((current) => [...current, assistantMessage]);

            setThreads((current) => {
                const existing = current.find(
                    (thread) => thread.id === response.thread_id
                );

                if (!existing) {
                    return current;
                }

                return [
                    {
                        ...existing,
                        updated_at: new Date().toISOString(),
                        title:
                            existing.title === "New Chat"
                                ? question.slice(0, 80)
                                : existing.title,
                    },
                    ...current.filter((thread) => thread.id !== response.thread_id),
                ];
            });
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
            <MiraChatSidebar
                threads={threads}
                activeThreadId={activeThreadId}
                loading={loadingThreads}
                onSelectThread={setActiveThreadId}
                onNewThread={handleNewThread}
                onDeleteThread={handleDeleteThread}
                selectedThreadIds={selectedThreadIds}
                selectionMode={selectionMode}
                onToggleSelection={handleToggleThreadSelection}
                onDeleteSelectedThreads={handleDeleteSelectedThreads}
                onToggleSelectionMode={handleToggleSelectionMode}
            />

            <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]">
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur dark:border-white/10 dark:bg-transparent">
                    <div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />

                            <h1 className="text-sm font-semibold tracking-wide text-slate-950 dark:text-white">
                                {modeLabel}
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Semantic-first governed analytics
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={activeModelId || ""}
                            onChange={(e) => {
                                const value = e.target.value || null;

                                setActiveModelId(value);

                                if (value) {
                                    localStorage.setItem(
                                        `mira_active_model_${effectiveWorkspaceId}`,
                                        value
                                    );
                                }
                            }}
                            disabled={loadingModels || models.length === 0}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                        >
                            {models.length === 0 ? (
                                <option value="">No models in workspace</option>
                            ) : (
                                models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name}
                                    </option>
                                ))
                            )}
                        </select>

                        <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            {workspaceLabel}
                        </div>

                        <AppAccountMenu userEmail={userEmail} />
                    </div>
                </header>

                <MiraChatWorkspace
                    thread={activeThread}
                    messages={messages}
                    loading={loadingMessages || loadingModels}
                    sending={sending}
                    error={error}
                    onSend={handleSend}
                />
            </main>
        </div>
    );
}