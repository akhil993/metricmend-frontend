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
        "w-full rounded-2xl border p-3 text-left transition-all",
        active
          ? "border-indigo-300/40 bg-indigo-50 shadow-sm dark:border-indigo-400/40 dark:bg-indigo-500/15"
          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
            active
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-200"
              : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
          ].join(" ")}
        >
          <MessageSquare className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={[
              "truncate text-sm font-medium",
              active
                ? "text-slate-950 dark:text-white"
                : "text-slate-700 dark:text-slate-100",
            ].join(" ")}
          >
            {thread.title || "New Chat"}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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