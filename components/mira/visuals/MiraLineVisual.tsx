"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  visual: any;
  data: any[];
  formatValue: (value: number | string, formatType: string) => string;
  formatLabel: (value: any) => string;
  formatType: string;
};

const CHART_COLOR = "#6366f1";
const CHART_GRID = "#94a3b8";

export default function MiraLineVisual({
  visual,
  data,
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
        <LineChart data={data} margin={{ top: 10, right: 24, left: 12, bottom: 34 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} opacity={0.28} />

          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={72} />

          <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => formatValue(value, formatType)} />

          <Tooltip
            formatter={(value) => formatValue(value as number, formatType)}
            labelFormatter={(label) => formatLabel(label)}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLOR}
            strokeWidth={3}
            dot={{ r: 3, fill: CHART_COLOR }}
            activeDot={{ r: 6, fill: CHART_COLOR }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}