import type { SemanticMetric } from "@/lib/api/metrics";


export type ModelColumn = {
  id: string;
  model_id?: string;
  model_table_id?: string;
  table_id?: string;
  table_name?: string | null;
  source_table?: string | null;
  source_table_name?: string | null;
  semantic_table_name?: string | null;
  source_column?: string | null;
  column_name?: string | null;
  display_name?: string | null;
  name?: string | null;
  data_type?: string | null;
  column_type?: string | null;
  type?: string | null;
};

export type ModelTable = {
  id: string;
  source_table?: string | null;
  display_name?: string | null;
  table_name?: string | null;
  name?: string | null;
  source_table_name?: string | null;
  table_role?: string | null;
  role?: string | null;
  
};

export const FORMULA_EXAMPLES = [
  "SUM(fact_sales.sales_amount)",
  "SUM(fact_sales.sales_amount - fact_sales.discount_amount)",
  "DISTINCTCOUNT(fact_sales.order_id)",
  "COUNTROWS(fact_sales)",
  "[Revenue] / [Order Count]",
  "SAFE_DIVIDE([Revenue], [Order Count])",
  'CALCULATE([Revenue], dim_customer.region = "West")',
  "IF([Revenue] > 100000, [Revenue], 0)",
];

export const FUNCTIONS = [
  "SUM(column)",
  "AVG(column)",
  "MIN(column)",
  "MAX(column)",
  "COUNT(column)",
  "DISTINCTCOUNT(column)",
  "COUNTROWS(table)",
  "SAFE_DIVIDE(numerator, denominator)",
  "ROUND(value, decimals)",
  "ABS(value)",
  "CALCULATE(metric, filter)",
  "IF(condition, true_value, false_value)",
];

export function getTableName(table: ModelTable) {
  return (
    table.source_table ||
    table.display_name ||
    table.table_name ||
    table.name ||
    table.source_table_name ||
    "unknown_table"
  );
}

export function getTableRole(table: ModelTable) {
  return (table.table_role || table.role || "").toLowerCase();
}

export function getColumnName(column: ModelColumn) {
  return (
    column.source_column ||
    column.display_name ||
    column.column_name ||
    column.name ||
    "unknown_column"
  );
}

export function getColumnTableId(column: ModelColumn) {
  return column.model_table_id || column.table_id || null;
}

export function getColumnDataType(column: ModelColumn) {
  return column.data_type || column.column_type || column.type || "unknown";
}

export function getColumnTableName(
  column: ModelColumn,
  tableLookup: Map<string, ModelTable>
) {
  const tableId = getColumnTableId(column);

  if (tableId) {
    const table = tableLookup.get(tableId);

    if (table) {
      return getTableName(table);
    }
  }

  return (
    column.source_table ||
    column.table_name ||
    column.source_table_name ||
    column.semantic_table_name ||
    "unknown_table"
  );
}

export function buildCompletionItems({
  modelTables,
  modelColumns,
  metrics,
  tableLookup,
  monaco,
  range,
}: {
  modelTables: ModelTable[];
  modelColumns: ModelColumn[];
  metrics: SemanticMetric[];
  tableLookup: Map<string, ModelTable>;
  monaco: any;
  range: any;
}) {
  const suggestions: any[] = [];

  for (const table of modelTables) {
    const tableName = getTableName(table);

    suggestions.push({
      label: tableName,
      kind: monaco.languages.CompletionItemKind.Class,
      insertText: tableName,
      detail: "Semantic Table",
      range,
    });
  }

  for (const column of modelColumns) {
    const tableName = getColumnTableName(column, tableLookup);
    const columnName = getColumnName(column);

    suggestions.push({
      label: `${tableName}.${columnName}`,
      kind: monaco.languages.CompletionItemKind.Field,
      insertText: `${tableName}.${columnName}`,
      detail: getColumnDataType(column),
      range,
    });
  }

  for (const metric of metrics) {
    suggestions.push({
      label: `[${metric.name}]`,
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: `[${metric.name}]`,
      detail: "Metric",
      range,
    });
  }

  for (const fn of FUNCTIONS) {
    suggestions.push({
      label: fn,
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: fn,
      detail: "Function",
      range,
    });
  }

  return suggestions;
}