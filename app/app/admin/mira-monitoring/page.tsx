"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ActiveTab,
  CompanyChat,
  RecentQuery,
  SummaryResponse,
  ThreadInspector,
} from "@/components/admin/mira-monitoring/types";
import MetricCard from "@/components/admin/mira-monitoring/MetricCard";
import TabButton from "@/components/admin/mira-monitoring/TabButton";
import CompanyChatsTable from "@/components/admin/mira-monitoring/CompanyChatsTable";
import QueryLogsTable from "@/components/admin/mira-monitoring/QueryLogsTable";
import ThreadInspectorDrawer from "@/components/admin/mira-monitoring/ThreadInspectorDrawer";
import {
  deleteMiraThread,
  getMiraCompanyChats,
  getMiraFailures,
  getMiraMonitoringSummary,
  getMiraRecentQueries,
  getMiraThreadInspector,
} from "@/lib/api/miraMonitoring";

export default function MiraMonitoringPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("company_chats");

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [companyChats, setCompanyChats] = useState<CompanyChat[]>([]);
  const [failures, setFailures] = useState<RecentQuery[]>([]);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);

  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadInspector, setThreadInspector] =
    useState<ThreadInspector | null>(null);
  const [inspectorLoading, setInspectorLoading] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  const successRate = useMemo(() => {
    if (!summary?.total_queries) return "0%";
    return `${Math.round((summary.success_count / summary.total_queries) * 100)}%`;
  }, [summary]);

  useEffect(() => {
    loadSummary();
    loadCompanyChats();
  }, []);

  async function loadSummary() {
    try {
      const data = await getMiraMonitoringSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCompanyChats() {
    setTabLoading(true);

    try {
      const data = await getMiraCompanyChats();
      setCompanyChats(data);
    } catch (error) {
      console.error(error);
      setCompanyChats([]);
    } finally {
      setTabLoading(false);
    }
  }

  async function loadFailures() {
    setTabLoading(true);

    try {
      const data = await getMiraFailures();
      setFailures(data);
    } catch (error) {
      console.error(error);
      setFailures([]);
    } finally {
      setTabLoading(false);
    }
  }

  async function loadRecentQueries() {
    setTabLoading(true);

    try {
      const data = await getMiraRecentQueries();
      setRecentQueries(data);
    } catch (error) {
      console.error(error);
      setRecentQueries([]);
    } finally {
      setTabLoading(false);
    }
  }

  async function handleTabChange(tab: ActiveTab) {
    setActiveTab(tab);

    if (tab === "company_chats" && companyChats.length === 0) {
      await loadCompanyChats();
    }

    if (tab === "failures" && failures.length === 0) {
      await loadFailures();
    }

    if (tab === "recent_queries" && recentQueries.length === 0) {
      await loadRecentQueries();
    }
  }

  async function openThread(threadId: string) {
    setSelectedThreadId(threadId);
    setInspectorLoading(true);
    setThreadInspector(null);

    try {
      const data = await getMiraThreadInspector(threadId);
      setThreadInspector(data);
    } catch (error) {
      console.error(error);
      setThreadInspector({
        thread: null,
        messages: [],
        audit_logs: [],
      });
    } finally {
      setInspectorLoading(false);
    }
  }

  async function deleteThread(threadId: string) {
    const confirmed = window.confirm(
      "Soft delete this Mira chat thread from monitoring?"
    );

    if (!confirmed) return;

    try {
      await deleteMiraThread(threadId);

      setCompanyChats((current) =>
        current.filter((chat) => chat.thread_id !== threadId)
      );

      if (selectedThreadId === threadId) {
        setSelectedThreadId(null);
        setThreadInspector(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-6 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Admin / Mira Monitoring
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Mira Monitor
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            Monitor company chats, failed Mira requests, SQL guardrails, planner
            behavior, and query health.
          </p>
        </div>


        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Total Queries"
            value={loading ? "—" : summary?.total_queries ?? 0}
          />
          <MetricCard
            label="Successful"
            value={loading ? "—" : summary?.success_count ?? 0}
          />
          <MetricCard
            label="Failed"
            value={loading ? "—" : summary?.failed_count ?? 0}
          />
          <MetricCard
            label="Success Rate"
            value={loading ? "—" : successRate}
          />
          <MetricCard
            label="Avg Execution"
            value={
              loading
                ? "—"
                : `${Math.round(summary?.avg_execution_ms ?? 0)} ms`
            }
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Admin Activity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Company chats first. Raw query logs are available for debugging.
              </p>
            </div>
            {activeTab === "company_chats" && (
              <input
                value={companySearch}
                onChange={(event) => setCompanySearch(event.target.value)}
                placeholder="Search chats, users, email, workspace..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-slate-500 md:w-80"
              />
            )}

            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
              <TabButton
                active={activeTab === "company_chats"}
                onClick={() => handleTabChange("company_chats")}
              >
                Company Chats
              </TabButton>
              <TabButton
                active={activeTab === "failures"}
                onClick={() => handleTabChange("failures")}
              >
                Failures
              </TabButton>
              <TabButton
                active={activeTab === "recent_queries"}
                onClick={() => handleTabChange("recent_queries")}
              >
                Recent Queries
              </TabButton>
            </div>
          </div>

          {activeTab === "company_chats" && (
            <CompanyChatsTable
              chats={companyChats}
              loading={tabLoading}
              expandedUsers={expandedUsers}
              search={companySearch}
              onToggleUser={(userKey) =>
                setExpandedUsers((current) => ({
                  ...current,
                  [userKey]: !current[userKey],
                }))
              }
              onOpen={openThread}
              onDelete={deleteThread}
            />
          )}

          {activeTab === "failures" && (
            <QueryLogsTable queries={failures} loading={tabLoading} />
          )}

          {activeTab === "recent_queries" && (
            <QueryLogsTable queries={recentQueries} loading={tabLoading} />
          )}
        </section>
      </div>

      {selectedThreadId && (
        <ThreadInspectorDrawer
          loading={inspectorLoading}
          data={threadInspector}
          onClose={() => {
            setSelectedThreadId(null);
            setThreadInspector(null);
          }}
          onDelete={() => deleteThread(selectedThreadId)}
        />
      )}
    </main>
  );
}