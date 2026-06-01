"use client";

import { useEffect, useRef } from "react";

import type { MiraMessage } from "@/lib/api/mira";

import MiraMessageBubble from "./MiraMessageBubble";

type Props = {
  messages: MiraMessage[];
  sending: boolean;
  workspaceId?: string;
  userId?: string;
  threadId?: string;
  onDrilldown?: (executionPrompt: string, displayText?: string) => void;
  onSendMessage?: (message: string, displayText?: string) => void;
};

export default function MiraMessageList({
  messages,
  sending,
  workspaceId,
  userId,
  threadId,
  onDrilldown,
  onSendMessage,
}: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
            workspaceId={workspaceId}
            userId={userId}
            threadId={threadId}
            onDrilldown={onDrilldown}
            onSendMessage={onSendMessage}
            sending={sending}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}