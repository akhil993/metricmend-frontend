"use client";

type Props = {
  visual: any;
  formatValue: (
    value: number | string,
    formatType: string
  ) => string;
  formatType: string;
  data: any[];
  metadata?: any;
};

const TIME_PERIOD_LABELS: Record<string, string> = {
  TODAY: "Today",
  YESTERDAY: "Yesterday",
  THIS_WEEK: "This Week",
  LAST_WEEK: "Last Week",
  THIS_MONTH: "MTD",
  LAST_MONTH: "Last Month",
  THIS_QUARTER: "QTD",
  LAST_QUARTER: "Last Quarter",
  THIS_YEAR: "YTD",
  LAST_YEAR: "Last Year",
  YTD: "YTD",
  MTD: "MTD",
  QTD: "QTD",
  LAST_7_DAYS: "Last 7 Days",
  LAST_30_DAYS: "Last 30 Days",
  LAST_90_DAYS: "Last 90 Days",
  LAST_12_MONTHS: "Last 12 Months",
};

function titleize(value: string) {
  return value
    .replaceAll("_", " ")
    .trim()
    .replace(/\w\S*/g, (text) =>
      text.charAt(0).toUpperCase() +
      text.slice(1).toLowerCase()
    );
}

function businessMetricLabel(value: string) {
  const normalized = value
    .replaceAll("_", " ")
    .trim()
    .toLowerCase();

  const businessLabels: Record<string, string> = {
    "sales amount": "Sales",
    "total sales amount": "Sales",
    sales: "Sales",
    "revenue amount": "Revenue",
    "total revenue": "Revenue",
    revenue: "Revenue",
    "profit amount": "Profit",
    "gross profit": "Gross Profit",
    "net profit": "Net Profit",
    "order count": "Orders",
    orders: "Orders",
    "customer count": "Customers",
    customers: "Customers",
  };

  return businessLabels[normalized] || titleize(value);
}

export default function MiraCardVisual({
  visual,
  formatValue,
  formatType,
  data,
  metadata,
}: Props) {
  const rawMetric =
    visual?.metric_display_name ||
    metadata?.metric_display_name ||
    visual?.metric ||
    metadata?.metric ||
    visual?.title ||
    "Metric";

  const metricLabel = businessMetricLabel(String(rawMetric));

  const rawTimePeriod = metadata?.time_period
    ? String(metadata.time_period).toUpperCase()
    : null;

  const timePeriodLabel = rawTimePeriod
    ? TIME_PERIOD_LABELS[rawTimePeriod] || titleize(rawTimePeriod)
    : null;

  const title = timePeriodLabel
    ? `${metricLabel} ${timePeriodLabel}`
    : metricLabel;

  const subtitle = timePeriodLabel || "Current result";

  const firstRow = data?.[0] || {};

  const isComparison =
    firstRow.current_value !== undefined &&
    firstRow.previous_value !== undefined;

  if (isComparison) {
    const current = Number(firstRow.current_value || 0);
    const previous = Number(firstRow.previous_value || 0);
    const change = current - previous;

    const changePct =
      previous === 0
        ? null
        : (change / previous) * 100;

    const direction =
      change > 0
        ? "increase"
        : change < 0
          ? "decrease"
          : "flat";

    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Compared with same period last year
        </p>

        <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">
          {formatValue(current, formatType)}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prior year
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
              {formatValue(previous, formatType)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Change
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
              {formatValue(change, formatType)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              YoY
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
              {changePct === null
                ? "N/A"
                : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {direction === "increase"
            ? "Performance improved compared to the prior period."
            : direction === "decrease"
              ? "Performance declined compared to the prior period."
              : "Performance is unchanged compared to the prior period."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>

      <p className="mt-4 text-4xl font-semibold text-slate-950 dark:text-white">
        {formatValue(data?.[0]?.value ?? 0, formatType)}
      </p>
    </div>
  );
}