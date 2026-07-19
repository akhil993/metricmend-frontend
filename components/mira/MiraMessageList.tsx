"use client";

import { useEffect, useRef } from "react";

import type { MiraMessage } from "@/lib/api/mira";

import MiraMessageBubble from "./MiraMessageBubble";
import MiraThinkingSteps from "./MiraThinkingSteps";

type Props = {
  messages: MiraMessage[];
  sending: boolean;
  workspaceId?: string;
  userId?: string;
  threadId?: string;
  thinkingQuestion?: string | null;
  workspaceLabel?: string;
  modelName?: string | null;
  onDrilldown?: (executionPrompt: string, displayText?: string) => void;
  onSendMessage?: (message: string, displayText?: string) => void;
};

export default function MiraMessageList({
  messages,
  sending,
  workspaceId,
  userId,
  threadId,
  thinkingQuestion,
  workspaceLabel,
  modelName,
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
    <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7">
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

        {sending ? (
          <div className="flex justify-start">
            <MiraThinkingSteps
              question={thinkingQuestion || undefined}
              workspaceLabel={workspaceLabel}
              modelName={modelName}
            />
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
