"use client";

import { Monitor, Moon, Sun, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";

type Props = {
  workspaceName?: string | null;
};

export default function AppHeaderControls({ workspaceName }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
        {workspaceName || "Workspace"}
      </div>

      <div className="flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/5">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`rounded-full p-1.5 ${
            theme === "light"
              ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`rounded-full p-1.5 ${
            theme === "dark"
              ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Moon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`rounded-full p-1.5 ${
            theme === "system"
              ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      >
        <UserCircle className="h-4 w-4" />
      </button>
    </div>
  );
}