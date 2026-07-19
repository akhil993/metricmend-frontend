"use client";

import { MessageSquare } from "lucide-react";
import type { MiraThread } from "@/lib/api/mira";

type Props = {
  thread: MiraThread;
  active: boolean;
  onClick: () => void;
};

export default function MiraConversationCard({
  thread,
  active,
  onClick,
}: Props) {
  const date = new Date(thread.updated_at || thread.created_at);

  return (
    <button
      onClick={onClick}
      className={[
        "w-full rounded-xl px-3 py-2.5 text-left transition-all",
        active
          ? "bg-slate-200/70 text-slate-950 shadow-sm dark:bg-white/[0.12] dark:text-white"
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.07]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            active
              ? "bg-white text-slate-900 dark:bg-white/[0.12] dark:text-white"
              : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400",
          ].join(" ")}
        >
          <MessageSquare className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {thread.title || "New Chat"}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
            {date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </button>
  );
}
