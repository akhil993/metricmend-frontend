"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUp, Sparkles } from "lucide-react";

type Props = {
  disabled?: boolean;
  placeholder?: string;
  onSend: (message: string) => void;
};

export default function MiraInputBar({
  disabled,
  placeholder,
  onSend,
}: Props) {
  const [value, setValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  function submit() {
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);

    setValue("");

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition focus-within:border-cyan-400/60 focus-within:shadow-[0_22px_60px_rgba(8,145,178,0.14)] dark:border-white/10 dark:bg-[#0f172a] dark:shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-end gap-2">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/[0.08] dark:text-slate-300 sm:flex">
          <Sparkles className="h-4 w-4" />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          rows={1}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-[15px] leading-6 text-slate-950 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-50 dark:placeholder:text-slate-500"
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:disabled:bg-white/10 dark:disabled:text-slate-600"
          aria-label="Send message"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
