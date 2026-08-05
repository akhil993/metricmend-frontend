"use client";

import { AlertTriangle, RefreshCw, X } from "lucide-react";

import type { MiraMessage, MiraProgressEvent, MiraThread } from "@/lib/api/mira";
import MiraEmptyState from "./MiraEmptyState";
import MiraInputBar from "./MiraInputBar";
import MiraMessageList from "./MiraMessageList";

type Props = {
  thread: MiraThread | null;
  messages: MiraMessage[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  workspaceId?: string;
  threadId?: string;
  userId?: string;
  workspaceLabel?: string;
  modelName?: string | null;
  thinkingQuestion?: string | null;
  progressEvents?: MiraProgressEvent[];
  connectionIssue?: string | null;
  onDismissConnectionIssue?: () => void;
  onRetryConnectionCheck?: () => void;
  onSend: (message: string, displayText?: string) => void;
};

export default function MiraChatWorkspace({
  thread,
  messages,
  loading,
  sending,
  error,
  workspaceId,
  threadId,
  userId,
  workspaceLabel,
  modelName,
  thinkingQuestion,
  progressEvents,
  connectionIssue,
  onDismissConnectionIssue,
  onRetryConnectionCheck,
  onSend,
}: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-50 dark:bg-[#070810]">
      {connectionIssue ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-400/20 dark:bg-amber-400/10 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />

            <p className="flex-1 text-sm leading-6 text-amber-800 dark:text-amber-100">
              {connectionIssue}
            </p>

            <button
              type="button"
              onClick={onRetryConnectionCheck}
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-400/15"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>

            <button
              type="button"
              onClick={onDismissConnectionIssue}
              aria-label="Dismiss"
              className="shrink-0 rounded-lg p-1 text-amber-600 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-400/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <MiraEmptyState onPrompt={onSend} />
        ) : (
          <MiraMessageList
            messages={messages}
            sending={sending}
            workspaceId={workspaceId}
            userId={userId}
            threadId={threadId || thread?.id}
            workspaceLabel={workspaceLabel}
            modelName={modelName}
            thinkingQuestion={thinkingQuestion}
            progressEvents={progressEvents}
            onDrilldown={(executionPrompt, displayText) => {
              onSend(executionPrompt, displayText);
            }}
            onSendMessage={onSend}
          />
        )}
      </div>

      {error ? (
        <div className="mx-auto w-full max-w-3xl px-4 pb-3 sm:px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </div>
        </div>
      ) : null}

      <div className="border-t border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#070810]/90 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <MiraInputBar
            disabled={sending}
            placeholder={
              thread
                ? "Ask a follow-up..."
                : "Message Mira..."
            }
            onSend={onSend}
          />
        </div>
      </div>
    </section>
  );
}
