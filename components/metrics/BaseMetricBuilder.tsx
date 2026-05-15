"use client";

import { useMemo, useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { createMetric, MetricType } from "@/lib/api/metrics";

type ExpressionToken =
  | {
      type: "column";
      id: string;
      label: string;
    }
  | {
      type: "operator";
      value: "+" | "-" | "*" | "/";
    }
  | {
      type: "number";
      value: number;
    };

type Props = {
  model: any;
  onCreated: () => void;
};

const AGGREGATIONS = [
  { label: "Sum", value: "SUM" },
  { label: "Average", value: "AVG" },
  { label: "Minimum", value: "MIN" },
  { label: "Maximum", value: "MAX" },
  { label: "Distinct Count", value: "COUNT_DISTINCT" },
  { label: "Row Count", value: "ROW_COUNT" },
];

const FORMATS = [
  { label: "Number", value: "number" },
  { label: "Currency", value: "currency" },
  { label: "Percent", value: "percent" },
  { label: "Decimal", value: "decimal" },
  { label: "Integer", value: "integer" },
];

function normalizeMetricName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

function buildExpressionAst(tokens: ExpressionToken[]) {
  if (tokens.length === 0) {
    return null;
  }

  if (tokens.length === 1) {
    const token = tokens[0];

    if (token.type === "column") {
      return {
        type: "column_reference",
        column_id: token.id,
      };
    }

    if (token.type === "number") {
      return {
        type: "number_literal",
        value: token.value,
      };
    }

    return null;
  }

  let current: any = null;
  let pendingOperator: string | null = null;

  for (const token of tokens) {
    if (token.type === "operator") {
      pendingOperator = token.value;
      continue;
    }

    const node =
      token.type === "column"
        ? {
            type: "column_reference",
            column_id: token.id,
          }
        : {
            type: "number_literal",
            value: token.value,
          };

    if (!current) {
      current = node;
      continue;
    }

    if (!pendingOperator) {
      return null;
    }

    current = {
      type: "binary_expression",
      operator: pendingOperator,
      left: current,
      right: node,
    };

    pendingOperator = null;
  }

  if (pendingOperator) {
    return null;
  }

  return current;
}

export default function BaseMetricBuilder({ model, onCreated }: Props) {
  const [metricName, setMetricName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  const [aggregationType, setAggregationType] = useState("SUM");
  const [formatType, setFormatType] = useState("number");

  const [selectedTableId, setSelectedTableId] = useState("");
  const [tokens, setTokens] = useState<ExpressionToken[]>([]);
  const [numberInput, setNumberInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tables = model?.tables || [];
  const columns = model?.model_columns || [];

  const factTables = useMemo(() => {
    return tables.filter((table: any) => table.table_role === "fact");
  }, [tables]);

  const selectedColumns = useMemo(() => {
    if (!selectedTableId) {
      return [];
    }

    return columns.filter(
      (column: any) => column.model_table_id === selectedTableId
    );
  }, [columns, selectedTableId]);

  const expressionPreview = useMemo(() => {
    if (aggregationType === "ROW_COUNT") {
      return `${displayName || metricName || "Metric"} = ROW_COUNT()`;
    }

    const inner =
      tokens
        .map((token) => {
          if (token.type === "column") {
            return token.label;
          }

          if (token.type === "operator") {
            return token.value;
          }

          return String(token.value);
        })
        .join(" ") || "expression";

    return `${displayName || metricName || "Metric"} = ${aggregationType}(${inner})`;
  }, [aggregationType, tokens, displayName, metricName]);

  function addColumnToken(column: any) {
    setTokens((current) => [
      ...current,
      {
        type: "column",
        id: column.id,
        label: column.column_name || column.name || column.source_column,
      },
    ]);
  }

  function addOperatorToken(operator: "+" | "-" | "*" | "/") {
    setTokens((current) => [
      ...current,
      {
        type: "operator",
        value: operator,
      },
    ]);
  }

  function addNumberToken() {
    const parsed = Number(numberInput);

    if (Number.isNaN(parsed)) {
      return;
    }

    setTokens((current) => [
      ...current,
      {
        type: "number",
        value: parsed,
      },
    ]);

    setNumberInput("");
  }

  function clearExpression() {
    setTokens([]);
  }

  async function handleCreateMetric() {
    setError("");

    if (!metricName.trim()) {
      setError("Metric name is required.");
      return;
    }

    if (!selectedTableId && aggregationType !== "ROW_COUNT") {
      setError("Select a fact table.");
      return;
    }

    const expressionNode =
      aggregationType === "ROW_COUNT"
        ? {
            type: "number_literal",
            value: 1,
          }
        : buildExpressionAst(tokens);

    if (!expressionNode) {
      setError("Build a valid expression using columns, numbers, and operators.");
      return;
    }

    const firstColumnToken = tokens.find((token) => token.type === "column");

    const payload = {
      workspace_id: model.model.workspace_id,
      model_id: model.model.id,

      name: normalizeMetricName(metricName),
      display_name: displayName || metricName,
      description,

      metric_type: "base" as MetricType,
      aggregation_type: aggregationType,

      source_table_id: selectedTableId || null,
      source_column_id:
        firstColumnToken && firstColumnToken.type === "column"
          ? firstColumnToken.id
          : null,

      expression: expressionPreview,

      expression_json: {
        type: "base_metric",
        aggregation: aggregationType,
        expression: expressionNode,
      },

      format_type: formatType,
    };

    try {
      setSaving(true);

      await createMetric(payload);

      setMetricName("");
      setDisplayName("");
      setDescription("");
      setTokens([]);
      setNumberInput("");
      setAggregationType("SUM");
      setFormatType("number");

      onCreated();
    } catch (err) {
      console.error(err);
      setError("Failed to create metric.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Metric Name
            </span>
            <input
              value={metricName}
              onChange={(event) => {
                setMetricName(event.target.value);
                if (!displayName) {
                  setDisplayName(event.target.value);
                }
              }}
              placeholder="Revenue"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Display Name
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Revenue"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Aggregation
            </span>
            <select
              value={aggregationType}
              onChange={(event) => setAggregationType(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            >
              {AGGREGATIONS.map((aggregation) => (
                <option key={aggregation.value} value={aggregation.value}>
                  {aggregation.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Fact Table
            </span>
            <select
              value={selectedTableId}
              onChange={(event) => {
                setSelectedTableId(event.target.value);
                setTokens([]);
              }}
              disabled={aggregationType === "ROW_COUNT"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 disabled:opacity-50 dark:border-white/10 dark:bg-black/20 dark:text-white"
            >
              <option value="">Select table</option>
              {factTables.map((table: any) => (
                <option key={table.id} value={table.id}>
                  {table.display_name || table.table_name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Format
            </span>
            <select
              value={formatType}
              onChange={(event) => setFormatType(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            >
              {FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {aggregationType !== "ROW_COUNT" && (
          <div className="rounded-3xl border border-slate-200 p-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Row-Level Expression
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Build expressions like SalesAmount - DiscountAmount.
                </p>
              </div>

              <button
                onClick={clearExpression}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            </div>

            <div className="mb-4 min-h-14 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20">
              {tokens.length === 0 ? (
                <div className="text-sm text-slate-400">
                  Add columns, operators, or numbers...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tokens.map((token, index) => (
                    <span
                      key={`${token.type}-${index}`}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      {token.type === "column"
                        ? token.label
                        : token.type === "operator"
                          ? token.value
                          : token.value}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {["+", "-", "*", "/"].map((operator) => (
                <button
                  key={operator}
                  onClick={() => addOperatorToken(operator as any)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
                >
                  {operator}
                </button>
              ))}

              <div className="flex items-center gap-2">
                <input
                  value={numberInput}
                  onChange={(event) => setNumberInput(event.target.value)}
                  placeholder="Number"
                  className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
                <button
                  onClick={addNumberToken}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>

            <div className="max-h-52 overflow-auto rounded-2xl border border-slate-200 p-3 dark:border-white/10">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Columns
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedColumns.map((column: any) => (
                  <button
  key={column.id}
  onClick={() => addColumnToken(column)}
  className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-100 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200"
>
  <span>{column.column_name || column.name || column.source_column}</span>
  <span className="ml-1 opacity-60">
    {column.data_type || column.type}
  </span>
</button>
                ))}

                {selectedColumns.length === 0 && (
                  <div className="text-sm text-slate-400">
                    Select a fact table to see columns.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <label className="space-y-2 block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe how this metric should be used."
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
          />
        </label>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}

        <button
          onClick={handleCreateMetric}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Base Metric"}
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Governed Expression Preview
        </h3>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-700 dark:border-white/10 dark:bg-[#111827] dark:text-slate-200">
          {expressionPreview}
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <p>
            Base metrics aggregate governed model columns.
          </p>
          <p>
            Use this for Revenue, Cost, Units Sold, Order Count, Gross Profit,
            and other reusable business measures.
          </p>
        </div>
      </div>
    </div>
  );
}