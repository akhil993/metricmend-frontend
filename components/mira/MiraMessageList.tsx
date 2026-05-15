"use client";

import { useEffect, useRef } from "react";

import type { MiraMessage } from "@/lib/api/mira";

import MiraMessageBubble from "./MiraMessageBubble";

type Props = {
  messages: MiraMessage[];
  sending: boolean;
  onDrilldown?: (message: string) => void;
  onSendMessage?: (message: string) => void;
};

export default function MiraMessageList({
  messages,
  sending,
  onDrilldown,
  onSendMessage,
}: Props) {
  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {messages.map((message) => (
          <MiraMessageBubble
            key={message.id}
            message={message}
            onDrilldown={onDrilldown}
            onSendMessage={onSendMessage}
            sending={sending}
          />
        ))}

        {sending ? (
          <div className="flex justify-start">
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              Mira is thinking...
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}