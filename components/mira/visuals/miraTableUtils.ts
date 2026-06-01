export function getTableRows(visual: any) {
  const data = visual?.data || [];
  const metadata = visual?.metadata || {};

  return data.map((row: any) => {
    const raw = row?.raw || row;

    const category =
      row?.category ??
      raw?.category ??
      row?.label ??
      raw?.label ??
      raw?.[metadata.display_column];

    const categoryKey =
      row?.category_key ??
      raw?.category_key ??
      row?.value_key ??
      raw?.value_key ??
      raw?.[metadata.key_column];

    return {
      ...raw,
      category,
      category_key: categoryKey,
      key_column: row?.key_column ?? raw?.key_column ?? metadata.key_column,
      value: row?.value ?? raw?.value,
      raw,
    };
  });
}

export function getTableColumns(visual: any, rows: any[]) {
  const metadata = visual?.metadata || {};

  if (Array.isArray(visual?.columns) && visual.columns.length) {
    return visual.columns.filter(
      (column: string) =>
        column !== "raw" &&
        column !== "key_column"
    );
  }

  if (!rows.length) return [];

  const columns = Object.keys(rows[0]).filter(
    (column) =>
      column !== "raw" &&
      column !== "key_column"
  );

  const ordered = ["category_key", "category", "value"].filter((column) =>
    columns.includes(column),
  );

  return [
    ...ordered,
    ...columns.filter((column) => !ordered.includes(column)),
  ];
}

export function formatColumnLabel(column: string, metadata?: any) {
  const visualMetadata = metadata?.visual_payload?.metadata || metadata || {};
  const resolved =
    metadata?.semantic_context?.resolved_entity ||
    metadata?.resolved_entities ||
    {};

  if (column === "category_key" || column === "value_key") {
    return visualMetadata.key_column || resolved.key_column || "ID";
  }

  if (column === "category") {
    return (
      visualMetadata.display_column ||
      visualMetadata.display_label ||
      resolved.dimension_label ||
      visualMetadata.dimension ||
      "Dimension"
    );
  }

  if (column === "value") {
    return resolved.metric_label || "Value";
  }

  return column
    .replaceAll("_", " ")
    .replace(/\w\S*/g, (text) =>
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    );
}

export function formatCellValue(value: any, column?: string) {
  if (value === null || value === undefined || value === "") return "—";

  const numeric = Number(value);

  if (!Number.isNaN(numeric) && typeof value !== "boolean") {
    const rounded = Math.round((numeric + Number.EPSILON) * 100) / 100;

    if (
      column === "value" ||
      column?.includes("revenue") ||
      column?.includes("sales") ||
      column?.includes("amount")
    ) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(rounded);
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(rounded);
  }

  return String(value);
}

export function rowsToCsv(rows: any[], columns: string[]) {
  const escapeCsv = (value: any) => {
    const text = String(value ?? "");

    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
      return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
  };

  const exportColumns = columns.filter(
    (column) =>
      column !== "raw" &&
      column !== "key_column"
  );

  const header = exportColumns.map(escapeCsv).join(",");

  const body = rows
    .map((row) =>
      exportColumns
        .map((column) => escapeCsv(row?.[column]))
        .join(",")
    )
    .join("\n");

  return [header, body].filter(Boolean).join("\n");
}