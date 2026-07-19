"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Brain,
    CheckCircle2,
    Database,
    LineChart,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const iconRegistry = {
    reviewing_model: Database,
    building_context: Search,
    planning_intent: Brain,
    resolving_metric: ShieldCheck,
    resolving_dimensions: ShieldCheck,
    resolving_filters: Search,
    resolving_time: Search,
    building_query: Database,
    running_query: LineChart,
    running_supporting_analysis: LineChart,
    generating_insights: Brain,
    preparing_actions: Sparkles,
    completed: Sparkles,
};
const fallbackSteps = [
    {
        event: "reviewing_model",
        label: "Reviewing semantic model",
        icon: Database,
    },
    {
        event: "planning_intent",
        label: "Understanding request",
        icon: Brain,
    },
    {
        event: "resolving_metric",
        label: "Resolving metrics",
        icon: ShieldCheck,
    },
    {
        event: "running_query",
        label: "Running analysis",
        icon: LineChart,
    },
    {
        event: "running_supporting_analysis",
        label: "Checking supporting context",
        icon: LineChart,
    },
    {
        event: "generating_insights",
        label: "Generating insights",
        icon: Brain,
    },
];
type ProgressEventName = keyof typeof iconRegistry;

type ProgressEventItem =
    | ProgressEventName
    | {
        event?: string;
        label?: string;
    };

type NormalizedStep = {
    event: string;
    label: string;
    icon: React.ElementType;
};

type Props = {
    progressEvents?: ProgressEventItem[];
    question?: string;
    workspaceLabel?: string;
    modelName?: string | null;
};

function humanizeEvent(event: string) {
    return event
        .replace(/_/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeProgressEvent(item: ProgressEventItem): NormalizedStep | null {
    const event = typeof item === "string" ? item : item.event;

    if (!event) {
        return null;
    }

    const label =
        typeof item === "string"
            ? humanizeEvent(event)
            : item.label || humanizeEvent(event);

    const icon =
        event in iconRegistry
            ? iconRegistry[event as ProgressEventName]
            : Sparkles;

    return {
        event,
        label,
        icon,
    };
}

export default function MiraThinkingSteps({
    progressEvents,
    question,
    workspaceLabel,
    modelName,
}: Props) {
    const steps = useMemo(() => {
        return (progressEvents || [])
            .map(normalizeProgressEvent)
            .filter(Boolean) as NormalizedStep[];
    }, [progressEvents]);

    const displaySteps = steps.length ? steps : fallbackSteps;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);

        const interval = window.setInterval(() => {
            setActiveIndex((current) =>
                current >= displaySteps.length - 1 ? current : current + 1
            );
        }, 900);

        return () => window.clearInterval(interval);
    }, [displaySteps.length]);

    const activeStep = displaySteps[activeIndex] ?? displaySteps[0] ?? fallbackSteps[0];
    const ActiveIcon = activeStep?.icon || Sparkles;
    const visibleSteps = displaySteps.slice(0, activeIndex + 1);

    const contextItems = [
        workspaceLabel ? `Workspace: ${workspaceLabel}` : null,
        modelName ? `Model: ${modelName}` : null,
        question ? `Request: ${question}` : null,
    ].filter(Boolean);

    return (
        <div className="w-full max-w-4xl rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-200">
                    <ActiveIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Mira is analyzing
                        <span className="flex gap-1 text-indigo-500 dark:text-indigo-300">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-150" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-300" />
                        </span>
                    </div>

                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {activeStep?.label || "Preparing analysis"}
                    </div>

                    {contextItems.length ? (
                        <div className="mt-3 grid gap-2 md:grid-cols-3">
                            {contextItems.map((item) => (
                                <div
                                    key={item}
                                    className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                                >
                                    <span className="block truncate">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {displaySteps.length > 1 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {visibleSteps.slice(-4).map((step, index) => {
                                const isLatest = index === visibleSteps.slice(-4).length - 1;
                                return (
                                    <span
                                        key={`${step.event}-${index}`}
                                        className={[
                                            "rounded-full px-2.5 py-1 text-[11px] font-medium",
                                            isLatest
                                                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-100"
                                                : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400",
                                        ].join(" ")}
                                    >
                                        {step.label}
                                    </span>
                                );
                            })}
                        </div>
                    ) : null}

                    <div className="mt-4 grid gap-2 border-t border-slate-200 pt-3 dark:border-white/10 md:grid-cols-3">
                        {[
                            "Checking governed model context",
                            "Resolving safe metrics and filters",
                            "Preparing a trustworthy answer",
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400"
                            >
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
