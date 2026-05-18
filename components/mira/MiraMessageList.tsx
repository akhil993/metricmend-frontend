"use client";

import { useEffect, useRef } from "react";

import type { MiraMessage } from "@/lib/api/mira";

import MiraMessageBubble from "./MiraMessageBubble";
import MiraThinkingSteps from "@/components/mira/MiraThinkingSteps";

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

  const latestProgressEvents = [...messages]
    .reverse()
    .map((message) => {
      const messageWithProgress = message as MiraMessage & {
        progress_events?: unknown[];
        metadata?: {
          progress_events?: unknown[];
        } | null;
      };

      return (
        messageWithProgress.progress_events ||
        messageWithProgress.metadata?.progress_events ||
        []
      );
    })
    .find((events) => Array.isArray(events) && events.length > 0);

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
            <MiraThinkingSteps
              progressEvents={latestProgressEvents as never}
            />
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}