"use client";

import { CheckSquare, Plus, Sparkles, Trash2, X } from "lucide-react";
import type { MiraThread } from "@/lib/api/mira";
import MiraConversationCard from "./MiraConversationCard";

type Props = {
  threads: MiraThread[];
  activeThreadId: string | null;
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread?: (threadId: string) => void;
  selectedThreadIds?: string[];
  selectionMode?: boolean;
  onToggleSelection?: (threadId: string) => void;
  onDeleteSelectedThreads?: () => void;
  onToggleSelectionMode?: () => void;
};

export default function MiraChatSidebar({
  threads,
  activeThreadId,
  loading,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  selectedThreadIds = [],
  selectionMode = false,
  onToggleSelection,
  onDeleteSelectedThreads,
  onToggleSelectionMode,
}: Props) {
  const selectedCount = selectedThreadIds.length;
  const allSelected = threads.length > 0 && selectedCount === threads.length;

  function handleToggleAll() {
    if (allSelected) {
      threads.forEach((thread) => {
        if (selectedThreadIds.includes(thread.id)) {
          onToggleSelection?.(thread.id);
        }
      });
      return;
    }

    threads.forEach((thread) => {
      if (!selectedThreadIds.includes(thread.id)) {
        onToggleSelection?.(thread.id);
      }
    });
  }

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-slate-200 bg-slate-50 text-slate-950 dark:border-white/10 dark:bg-[#070810] dark:text-white sm:w-[300px]">
      <div className="border-b border-slate-200/80 p-3 dark:border-white/10">
        <div className="mb-3 flex items-center gap-2 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold">Mira</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Governed analytics
            </p>
          </div>

          {threads.length > 0 && onToggleSelectionMode ? (
            <button
              type="button"
              onClick={onToggleSelectionMode}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
              aria-label={selectionMode ? "Cancel selection" : "Select chats"}
            >
              {selectionMode ? <X className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
            </button>
          ) : null}
        </div>

        {selectionMode ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className="w-full rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-white/[0.08] dark:text-slate-200 dark:hover:bg-white/[0.12]"
            >
              {allSelected ? "Unselect all" : "Select all"}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => {
                  if (selectedCount === 0) return;

                  const confirmed = window.confirm(
                    `Delete ${selectedCount} selected Mira chat${selectedCount === 1 ? "" : "s"}?`
                  );

                  if (!confirmed) return;

                  onDeleteSelectedThreads?.();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/25"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>

              <button
                type="button"
                onClick={onToggleSelectionMode}
                className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-white/[0.08] dark:text-slate-200 dark:hover:bg-white/[0.12]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onNewThread}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
        )}

        {selectionMode ? (
          <p className="mt-3 px-1 text-xs text-slate-500 dark:text-slate-400">
            {selectedCount} selected
          </p>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.07]" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.07]" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-200 dark:bg-white/[0.07]" />
          </div>
        ) : threads.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white/[0.06]0 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
            No chats yet. Start a new Mira conversation.
          </div>
        ) : (
          <div className="space-y-1">
            {threads.map((thread) => {
              const selected = selectedThreadIds.includes(thread.id);

              return (
                <div key={thread.id} className="group relative">
                  {selectionMode ? (
                    <button
                      type="button"
                      onClick={() => onToggleSelection?.(thread.id)}
                      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                        selected
                          ? "bg-slate-200 dark:bg-white/[0.12]"
                          : "hover:bg-slate-100 dark:hover:bg-white/[0.07]"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          selected
                            ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                            : "border-slate-300 bg-white dark:border-white/20 dark:bg-transparent"
                        }`}
                      >
                        {selected ? "✓" : ""}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                          {thread.title || "New Chat"}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {thread.updated_at
                            ? new Date(thread.updated_at).toLocaleString()
                            : "Recent chat"}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <>
                      <MiraConversationCard
                        thread={thread}
                        active={thread.id === activeThreadId}
                        onClick={() => onSelectThread(thread.id)}
                      />

                      {onDeleteThread ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            const confirmed = window.confirm("Delete this Mira chat?");

                            if (!confirmed) return;

                            onDeleteThread(thread.id);
                          }}
                          className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white/90 p-2 text-slate-400 shadow-sm transition hover:bg-red-50 hover:text-red-500 group-hover:block dark:bg-[#070810]/95 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                          aria-label="Delete Mira chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
