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

export default function MiraCardVisual({
  visual,
  formatValue,
  formatType,
  data,
  metadata,
}: Props) {
  const metric =
    visual?.metric ||
    metadata?.metric ||
    visual?.title ||
    "Metric";

  const timePeriod = metadata?.time_period
    ? String(metadata.time_period).toUpperCase()
    : null;

  const title = timePeriod
    ? `${String(metric).replaceAll("_", " ")} ${timePeriod}`
    : String(metric).replaceAll("_", " ");

  const subtitle =
    metadata?.is_governed
      ? "Governed semantic result"
      : "Mira result";

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