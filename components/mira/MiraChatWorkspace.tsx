"use client";

import type { MiraMessage, MiraThread } from "@/lib/api/mira";
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
  onSend,
}: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-50 dark:bg-[#070810]">
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
