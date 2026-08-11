"use client";

import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Download,
  FileDown,
  Lightbulb,
  MoreHorizontal,
  Save,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";

export type MiraActionKey =
  | "save_insight"
  | "share_workspace"
  | "export_visual"
  | "export_table"
  | "create_dashboard_card"
  | "root_cause_analysis"
  | "executive_summary";

type Props = {
  onAction: (action: MiraActionKey) => void;
  disabled?: boolean;
  loadingAction?: MiraActionKey | null;
};

type ActionDef = {
  key: MiraActionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const primaryActions: ActionDef[] = [
  {
    key: "root_cause_analysis",
    label: "Investigate drivers",
    icon: Target,
    description: "Run a governed driver analysis",
  },
  {
    key: "executive_summary",
    label: "Create executive brief",
    icon: Sparkles,
    description: "Summarize impact, risk, and next moves",
  },
];

const moreActions: ActionDef[] = [
  { key: "save_insight", label: "Save insight", icon: Save, description: "Add this result to the insight library" },
  { key: "share_workspace", label: "Share analysis", icon: Share2, description: "Create a workspace share link" },
  {
    key: "export_visual",
    label: "Export Visual",
    icon: Download,
    description: "Download the visual artifact",
  },
  {
    key: "export_table",
    label: "Export Table",
    icon: FileDown,
    description: "Download the underlying result rows",
  },
  {
    key: "create_dashboard_card",
    label: "Dashboard Card",
    icon: BarChart3,
    description: "Pin this analysis to a dashboard",
  },
];

function ActionButton({
  action,
  disabled,
  loadingAction,
  onAction,
}: {
  action: ActionDef;
  disabled: boolean;
  loadingAction: MiraActionKey | null;
  onAction: (action: MiraActionKey) => void;
}) {
  const Icon = action.icon;
  const isLoading = loadingAction === action.key;

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={() => onAction(action.key)}
      className="
        inline-flex items-center gap-2 rounded-xl
        border border-cyan-500/20 bg-gradient-to-b from-white to-cyan-50/50 px-3.5 py-2.5
        text-xs font-semibold text-slate-800 shadow-sm
        transition hover:-translate-y-0.5 hover:border-cyan-500/35 hover:shadow-md
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-cyan-300/15 dark:bg-gradient-to-b dark:from-white/[0.07] dark:to-cyan-400/[0.04]
        dark:text-slate-200 dark:hover:border-white/20
        dark:hover:bg-white/[0.08]
      "
    >
      <Icon className="h-3.5 w-3.5" />
      {isLoading ? "Working..." : action.label}
    </button>
  );
}

export default function MiraActions({
  onAction,
  disabled = false,
  loadingAction = null,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeMoreAction = moreActions.find(
    (action) => action.key === loadingAction,
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {primaryActions.map((action) => (
        <ActionButton
          key={action.key}
          action={action}
          disabled={disabled}
          loadingAction={loadingAction}
          onAction={onAction}
        />
      ))}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setMenuOpen((current) => !current)}
          className="
            inline-flex items-center gap-1.5 rounded-xl
            border border-slate-200 bg-white px-3 py-2
            text-xs font-semibold text-slate-700 shadow-sm
            transition hover:-translate-y-0.5 hover:border-slate-300
            hover:bg-slate-50 hover:shadow-md
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-white/10 dark:bg-white/[0.045]
            dark:text-slate-200 dark:hover:border-white/20
            dark:hover:bg-white/[0.08]
          "
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
          {activeMoreAction ? "Working..." : "Save, share & export"}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {menuOpen ? (
          <div className="absolute left-0 z-10 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#0b1020]">
            {moreActions.map((action) => {
              const Icon = action.icon;
              const isLoading = loadingAction === action.key;

              return (
                <button
                  key={action.key}
                  type="button"
                  disabled={disabled || isLoading}
                  onClick={() => {
                    setMenuOpen(false);
                    onAction(action.key);
                  }}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-white/[0.06]"
                >
                  <Icon className="mt-0.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span>
                    <span className="block text-sm font-medium">{isLoading ? "Working..." : action.label}</span>
                    {action.description ? <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">{action.description}</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
