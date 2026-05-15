"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowUp } from "lucide-react";

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

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      submit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition dark:border-white/10 dark:bg-white/[0.05]"
    >
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        rows={1}
        onChange={(event) =>
          setValue(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white dark:placeholder:text-slate-500"
      />

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </form>
  );
}