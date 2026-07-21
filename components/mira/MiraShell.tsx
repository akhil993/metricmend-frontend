"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import AppAccountMenu from "@/components/app/AppAccountMenu";
import { createClient } from "@/lib/supabase/client";
import {
    askGlobalMira,
    askMira,
    createMiraThread,
    deleteMiraThread,
    getGlobalMiraThreads,
    getMiraThreadMessages,
    getMiraThreads,
    type MiraMessage,
    type MiraThread,
} from "@/lib/api/mira";
import { getAccessibleModels, getWorkspaceModels } from "@/lib/api/models";

import MiraChatSidebar from "./MiraChatSidebar";
import MiraChatWorkspace from "./MiraChatWorkspace";

type SemanticModel = {
    id: string;
    workspace_id: string;
    name: string;
};

type MiraShellMode = "global" | "workspace" | "launchpad";

type Props = {
    mode?: MiraShellMode;
};

function getGreetingResponse(message: string) {
    const normalized = message
        .trim()
        .toLowerCase()
        .replace(/[^\w\s']/g, "")
        .replace(/\s+/g, " ");

    if (!normalized) {
        return null;
    }

    const greetingPatterns = [
        /^(hi|hello|hey|heya|yo|good morning|good afternoon|good evening)$/,
        /^(hi|hello|hey|heya|yo)\s+(mira\s+)?(how are you|how are you doing|whats up|what's up)$/,
        /^(mira\s+)?(how are you|how are you doing|whats up|what's up)$/,
    ];

    if (!greetingPatterns.some((pattern) => pattern.test(normalized))) {
        return null;
    }

    if (normalized.includes("how are you") || normalized.includes("whats up") || normalized.includes("what's up")) {
        return "I'm doing well, thanks for asking. How are you?";
    }

    return "Hi, I'm here.";
}

export default function MiraShell({ mode = "global" }: Props) {
    const supabase = createClient();
    const { activeWorkspace, workspaces } = useAppWorkspace();
    const params = useParams<{ workspaceId?: string }>();
    const sendingRef = useRef(false);

    const routeWorkspaceId =
        typeof params?.workspaceId === "string" ? params.workspaceId : null;

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
    const [thinkingQuestion, setThinkingQuestion] = useState<string | null>(null);

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

    const activeModelName = useMemo(
        () => models.find((model) => model.id === activeModelId)?.name ?? null,
        [activeModelId, models]
    );

    const activeModel = useMemo(
        () => models.find((model) => model.id === activeModelId) || null,
        [activeModelId, models]
    );

    const launchpadWorkspace = useMemo(
        () =>
            workspaces.find(
                (workspace) =>
                    workspace.workspace_type === "launchpad" ||
                    workspace.workspace_name?.toLowerCase() === "launchpad"
            ) || null,
        [workspaces]
    );

    const selectedModelWorkspaceId = activeModel?.workspace_id || null;

    const modelListScopeKey =
        mode === "global"
            ? "global"
            : mode === "launchpad"
                ? launchpadWorkspace?.workspace_id || activeWorkspace.workspace_id
                : routeWorkspaceId || activeWorkspace.workspace_id;

    const scopedWorkspaceId =
        mode === "workspace"
            ? routeWorkspaceId || activeWorkspace.workspace_id
            : mode === "launchpad"
                ? launchpadWorkspace?.workspace_id || activeWorkspace.workspace_id
                : selectedModelWorkspaceId;

    const workspaceLabel =
        mode === "global"
            ? "All workspaces"
            : mode === "launchpad"
                ? launchpadWorkspace?.workspace_name || activeWorkspace.workspace_name
                : activeWorkspace.workspace_name;

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
    }, [mode, scopedWorkspaceId]);

    useEffect(() => {
        if (!modelListScopeKey && mode !== "global") {
            setModels([]);
            setActiveModelId(null);
            return;
        }

        let cancelled = false;

        async function loadModels() {
            setLoadingModels(true);
            setError(null);

            try {
                const workspaceModels =
                    mode === "global"
                        ? (await getAccessibleModels()).filter((model) => {
                            const workspace = workspaces.find(
                                (item) => item.workspace_id === model.workspace_id
                            );
                            const workspaceName = workspace?.workspace_name?.toLowerCase() || "";
                            const workspaceType = workspace?.workspace_type?.toLowerCase() || "";

                            return workspaceName !== "launchpad" && workspaceType !== "launchpad";
                        })
                        : await getWorkspaceModels(modelListScopeKey as string);
                if (cancelled) return;

                setModels(workspaceModels);

                const savedModelId = localStorage.getItem(
                    `mira_active_model_${mode}_${modelListScopeKey || "global"}`
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
    }, [mode, modelListScopeKey, workspaces]);

    useEffect(() => {
        if (!userId) return;
        if (mode !== "global" && !scopedWorkspaceId) return;

        let cancelled = false;

        async function loadThreads() {
            setLoadingThreads(true);

            try {
                let data: MiraThread[];

                if (mode === "global") {
                    data = await getGlobalMiraThreads({
                        userId: userId as string,
                    });
                } else {
                    data = await getMiraThreads({
                        workspaceId: scopedWorkspaceId as string,
                        userId: userId as string,
                    });
                }

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
    }, [mode, scopedWorkspaceId, userId]);

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
        if (mode === "global") {
            setActiveThreadId(null);
            setMessages([]);
            setError(null);
            return;
        }

        if (!scopedWorkspaceId || !activeModelId || !userId) {
            setError("Workspace, user, or semantic model missing.");
            return;
        }

        try {
            const thread = await createMiraThread({
                workspace_id: scopedWorkspaceId as string,
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

        if (
            message.includes("not enough mira credits") ||
            message.includes("credit hard limit") ||
            message.includes("credits remaining")
        ) {
            return "Mira credits are not available for this workspace. Add credits or adjust the company limit before continuing.";
        }

        if (
            message.includes("mira is disabled") ||
            message.includes("allow_mira") ||
            message.includes("not enabled for this plan")
        ) {
            return "Mira is not enabled for this plan or semantic model. Check billing and model security settings.";
        }

        if (
            message.includes("do not have access") ||
            message.includes("request user does not match") ||
            message.includes("not authenticated")
        ) {
            return "Your session does not have access to this MIRA workspace or thread. Sign in again or ask an admin to review access.";
        }

        if (
            message.includes("semantic model is not available") ||
            message.includes("no accessible semantic models")
        ) {
            return "Mira needs an accessible semantic model with MIRA enabled before it can answer.";
        }

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

    async function handleSend(question: string, displayText?: string) {
    if (sendingRef.current) return;
    sendingRef.current = true;

    const greetingResponse = getGreetingResponse(question);

    if (greetingResponse) {
        const now = new Date().toISOString();

        setMessages((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                role: "user",
                content: displayText || question,
                created_at: now,
            },
            {
                id: crypto.randomUUID(),
                role: "assistant",
                content: greetingResponse,
                created_at: now,
                metadata: {
                    is_analytics_response: false,
                    actions_enabled: false,
                },
            },
        ]);
        setError(null);
        sendingRef.current = false;
        return;
    }

    if (!userId || !scopedWorkspaceId || !activeModelId) {
        sendingRef.current = false;
        setError(
            mode === "global"
                ? "No accessible non-Launchpad semantic model found for Global Mira."
                : "Workspace, user, or semantic model missing."
        );
        return;
    }

    const optimisticUserMessage: MiraMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: displayText || question,
        created_at: new Date().toISOString(),
        metadata: displayText
            ? {
                execution_prompt: question,
                display_text: displayText,
            }
            : undefined,
    };

    setMessages((current) => [...current, optimisticUserMessage]);
    setSending(true);
    setThinkingQuestion(displayText || question);
    setError(null);

    try {
        let response;

        if (mode === "global") {
            response = await askGlobalMira({
                user_id: userId,
                thread_id: activeThreadId,
                question,
            });
        } else {
            response = await askMira({
                workspace_id: scopedWorkspaceId as string,
                model_id: activeModelId as string,
                user_id: userId,
                thread_id: activeThreadId,
                question,
            });
        }

        setActiveThreadId(response.thread_id);

        const freshMessages = await getMiraThreadMessages(response.thread_id);
        setMessages(freshMessages);

        setThreads((current) => {
            const existing = current.find(
                (thread) => thread.id === response.thread_id
            );

            const now = new Date().toISOString();

            if (!existing) {
                return [
                    {
                        id: response.thread_id,
                        workspace_id:
                            response.metadata?.resolved_workspace_id ||
                            scopedWorkspaceId ||
                            "",
                        model_id:
                            response.metadata?.resolved_model_id ||
                            activeModelId ||
                            "",
                        title: question.slice(0, 80) || "New Chat",
                        created_by: userId,
                        created_at: now,
                        updated_at: now,
                        scope: mode === "global" ? "global" : "workspace",
                    },
                    ...current,
                ];
            }

            return [
                {
                    ...existing,
                    updated_at: now,
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
        sendingRef.current = false;
        setSending(false);
        setThinkingQuestion(null);
    }
}

    return (
        <div className="fixed inset-0 z-40 flex bg-slate-50 text-slate-950 dark:bg-[#070810] dark:text-white">
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

            <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-[#070810]">
                <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#070810]/90 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-semibold tracking-normal text-slate-950 dark:text-white">
                                {modeLabel}
                            </h1>

                            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                Semantic-first governed analytics
                            </p>
                        </div>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        {mode !== "global" ? (
                            <select
                                value={activeModelId || ""}
                                onChange={(e) => {
                                    const value = e.target.value || null;

                                    setActiveModelId(value);

                                    if (value) {
                                        localStorage.setItem(
                                            `mira_active_model_${mode}_${modelListScopeKey || "global"}`,
                                            value
                                        );
                                    }
                                }}
                                disabled={loadingModels || models.length === 0}
                                className="max-w-[180px] rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-200 sm:max-w-xs"
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
                        ) : null}

                        <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-300 md:block">
                            {workspaceLabel}
                        </div>

                        <AppAccountMenu userEmail={userEmail} />
                    </div>
                </header>

                <MiraChatWorkspace
                    thread={activeThread}
                    messages={messages}
                    loading={loadingMessages}
                    sending={sending}
                    error={error}
                    workspaceId={scopedWorkspaceId || undefined}
                    userId={userId || undefined}
                    threadId={activeThreadId || undefined}
                    workspaceLabel={workspaceLabel}
                    modelName={activeModelName}
                    thinkingQuestion={thinkingQuestion}
                    onSend={handleSend}
                />
            </main>
        </div>
    );
}
