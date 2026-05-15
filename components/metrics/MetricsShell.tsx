"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Database,
  HelpCircle,
  ListTree,
  Search,
  Sigma,
} from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import { getModelDetail } from "@/lib/api/models";
import { getModelMetrics, type SemanticMetric } from "@/lib/api/metrics";

import TimeIntelligenceSettingsPanel from "./TimeIntelligenceSettingsPanel";
import MetricFormulaBuilder from "./MetricFormulaBuilder";
import MetricList from "./MetricList";
import MetricDetailDrawer from "./MetricDetailDrawer";
import GenerateTimeCalculationsPanel from "./GenerateTimeCalculationsPanel";

type Props = {
  modelId: string;
};

type MetricsTab = "builder" | "time" | "catalog";

const tabs: {
  key: MetricsTab;
  label: string;
  description: string;
  icon: typeof Sigma;
}[] = [
    {
      key: "builder",
      label: "Builder",
      description: "Create and edit governed semantic metrics.",
      icon: Sigma,
    },
    {
      key: "time",
      label: "Time Intelligence",
      description: "Configure fiscal calendars and generated time logic.",
      icon: CalendarClock,
    },
    {
      key: "catalog",
      label: "Catalog",
      description: "Browse, inspect, and manage existing metrics.",
      icon: ListTree,
    },
  ];

export default function MetricsShell({ modelId }: Props) {
  const { activeWorkspace } = useAppWorkspace();

  const [activeTab, setActiveTab] = useState<MetricsTab>("builder");
  const [modelDetail, setModelDetail] = useState<any>(null);
  const [metrics, setMetrics] = useState<SemanticMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<SemanticMetric | null>(
    null
  );
  const [editingMetric, setEditingMetric] = useState<SemanticMetric | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!activeWorkspace.workspace_id) return;

      setLoading(true);

      try {
        const [modelResponse, metricsResponse] = await Promise.all([
          getModelDetail(modelId),
          getModelMetrics(modelId),
        ]);

        setModelDetail(modelResponse);
        setMetrics(metricsResponse);
      } catch (error) {
        console.error("Failed to load metrics workspace:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [modelId, activeWorkspace.workspace_id]);

  const activeTabMeta = useMemo(
    () => tabs.find((tab) => tab.key === activeTab),
    [activeTab]
  );

  function handleMetricCreated(metric: SemanticMetric) {
    setMetrics((prev) => {
      const exists = prev.some((item) => item.id === metric.id);

      if (exists) {
        return prev.map((item) => (item.id === metric.id ? metric : item));
      }

      return [metric, ...prev];
    });

    setEditingMetric(null);
  }

  function handleEditMetric(metric: SemanticMetric) {
    setSelectedMetric(null);
    setEditingMetric(metric);
    setActiveTab("builder");
  }

  if (loading || !modelDetail) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        Loading metrics workspace...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300">
            Semantic Model
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Metrics
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Build governed metrics, configure time intelligence, and manage the
            semantic catalog for this model.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          <Database className="h-4 w-4" />
          <span className="font-medium">Model</span>
          <span className="max-w-[180px] truncate text-slate-700 dark:text-slate-200">
            {modelDetail.name ?? modelId}
          </span>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-[#111827]">
            <div className="grid gap-2 md:grid-cols-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={[
                      "rounded-xl px-4 py-3 text-left transition",
                      isActive
                        ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {tab.label}
                      </span>
                    </div>

                    <p
                      className={[
                        "mt-1 text-xs leading-5",
                        isActive
                          ? "text-white/75 dark:text-slate-600"
                          : "text-slate-500 dark:text-slate-500",
                      ].join(" ")}
                    >
                      {tab.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                {activeTabMeta?.icon && (
                  <activeTabMeta.icon className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                )}

                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                  {activeTabMeta?.label}
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {activeTabMeta?.description}
              </p>
            </div>

            <div className="p-5">
              {activeTab === "builder" && (
                <MetricFormulaBuilder
                  editingMetric={editingMetric}
                  workspaceId={activeWorkspace.workspace_id}
                  modelId={modelId}
                  modelTables={modelDetail.tables ?? []}
                  modelColumns={modelDetail.model_columns ?? []}
                  metrics={metrics}
                  onMetricCreated={handleMetricCreated}
                />
              )}

              {activeTab === "time" && (
                <div className="space-y-5">
                  <TimeIntelligenceSettingsPanel
                    workspaceId={activeWorkspace.workspace_id}
                    modelId={modelId}
                    modelTables={modelDetail.tables ?? []}
                    modelColumns={modelDetail.model_columns ?? []}
                  />

                  <GenerateTimeCalculationsPanel
                    workspaceId={activeWorkspace.workspace_id}
                    modelId={modelId}
                    metrics={metrics}
                    onGenerated={(generatedMetrics) => {
                      setMetrics((prev) => [
                        ...generatedMetrics,
                        ...prev,
                      ]);
                    }}
                  />
                </div>
              )}

              {activeTab === "catalog" && (
                <MetricList
                  metrics={metrics}
                  onMetricClick={(metric) => setSelectedMetric(metric)}
                />
              )}
            </div>
          </section>
        </main>

        <aside className="xl:sticky xl:top-5 xl:self-start">
          <div className="space-y-4">
            <SidebarCard
              icon={Database}
              title="Model Fields"
              description="Tables and columns available in this semantic model."
            >
              <ModelFieldsPreview
                tables={modelDetail.tables ?? []}
                columns={modelDetail.model_columns ?? []}
              />
            </SidebarCard>

            <SidebarCard
              icon={Sigma}
              title="Existing Metrics"
              description="Reusable governed metrics in this model."
            >
              <ExistingMetricsPreview metrics={metrics} />
            </SidebarCard>

            <SidebarCard
              icon={HelpCircle}
              title="Formula Help"
              description="Common formula patterns."
            >
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <FormulaExample
                  label="Revenue"
                  value="SUM(SalesAmount) - SUM(DiscountAmount)"
                />
                <FormulaExample label="AOV" value="Revenue / Orders" />
                <FormulaExample
                  label="Gross Margin %"
                  value="GrossMargin / Revenue"
                />
              </div>
            </SidebarCard>
          </div>
        </aside>
      </div>

      <MetricDetailDrawer
        open={Boolean(selectedMetric)}
        metric={selectedMetric}
        onClose={() => setSelectedMetric(null)}
        onEdit={handleEditMetric}
      />
    </div>
  );
}

function SidebarCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Search;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />

          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
        </div>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function ModelFieldsPreview({
  tables,
  columns,
}: {
  tables: any[];
  columns: any[];
}) {
  if (!tables.length && !columns.length) {
    return <EmptySidebarState text="No model fields found." />;
  }

  return (
    <div className="max-h-72 space-y-3 overflow-auto pr-1">
      {tables.map((table) => {
        const tableColumns = columns.filter(
          (column) =>
            column.table_id === table.id ||
            column.model_table_id === table.id ||
            column.table_name === table.name
        );

        return (
          <div
            key={table.id ?? table.name}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]"
          >
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {table.display_name ?? table.name}
            </div>

            <div className="mt-2 space-y-1">
              {tableColumns.slice(0, 8).map((column) => (
                <div
                  key={column.id ?? `${table.id}-${column.name}`}
                  className="flex items-center justify-between gap-2 text-[11px]"
                >
                  <span className="truncate text-slate-600 dark:text-slate-400">
                    {column.display_name ?? column.name}
                  </span>

                  <span className="shrink-0 text-slate-400 dark:text-slate-500">
                    {column.data_type ?? column.type ?? "field"}
                  </span>
                </div>
              ))}

              {tableColumns.length > 8 && (
                <div className="pt-1 text-[11px] text-slate-400">
                  +{tableColumns.length - 8} more fields
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExistingMetricsPreview({ metrics }: { metrics: SemanticMetric[] }) {
  if (!metrics.length) {
    return <EmptySidebarState text="No metrics created yet." />;
  }

  return (
    <div className="max-h-64 space-y-2 overflow-auto pr-1">
      {metrics.slice(0, 12).map((metric) => (
        <div
          key={metric.id}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]"
        >
          <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
            {metric.display_name ?? metric.name}
          </div>

          <div className="mt-1 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {metric.metric_type ?? "metric"}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptySidebarState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-xs text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
      {text}
    </div>
  );
}

function FormulaExample({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="font-medium text-slate-800 dark:text-slate-200">
        {label}
      </div>

      <code className="mt-1 block break-words text-[11px] text-slate-500 dark:text-slate-400">
        {value}
      </code>
    </div>
  );
}