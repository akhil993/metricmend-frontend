"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Brain,
    CheckCircle2,
    CircleDashed,
    Database,
    FileSearch,
    Gauge,
    LineChart,
    Route,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const iconRegistry = {
    reviewing_model: Database,
    building_context: FileSearch,
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

const enterpriseStepCopy: Record<string, { label: string; detail: string }> = {
    reviewing_model: {
        label: "Auditing governed model coverage",
        detail: "Checking certified tables, measures, dimensions, and access scope.",
    },
    building_context: {
        label: "Building business context",
        detail: "Reading semantic relationships, vocabulary, and prior conversation context.",
    },
    planning_intent: {
        label: "Classifying analytical intent",
        detail: "Separating greeting, KPI, diagnostic, comparison, and recommendation goals.",
    },
    resolving_time: {
        label: "Resolving reporting period",
        detail: "Aligning time windows with the model's governed date settings.",
    },
    resolving_metric: {
        label: "Resolving governed metric",
        detail: "Matching the business question to approved metric definitions.",
    },
    resolving_dimensions: {
        label: "Resolving business dimensions",
        detail: "Mapping requested breakdowns to governed dimensions and entities.",
    },
    resolving_filters: {
        label: "Validating filters and values",
        detail: "Normalizing user terms without inventing warehouse values.",
    },
    building_query: {
        label: "Planning governed evidence",
        detail: "Preparing the smallest safe analysis path for the question.",
    },
    running_query: {
        label: "Executing governed analysis",
        detail: "Running the approved semantic query and checking result shape.",
    },
    running_supporting_analysis: {
        label: "Testing supporting explanations",
        detail: "Looking for drivers, segments, trend breaks, and comparable context.",
    },
    generating_insights: {
        label: "Synthesizing business narrative",
        detail: "Turning evidence into observations, caveats, and decision context.",
    },
    preparing_actions: {
        label: "Preparing recommended next moves",
        detail: "Grounding actions in the evidence instead of generic advice.",
    },
    completed: {
        label: "Finalizing answer",
        detail: "Packaging the response with visuals, evidence, and follow-up paths.",
    },
};

const fallbackSteps = [
    {
        event: "reviewing_model",
        label: enterpriseStepCopy.reviewing_model.label,
        icon: Database,
        detail: enterpriseStepCopy.reviewing_model.detail,
    },
    {
        event: "building_context",
        label: enterpriseStepCopy.building_context.label,
        icon: FileSearch,
        detail: enterpriseStepCopy.building_context.detail,
    },
    {
        event: "resolving_metric",
        label: enterpriseStepCopy.resolving_metric.label,
        icon: ShieldCheck,
        detail: enterpriseStepCopy.resolving_metric.detail,
    },
    {
        event: "running_query",
        label: enterpriseStepCopy.running_query.label,
        icon: LineChart,
        detail: enterpriseStepCopy.running_query.detail,
    },
    {
        event: "running_supporting_analysis",
        label: enterpriseStepCopy.running_supporting_analysis.label,
        icon: LineChart,
        detail: enterpriseStepCopy.running_supporting_analysis.detail,
    },
    {
        event: "generating_insights",
        label: enterpriseStepCopy.generating_insights.label,
        icon: Brain,
        detail: enterpriseStepCopy.generating_insights.detail,
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
    detail: string;
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

    const enterpriseCopy = enterpriseStepCopy[event];

    const label =
        typeof item === "string"
            ? enterpriseCopy?.label || humanizeEvent(event)
            : enterpriseCopy?.label || item.label || humanizeEvent(event);

    const icon =
        event in iconRegistry
            ? iconRegistry[event as ProgressEventName]
            : Sparkles;

    return {
        event,
        label,
        detail:
            enterpriseCopy?.detail ||
            "Advancing the governed analysis workflow for this request.",
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
    const progressPercent = Math.max(
        12,
        Math.round(((activeIndex + 1) / displaySteps.length) * 100)
    );

    const contextItems = [
        workspaceLabel ? `Workspace: ${workspaceLabel}` : null,
        modelName ? `Model: ${modelName}` : null,
        question ? `Request: ${question}` : null,
    ].filter(Boolean);

    return (
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0f19]">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-white/10 dark:bg-white/[0.035]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                            <Route className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-950 dark:text-white">
                                MIRA analysis run
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                Governed evidence pipeline
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Governed path
                    </div>
                </div>
            </div>

            <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-white">
                        <ActiveIcon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold text-slate-950 dark:text-white">
                                {activeStep?.label || "Preparing analysis"}
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/[0.07] dark:text-slate-300">
                                <CircleDashed className="h-3 w-3 animate-spin" />
                                In progress
                            </span>
                        </div>

                        <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {activeStep?.detail || "Preparing governed evidence for this answer."}
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]">
                            <div
                                className="h-full rounded-full bg-slate-900 transition-all duration-500 dark:bg-white"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {contextItems.length ? (
                            <div className="mt-4 grid gap-2 md:grid-cols-3">
                                {contextItems.map((item) => (
                                    <div
                                        key={item}
                                        className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                                    >
                                        <span className="block truncate">{item}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {displaySteps.length > 1 ? (
                            <div className="mt-4 grid gap-2">
                                {visibleSteps.slice(-5).map((step, index, recentSteps) => {
                                    const isLatest = index === recentSteps.length - 1;
                                    const StepIcon = step.icon;

                                    return (
                                        <div
                                            key={`${step.event}-${index}`}
                                            className={[
                                                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs",
                                                isLatest
                                                    ? "bg-slate-100 text-slate-900 dark:bg-white/[0.07] dark:text-white"
                                                    : "text-slate-500 dark:text-slate-400",
                                            ].join(" ")}
                                        >
                                            {isLatest ? (
                                                <CircleDashed className="h-3.5 w-3.5 shrink-0 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                            )}
                                            <StepIcon className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}

                    <div className="mt-4 grid gap-2 border-t border-slate-200 pt-3 dark:border-white/10 md:grid-cols-3">
                        {[
                            {
                                label: "Semantic scope",
                                value: "Certified model context",
                                icon: Database,
                            },
                            {
                                label: "Evidence quality",
                                value: "Governed metrics only",
                                icon: ShieldCheck,
                            },
                            {
                                label: "Decision layer",
                                value: "Narrative and next steps",
                                icon: Gauge,
                            },
                        ].map((item) => {
                            const ItemIcon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="flex items-start gap-2 text-xs leading-5"
                                >
                                    <ItemIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                                    <span>
                                        <span className="block font-medium text-slate-700 dark:text-slate-200">
                                            {item.label}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            {item.value}
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
