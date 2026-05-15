import type React from "react";

export default function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
          : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}