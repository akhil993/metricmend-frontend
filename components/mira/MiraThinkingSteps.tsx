"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const stepCopy: Record<string, string> = {
    reviewing_model: "Reviewing semantic model",
    building_context: "Building business context",
    planning_intent: "Understanding request intent",
    resolving_time: "Checking time context",
    resolving_metric: "Resolving governed metric",
    resolving_dimensions: "Resolving business dimensions",
    resolving_filters: "Validating filters and values",
    building_query: "Planning governed evidence",
    running_query: "Executing governed analysis",
    running_supporting_analysis: "Testing supporting explanations",
    generating_insights: "Synthesizing business narrative",
    preparing_actions: "Preparing recommended next moves",
    completed: "Finalizing answer",
};

const FALLBACK_STEP_EVENTS = [
    "reviewing_model",
    "building_context",
    "resolving_metric",
    "running_query",
    "running_supporting_analysis",
    "generating_insights",
];

type ProgressEventItem =
    | string
    | {
        event?: string;
        label?: string;
        receivedAt?: number;
    };

type NormalizedStep = {
    event: string;
    label: string;
    receivedAt?: number;
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
            ? stepCopy[event] || humanizeEvent(event)
            : stepCopy[event] || item.label || humanizeEvent(event);

    return {
        event,
        label,
        receivedAt: typeof item === "object" ? item.receivedAt : undefined,
    };
}

export default function MiraThinkingSteps({
    progressEvents,
    question,
    workspaceLabel,
    modelName,
}: Props) {
    const liveSteps = useMemo(() => {
        return (progressEvents || [])
            .map(normalizeProgressEvent)
            .filter(Boolean) as NormalizedStep[];
    }, [progressEvents]);

    const isLive = liveSteps.length > 0;
    const [fallbackIndex, setFallbackIndex] = useState(0);

    useEffect(() => {
        if (isLive) {
            return;
        }

        setFallbackIndex(0);

        const interval = window.setInterval(() => {
            setFallbackIndex((current) =>
                current >= FALLBACK_STEP_EVENTS.length - 1 ? current : current + 1
            );
        }, 900);

        return () => window.clearInterval(interval);
    }, [isLive]);

    const displaySteps: NormalizedStep[] = isLive
        ? liveSteps
        : FALLBACK_STEP_EVENTS.slice(0, fallbackIndex + 1).map((event) => ({
            event,
            label: stepCopy[event] || humanizeEvent(event),
        }));

    const [expanded, setExpanded] = useState(false);
    const activeStep = displaySteps[displaySteps.length - 1];
    const startedAt = displaySteps[0]?.receivedAt;

    const contextLine = [
        workspaceLabel ? `Workspace: ${workspaceLabel}` : null,
        modelName ? `Model: ${modelName}` : null,
        question ? `"${question}"` : null,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="w-full max-w-2xl">
            <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="flex w-full items-center gap-2.5 rounded-full py-1.5 pl-1 pr-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                aria-expanded={expanded}
            >
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>

                <span className="min-w-0 flex-1 truncate text-sm text-slate-600 dark:text-slate-300">
                    {activeStep?.label || "Preparing analysis"}
                    <span className="ml-0.5 inline-block w-[1.5ch] animate-pulse">…</span>
                </span>

                {expanded ? (
                    <ChevronUp className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                )}
            </button>

            {expanded ? (
                <div className="mt-1 pl-1">
                    {contextLine ? (
                        <p className="mb-3 truncate pl-[26px] text-xs text-slate-400 dark:text-slate-500">
                            {contextLine}
                        </p>
                    ) : null}

                    <div>
                        {displaySteps.map((step, index) => {
                            const isActive = index === displaySteps.length - 1;
                            const isLast = index === displaySteps.length - 1;

                            const elapsed =
                                isLive &&
                                    step.receivedAt !== undefined &&
                                    startedAt !== undefined
                                    ? `${((step.receivedAt - startedAt) / 1000).toFixed(1)}s`
                                    : null;

                            return (
                                <div
                                    key={`${step.event}-${index}`}
                                    className="relative flex gap-2.5 pb-3.5 last:pb-0"
                                >
                                    {!isLast ? (
                                        <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200 dark:bg-white/10" />
                                    ) : null}

                                    <span
                                        className={[
                                            "relative z-10 mt-1 flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full",
                                            isActive
                                                ? "bg-cyan-500"
                                                : "bg-slate-300 dark:bg-white/20",
                                        ].join(" ")}
                                    >
                                        {isActive ? (
                                            <span className="absolute h-full w-full rounded-full bg-cyan-500 opacity-60 animate-ping" />
                                        ) : (
                                            <Check className="h-2 w-2 text-white" strokeWidth={3} />
                                        )}
                                    </span>

                                    <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                                        <span
                                            className={[
                                                "truncate text-sm",
                                                isActive
                                                    ? "font-medium text-slate-900 dark:text-white"
                                                    : "text-slate-500 dark:text-slate-400",
                                            ].join(" ")}
                                        >
                                            {step.label}
                                        </span>

                                        {elapsed ? (
                                            <span className="shrink-0 text-xs tabular-nums text-slate-400 dark:text-slate-500">
                                                {elapsed}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
