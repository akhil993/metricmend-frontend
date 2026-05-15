export function getTableRows(visual: any) {
  const rows = Array.isArray(visual?.data) ? visual.data : [];
  return rows.map((row: any) => row?.raw ?? row);
}

export function getTableColumns(visual: any, rows: any[]) {
  if (Array.isArray(visual?.columns) && visual.columns.length) {
    return visual.columns;
  }

  if (!rows.length) return [];

  return Object.keys(rows[0]);
}

export function prettifyColumn(column: string) {
  return column.replaceAll("_", " ");
}

export function formatCellValue(value: any) {
  if (value === null || value === undefined || value === "") return "—";

  const raw = String(value);

  if (raw.includes("T")) return raw.slice(0, 10);
  if (raw.length >= 10 && raw.includes("-")) return raw.slice(0, 10);

  return raw;
}

export function sortRows(rows: any[], column: string, direction: "asc" | "desc") {
  return [...rows].sort((a, b) => {
    const aValue = a?.[column];
    const bValue = b?.[column];

    const aNumber = Number(aValue);
    const bNumber = Number(bValue);

    let comparison = 0;

    if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) {
      comparison = aNumber - bNumber;
    } else {
      comparison = String(aValue ?? "").localeCompare(String(bValue ?? ""));
    }

    return direction === "asc" ? comparison : -comparison;
  });
}

export function rowsToCsv(rows: any[], columns: string[]) {
  const escapeCsv = (value: any) => {
    const text = String(value ?? "");
    const escaped = text.replaceAll('"', '""');
    return `"${escaped}"`;
  };

  const header = columns.map(escapeCsv).join(",");

  const body = rows.map((row) =>
    columns.map((column) => escapeCsv(row?.[column])).join(",")
  );

  return [header, ...body].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}