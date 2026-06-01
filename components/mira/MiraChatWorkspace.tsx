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
  onSend,
}: Props) {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-slate-50 dark:bg-transparent">
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
            onDrilldown={(executionPrompt, displayText) => {
              onSend(executionPrompt, displayText);
            }}
            onSendMessage={onSend}
          />
        )}
      </div>

      {error ? (
        <div className="mx-auto w-full max-w-4xl px-6 pb-2">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </div>
        </div>
      ) : null}

      <div className="border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="mx-auto max-w-4xl">
          <MiraInputBar
            disabled={sending}
            placeholder={
              thread
                ? "Ask a follow-up about your metrics..."
                : "Ask Mira about your governed metrics..."
            }
            onSend={onSend}
          />
        </div>
      </div>
    </section>
  );
}