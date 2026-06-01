"use client";

import {
  BarChart3,
  Download,
  FileDown,
  Lightbulb,
  Save,
  Share2,
  Sparkles,
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

const actions: {
  key: MiraActionKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "save_insight",
    label: "Save Insight",
    icon: Save,
  },
  {
    key: "share_workspace",
    label: "Share",
    icon: Share2,
  },
  {
    key: "export_visual",
    label: "Export Visual",
    icon: Download,
  },
  {
    key: "export_table",
    label: "Export Table",
    icon: FileDown,
  },
  {
    key: "create_dashboard_card",
    label: "Dashboard Card",
    icon: BarChart3,
  },
  {
    key: "root_cause_analysis",
    label: "Root Cause",
    icon: Sparkles,
  },
  {
    key: "executive_summary",
    label: "Executive Summary",
    icon: Lightbulb,
  },
];

export default function MiraActions({
  onAction,
  disabled = false,
  loadingAction = null,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const isLoading = loadingAction === action.key;

        return (
          <button
            key={action.key}
            type="button"
            disabled={disabled || isLoading}
            onClick={() => onAction(action.key)}
            className="
              inline-flex items-center gap-2 rounded-full
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
            <Icon className="h-3.5 w-3.5" />
            {isLoading ? "Working..." : action.label}
          </button>
        );
      })}
    </div>
  );
}