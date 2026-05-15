"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { MiraDrilldownPayload } from "@/components/mira/visuals/miraDrilldownUtils";
type Props = {
    visual: any;
    data: any[];
    onDrilldown?: (payload: MiraDrilldownPayload) => void;
    formatValue: (value: number | string, formatType: string) => string;
    formatLabel: (value: any) => string;
    formatType: string;
};

const CHART_COLORS = [
    "#6366f1",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#84cc16",
    "#f97316",
    "#0ea5e9",
    "#a855f7",
];

const CHART_GRID = "#94a3b8";

export default function MiraBarVisual({
    visual,
    data,
    onDrilldown,
    formatValue,
    formatLabel,
    formatType,
}: Props) {
    return (
        <div className="mt-4 h-[380px] w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                {visual.title || "Mira Result"}
            </p>

            <ResponsiveContainer width="100%" height="88%">
                <BarChart data={data} margin={{ top: 10, right: 24, left: 12, bottom: 34 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} opacity={0.28} />

                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={72} />

                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => formatValue(value, formatType)} />

                    <Tooltip
                        formatter={(value) => formatValue(value as number, formatType)}
                        labelFormatter={(label) => formatLabel(label)}
                    />

                    <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        cursor="pointer"
                        onClick={(entry: any) => {
                            onDrilldown?.({
                                dimension: visual?.dimension || visual?.x_axis || "category",
                                value: entry?.label ?? entry?.category,
                                row: entry?.raw ?? entry,
                                visual,
                            });
                        }}
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={`bar-cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}