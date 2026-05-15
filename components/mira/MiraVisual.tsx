"use client";

import MiraBarVisual from "@/components/mira/visuals/MiraBarVisual";
import MiraCardVisual from "@/components/mira/visuals/MiraCardVisual";
import MiraLineVisual from "@/components/mira/visuals/MiraLineVisual";
import MiraTableVisual from "@/components/mira/visuals/MiraTableVisual";
import type { MiraDrilldownPayload } from "@/components/mira/visuals/miraDrilldownUtils";

type Props = {
  visual: any;
  metadata?: any;
  onDrilldown?: (payload: MiraDrilldownPayload) => void;
};

const MAX_CHART_ROWS = 12;

function normalizeText(value: any) {
  return String(value ?? "").toLowerCase();
}

function inferFormatType(visual: any, metadata: any, data: any[]) {
  const searchable = [
    metadata?.format_type,
    metadata?.metric,
    metadata?.dimension,
    visual?.format_type,
    visual?.metric,
    visual?.title,
    visual?.x_axis,
    visual?.y_axis,
    data?.[0] ? Object.keys(data[0]).join(" ") : "",
  ]
    .map(normalizeText)
    .join(" ");

  if (
    ["percent", "percentage", "pct", "rate", "ratio"].some((hint) =>
      searchable.includes(hint)
    )
  ) {
    return "percent";
  }

  if (
    [
      "sales",
      "revenue",
      "amount",
      "price",
      "profit",
      "cost",
      "discount",
      "spend",
      "sales_amount",
    ].some((hint) => searchable.includes(hint))
  ) {
    return "currency";
  }

  return "number";
}

function formatValue(value: number | string, formatType: string) {
  const numeric = typeof value === "number" ? value : Number(value);

  if (Number.isNaN(numeric)) return String(value ?? "");

  if (formatType === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(numeric);
  }

  if (formatType === "percent") {
    return `${numeric.toFixed(2)}%`;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(numeric);
}

function formatLabel(value: any) {
  if (value === null || value === undefined) return "";

  const raw = String(value);

  if (raw.includes("T")) return raw.slice(0, 10);
  if (raw.length >= 10 && raw.includes("-")) return raw.slice(0, 10);

  return raw;
}

function normalizeData(data: any[]) {
  if (!Array.isArray(data)) return [];

  return data.map((row, index) => {
    const raw = row?.raw ?? row;

    const label =
      row.label ??
      row.period ??
      row.month ??
      row.date ??
      row.category ??
      row.customer ??
      row.product ??
      row.state ??
      row.name ??
      raw?.label ??
      raw?.period ??
      raw?.month ??
      raw?.date ??
      raw?.category ??
      raw?.customer ??
      raw?.product ??
      raw?.state ??
      raw?.name ??
      `Item ${index + 1}`;

    const value =
      row.value ??
      row.revenue ??
      row.sales ??
      row.sales_amount ??
      row.amount ??
      row.total ??
      row.count ??
      raw?.value ??
      raw?.revenue ??
      raw?.sales ??
      raw?.sales_amount ??
      raw?.amount ??
      raw?.total ??
      raw?.count ??
      0;

    return {
      ...row,
      raw,
      label: formatLabel(label),
      value: Number(value),
    };
  });
}

export default function MiraVisual({ visual, metadata, onDrilldown }: Props) {
  if (!visual) return null;

  if (visual.type === "table") {
    return <MiraTableVisual visual={visual} onDrilldown={onDrilldown} />;
  }

  const data = normalizeData(visual.data);
  const chartData = data.slice(0, MAX_CHART_ROWS);
  const formatType = inferFormatType(visual, metadata, data);

  if (visual.type === "card") {
    return (
      <MiraCardVisual
        visual={visual}
        data={data}
        formatType={formatType}
        formatValue={formatValue}
        metadata={metadata}
      />
    );
  }

  if (visual.type === "line") {
    return (
      <MiraLineVisual
        visual={visual}
        data={chartData}
        formatType={formatType}
        formatValue={formatValue}
        formatLabel={formatLabel}
      />
    );
  }

  return (
    <MiraBarVisual
  visual={visual}
  data={chartData}
  formatType={formatType}
  formatValue={formatValue}
  formatLabel={formatLabel}
  onDrilldown={onDrilldown}
/>
  );
}