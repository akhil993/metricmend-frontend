"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  getTimeIntelligenceSettings,
  saveTimeIntelligenceSettings,
  type TimeIntelligenceSettings,
} from "@/lib/api/timeIntelligence";

import {
  getColumnName,
  getColumnTableName,
  getTableName,
  type ModelColumn,
  type ModelTable,
} from "./metricFormulaUtils";

type Props = {
  workspaceId: string;
  modelId: string;
  modelTables: ModelTable[];
  modelColumns: ModelColumn[];
};

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const CALENDAR_TYPES = [
  {
    value: "standard",
    label: "Standard Calendar",
  },
  {
    value: "fiscal",
    label: "Fiscal Calendar",
  },
  {
    value: "retail_445",
    label: "Retail 4-4-5 Calendar",
  },
] as const;

const WEEK_53_STRATEGIES = [
  {
    value: "include_in_last_period",
    label: "Include in last period",
  },
  {
    value: "separate_week_53",
    label: "Separate Week 53",
  },
  {
    value: "compare_to_week_52",
    label: "Compare to Week 52",
  },
] as const;

export default function TimeIntelligenceSettingsPanel({
  workspaceId,
  modelId,
  modelTables,
  modelColumns,
}: Props) {
  const [settings, setSettings] =
    useState<TimeIntelligenceSettings>({
      workspace_id: workspaceId,
      model_id: modelId,
      date_table_id: null,
      date_column_id: null,
      calendar_type: "standard",
      week_ending_day: null,
      week_end_date_column_id: null,
      fiscal_year_column_id: null,
      fiscal_quarter_column_id: null,
      fiscal_period_column_id: null,
      fiscal_week_column_id: null,
      year_end_month: null,
      year_end_day: null,
      uses_53_week_calendar: false,
      week_53_strategy: "include_in_last_period",
    });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const tableLookup = useMemo(() => {
    return new Map(modelTables.map((table) => [table.id, table]));
  }, [modelTables]);

  const dateLikeTables = useMemo(() => {
    return modelTables.filter((table) => {
      const name = getTableName(table).toLowerCase();
      const role = String(
        table.table_role || table.role || ""
      ).toLowerCase();

      return (
        role.includes("date") ||
        role.includes("dimension") ||
        name.includes("date") ||
        name.includes("calendar") ||
        name.includes("dim_date") ||
        name.includes("time")
      );
    });
  }, [modelTables]);

  const selectedTableColumns = useMemo(() => {
    if (!settings.date_table_id) return modelColumns;

    return modelColumns.filter((column) => {
      const tableId =
        column.model_table_id ||
        column.table_id ;
        //column.semantic_table_id;

      return String(tableId) === String(settings.date_table_id);
    });
  }, [modelColumns, settings.date_table_id]);

  const dateLikeColumns = useMemo(() => {
    return selectedTableColumns.filter((column) => {
      const name = getColumnName(column).toLowerCase();
      const type = String(
        column.data_type || column.type || ""
      ).toLowerCase();

      return (
        type.includes("date") ||
        type.includes("time") ||
        name.includes("date") ||
        name.includes("day") ||
        name.includes("week_end") ||
        name.includes("weekending") ||
        name.includes("calendar")
      );
    });
  }, [selectedTableColumns]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        setMessage(null);

        const response = await getTimeIntelligenceSettings(
          workspaceId,
          modelId
        );

        setSettings((current) => ({
          ...current,
          ...response.settings,
          workspace_id: workspaceId,
          model_id: modelId,
        }));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load time intelligence settings."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [workspaceId, modelId]);

  function updateSetting<K extends keyof TimeIntelligenceSettings>(
    key: K,
    value: TimeIntelligenceSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setMessage(null);
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setMessage(null);

      await saveTimeIntelligenceSettings(settings);

      setMessage("Time intelligence settings saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save time intelligence settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
          Loading time intelligence settings...
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />

            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              Time Intelligence Settings
            </h2>
          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Configure the model&apos;s date table, fiscal calendar, week ending
            logic, and 53-week handling before generating time calculations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-500 dark:hover:bg-cyan-400"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save settings
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Calendar Type
          </span>

          <select
            value={settings.calendar_type}
            onChange={(event) =>
              updateSetting(
                "calendar_type",
                event.target.value as TimeIntelligenceSettings["calendar_type"]
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          >
            {CALENDAR_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Date Table
          </span>

          <select
            value={settings.date_table_id || ""}
            onChange={(event) => {
              updateSetting(
                "date_table_id",
                event.target.value || null
              );

              updateSetting("date_column_id", null);
              updateSetting("week_end_date_column_id", null);
              updateSetting("fiscal_year_column_id", null);
              updateSetting("fiscal_quarter_column_id", null);
              updateSetting("fiscal_period_column_id", null);
              updateSetting("fiscal_week_column_id", null);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          >
            <option value="">Select date table</option>

            {(dateLikeTables.length ? dateLikeTables : modelTables).map(
              (table) => (
                <option key={table.id} value={table.id}>
                  {getTableName(table)}
                </option>
              )
            )}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Date Column
          </span>

          <select
            value={settings.date_column_id || ""}
            onChange={(event) =>
              updateSetting(
                "date_column_id",
                event.target.value || null
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          >
            <option value="">Select date column</option>

            {(dateLikeColumns.length
              ? dateLikeColumns
              : selectedTableColumns
            ).map((column) => (
              <option key={column.id} value={column.id}>
                {getColumnTableName(column, tableLookup)}.
                {getColumnName(column)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Week Ending Day
          </span>

          <select
            value={settings.week_ending_day || ""}
            onChange={(event) =>
              updateSetting(
                "week_ending_day",
                (event.target.value ||
                  null) as TimeIntelligenceSettings["week_ending_day"]
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm capitalize text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          >
            <option value="">Not configured</option>

            {WEEK_DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Week Ending Date Column
          </span>

          <select
            value={settings.week_end_date_column_id || ""}
            onChange={(event) =>
              updateSetting(
                "week_end_date_column_id",
                event.target.value || null
              )
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
          >
            <option value="">Optional</option>

            {selectedTableColumns.map((column) => (
              <option key={column.id} value={column.id}>
                {getColumnTableName(column, tableLookup)}.
                {getColumnName(column)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Year End Month
            </span>

            <input
              type="number"
              min={1}
              max={12}
              value={settings.year_end_month ?? ""}
              onChange={(event) =>
                updateSetting(
                  "year_end_month",
                  event.target.value
                    ? Number(event.target.value)
                    : null
                )
              }
              placeholder="12"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Year End Day
            </span>

            <input
              type="number"
              min={1}
              max={31}
              value={settings.year_end_day ?? ""}
              onChange={(event) =>
                updateSetting(
                  "year_end_day",
                  event.target.value
                    ? Number(event.target.value)
                    : null
                )
              }
              placeholder="31"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={settings.uses_53_week_calendar}
            onChange={(event) =>
              updateSetting(
                "uses_53_week_calendar",
                event.target.checked
              )
            }
            className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />

          <div>
            <p className="text-sm font-medium text-slate-950 dark:text-white">
              This model uses a 53-week fiscal calendar
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Enable this for retail or fiscal calendars where certain years
              contain an extra week.
            </p>
          </div>
        </label>

        {settings.uses_53_week_calendar && (
          <label className="mt-4 block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Week 53 Strategy
            </span>

            <select
              value={settings.week_53_strategy}
              onChange={(event) =>
                updateSetting(
                  "week_53_strategy",
                  event.target
                    .value as TimeIntelligenceSettings["week_53_strategy"]
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
            >
              {WEEK_53_STRATEGIES.map((strategy) => (
                <option
                  key={strategy.value}
                  value={strategy.value}
                >
                  {strategy.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {settings.calendar_type !== "standard" && (
        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          <FiscalColumnSelect
            label="Fiscal Year Column"
            value={settings.fiscal_year_column_id}
            columns={selectedTableColumns}
            tableLookup={tableLookup}
            onChange={(value) =>
              updateSetting("fiscal_year_column_id", value)
            }
          />

          <FiscalColumnSelect
            label="Fiscal Quarter Column"
            value={settings.fiscal_quarter_column_id}
            columns={selectedTableColumns}
            tableLookup={tableLookup}
            onChange={(value) =>
              updateSetting("fiscal_quarter_column_id", value)
            }
          />

          <FiscalColumnSelect
            label="Fiscal Period Column"
            value={settings.fiscal_period_column_id}
            columns={selectedTableColumns}
            tableLookup={tableLookup}
            onChange={(value) =>
              updateSetting("fiscal_period_column_id", value)
            }
          />

          <FiscalColumnSelect
            label="Fiscal Week Column"
            value={settings.fiscal_week_column_id}
            columns={selectedTableColumns}
            tableLookup={tableLookup}
            onChange={(value) =>
              updateSetting("fiscal_week_column_id", value)
            }
          />
        </div>
      )}

      {message && (
        <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-300/30 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-400/10 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-cyan-300/20 bg-cyan-50 p-4 text-sm text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-100">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />

        <p>
          Time calculations will use these settings when generating YTD, MTD,
          rolling periods, prior period comparisons, and 53-week aware fiscal
          calculations.
        </p>
      </div>
    </section>
  );
}

type FiscalColumnSelectProps = {
  label: string;
  value?: string | null;
  columns: ModelColumn[];
  tableLookup: Map<string, ModelTable>;
  onChange: (value: string | null) => void;
};

function FiscalColumnSelect({
  label,
  value,
  columns,
  tableLookup,
  onChange,
}: FiscalColumnSelectProps) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <select
        value={value || ""}
        onChange={(event) =>
          onChange(event.target.value || null)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
      >
        <option value="">Optional</option>

        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {getColumnTableName(column, tableLookup)}.
            {getColumnName(column)}
          </option>
        ))}
      </select>
    </label>
  );
}