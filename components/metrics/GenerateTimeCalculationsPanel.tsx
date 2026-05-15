"use client";

import { useMemo, useState } from "react";
import {
    CalendarClock,
    Check,
    Loader2,
    Sparkles,
} from "lucide-react";

import type { SemanticMetric } from "@/lib/api/metrics";
import { generateTimeCalculations } from "@/lib/api/timeIntelligence";

type Props = {
    workspaceId: string;
    modelId: string;
    metrics: SemanticMetric[];
    onGenerated?: (metrics: SemanticMetric[]) => void;
};

const TIME_CALC_OPTIONS = [
    {
        key: "ytd",
        label: "Year to Date (YTD)",
    },
    {
        key: "mtd",
        label: "Month to Date (MTD)",
    },
    {
        key: "qtd",
        label: "Quarter to Date (QTD)",
    },
    {
        key: "rolling_30_days",
        label: "Rolling 30 Days",
    },
    {
        key: "rolling_3_months",
        label: "Rolling 3 Months",
    },
    {
        key: "prior_period",
        label: "Prior Period",
    },
    {
        key: "yoy",
        label: "Year over Year",
    },
];



export default function GenerateTimeCalculationsPanel({
    workspaceId,
    modelId,
    metrics,
    onGenerated,
}: Props) {
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
    const [selectedCalcs, setSelectedCalcs] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);

    const eligibleMetrics = useMemo(() => {
        return metrics.filter(
            (metric) =>
                metric.metric_type === "base" ||
                metric.metric_type === "calculated"
        );
    }, [metrics]);

    function toggleMetric(metricId: string) {
        setSelectedMetrics((prev) =>
            prev.includes(metricId)
                ? prev.filter((id) => id !== metricId)
                : [...prev, metricId]
        );
    }

    function toggleCalc(calc: string) {
        setSelectedCalcs((prev) =>
            prev.includes(calc)
                ? prev.filter((item) => item !== calc)
                : [...prev, calc]
        );
    }

    async function handleGenerate() {
        setMessage(null);
        setWarnings([]);
        setIsGenerating(true);

        try {
            const result = await generateTimeCalculations({
                workspace_id: workspaceId,
                model_id: modelId,
                metric_ids: selectedMetrics,
                calculation_types: selectedCalcs,
            });

            setMessage(
                result.generated_metrics.length
                    ? `Generated ${result.generated_metrics.length} time intelligence metrics.`
                    : "No new metrics generated."
            );

            setWarnings(result.warnings ?? []);

            setSelectedMetrics([]);
            setSelectedCalcs([]);

            onGenerated?.(
                result.generated_metrics.map(
                    (item) =>
                        ({
                            id: item.metric_id || crypto.randomUUID(),
                            workspace_id: workspaceId,
                            model_id: modelId,
                            name: item.generated_metric_name,
                            display_name: item.generated_display_name,
                            description: item.explanation,
                            metric_type: "time_intelligence",
                            aggregation_type: null,
                            source_table_id: null,
                            source_column_id: null,
                            expression: item.formula,
                            user_formula: item.formula,
                            expression_json: {
                                type: "time_intelligence",
                                calculation_type: item.calculation_type,
                                base_metric_name: item.metric_name,
                            },
                            format_type: "number",
                            status: "draft",
                        }) as SemanticMetric
                )
            );
        } catch (error) {
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to generate time intelligence metrics."
            );
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />

                        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                            Generate Time Calculations
                        </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Select metrics on the left, then choose the time calculations to
                        generate.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedMetrics.length || !selectedCalcs.length}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    Generate
                </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]">
                <div className="border-b border-slate-200 p-5 dark:border-white/10 lg:border-b-0 lg:border-r">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Available Metrics
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                                {selectedMetrics.length} selected
                            </div>
                        </div>

                        {eligibleMetrics.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedMetrics.length === eligibleMetrics.length) {
                                        setSelectedMetrics([]);
                                    } else {
                                        setSelectedMetrics(eligibleMetrics.map((metric) => metric.id));
                                    }
                                }}
                                className="text-xs font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                            >
                                {selectedMetrics.length === eligibleMetrics.length
                                    ? "Clear all"
                                    : "Select all"}
                            </button>
                        )}
                    </div>

                    <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
                        {eligibleMetrics.length ? (
                            eligibleMetrics.map((metric) => {
                                const active = selectedMetrics.includes(metric.id);

                                return (
                                    <button
                                        key={metric.id}
                                        type="button"
                                        onClick={() => toggleMetric(metric.id)}
                                        className={[
                                            "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition",
                                            active
                                                ? "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-500/10"
                                                : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]",
                                        ].join(" ")}
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                                {metric.display_name ?? metric.name}
                                            </div>

                                            <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                                <span>{metric.metric_type}</span>
                                                <span>•</span>
                                                <span>{metric.format_type ?? "number"}</span>
                                            </div>
                                        </div>

                                        <span
                                            className={[
                                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                                                active
                                                    ? "border-cyan-500 bg-cyan-600 text-white dark:border-cyan-400 dark:bg-cyan-500"
                                                    : "border-slate-300 text-transparent dark:border-white/20",
                                            ].join(" ")}
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                        </span>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                                No eligible base or calculated metrics found.
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-5 p-5">
                    <div>
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Time Calculation Types
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            {TIME_CALC_OPTIONS.map((calc) => {
                                const active = selectedCalcs.includes(calc.key);

                                return (
                                    <button
                                        key={calc.key}
                                        type="button"
                                        onClick={() => toggleCalc(calc.key)}
                                        className={[
                                            "flex items-center justify-between rounded-xl border px-3 py-3 text-left transition",
                                            active
                                                ? "border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-500/10"
                                                : "border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]",
                                        ].join(" ")}
                                    >
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                            {calc.label}
                                        </span>

                                        {active && (
                                            <Check className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            Generation Summary
                        </div>
                        {message ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                                {message}
                            </div>
                        ) : null}

                        {warnings.length ? (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
                                <div className="font-semibold">Warnings</div>
                                <div className="mt-1 space-y-1">
                                    {warnings.map((warning) => (
                                        <div key={warning}>{warning}</div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {selectedMetrics.length} metrics selected • {selectedCalcs.length}{" "}
                            calculation types selected
                        </div>

                        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            This will create up to{" "}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {selectedMetrics.length * selectedCalcs.length}
                            </span>{" "}
                            generated time intelligence metrics.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}