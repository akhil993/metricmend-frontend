"use client";

import {
    BookmarkPlus,
    Download,
    FileSpreadsheet,
    LayoutDashboard,
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
};

const ACTIONS: {
    key: MiraActionKey;
    label: string;
    icon: React.ElementType;
}[] = [
        {
            key: "save_insight",
            label: "Save Insight",
            icon: BookmarkPlus,
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
            icon: FileSpreadsheet,
        },
        {
            key: "create_dashboard_card",
            label: "Dashboard Card",
            icon: LayoutDashboard,
        },
        {
            key: "root_cause_analysis",
            label: "Root Cause",
            icon: Target,
        },
        {
            key: "executive_summary",
            label: "Executive Summary",
            icon: Sparkles,
        },
    ];

export default function MiraActions({ onAction, disabled = false }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                    <button
                        key={action.key}
                        type="button"
                        disabled={disabled}
                        onClick={() => onAction(action.key)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-indigo-300/30 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-100 dark:disabled:hover:bg-white/[0.05] dark:disabled:hover:text-slate-200"
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {action.label}
                    </button>
                );
            })}
        </div>
    );
}