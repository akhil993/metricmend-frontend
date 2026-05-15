"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Crown,
  Loader2,
  Lock,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  createWorkspaceForMyCompany,
  getWorkspaceManagementSummary,
  type WorkspaceEnvironment,
  type WorkspaceManagementSummary,
} from "@/lib/api/workspaces";

export default function WorkspacesPage() {
  const [summary, setSummary] =
    useState<WorkspaceManagementSummary | null>(null);

  const [workspaceName, setWorkspaceName] = useState("");
  const [environment, setEnvironment] =
    useState<WorkspaceEnvironment>("development");
  const sharedWorkspaces =
  summary?.workspaces.filter(
    (workspace) =>
      workspace.workspace_type === "shared"
  ) ?? [];

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await getWorkspaceManagementSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load workspaces.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const maxWorkspaces = summary?.limits?.max_workspaces ?? null;

  const sharedWorkspaceCount =
    summary?.workspaces.filter(
      (workspace) =>
        workspace.workspace_type !==
        "launchpad"
    ).length ?? 0;

  const limitReached = useMemo(() => {
    if (!summary) return false;
    if (maxWorkspaces === null) return false;

    return sharedWorkspaceCount >= maxWorkspaces;
  }, [summary, maxWorkspaces, sharedWorkspaceCount]);

  async function handleCreateWorkspace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!workspaceName.trim()) return;

    setCreating(true);
    setError("");

    try {
      await createWorkspaceForMyCompany(workspaceName.trim(), environment);
      setWorkspaceName("");
      setEnvironment("development");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create workspace.");
    } finally {
      setCreating(false);
    }
  }

  function formatEnvironment(value?: WorkspaceEnvironment) {
    if (!value) return "Environment not set";

    if (value === "development") return "Development";
    if (value === "test") return "Test";
    return "Production";
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045]">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
        Loading workspaces...
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          Workspace management
        </div>

        <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
          Organize analytics by workspace.
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-neutral-400">
          Workspaces keep connections, models, metrics, Mira chats, and access
          rules separated. Free plans include one workspace.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Launchpad
            </p>

            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              Active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Additional workspaces
            </p>

            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              {summary?.plan === "free_trial"
                ? `${Math.max(
                  0,
                  (maxWorkspaces ?? 0) - sharedWorkspaceCount
                )} available on Free`
                : maxWorkspaces === null
                  ? "Unlimited"
                  : `${Math.max(
                    0,
                    maxWorkspaces - sharedWorkspaceCount
                  )} available`}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Plan
            </p>

            <p className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">
              {summary?.plan ?? "free"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
          <Building2 className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Create workspace
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-400">
            Add another workspace when your plan allows it. Choose the workspace
            environment so Global Mira can safely separate development, test,
            and production analytics.
          </p>

          {limitReached ? (
            <div className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-100/50 p-4 text-amber-800 dark:bg-amber-300/10 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5" />

                <div>
                  <p className="font-medium">Free workspace limit reached</p>

                  <p className="mt-1 text-sm opacity-80">
                    Upgrade later to create more workspaces for departments,
                    clients, or analytics domains.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateWorkspace} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-neutral-400">
                  Workspace name
                </label>

                <input
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  placeholder="Revenue Intelligence"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#070810] dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-neutral-400">
                  Environment
                </label>

                <select
                  value={environment}
                  onChange={(event) =>
                    setEnvironment(event.target.value as WorkspaceEnvironment)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#070810] dark:text-white"
                >
                  <option value="development">Development</option>
                  <option value="test">Test</option>
                  <option value="production">Production</option>
                </select>

                <p className="mt-2 text-xs text-slate-500 dark:text-neutral-500">
                  Required for safe Global Mira routing.
                </p>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-500 dark:text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={creating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-5 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create workspace"}
                {!creating ? <Plus className="h-4 w-4" /> : null}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
          <Sparkles className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Your workspaces
          </h3>

          <div className="mt-6 space-y-3">
            {sharedWorkspaces.map((workspace) => (
              <Link
                key={workspace.workspace_id}
                href={`/app/workspaces/${workspace.workspace_id}`}
                className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">
                      {workspace.workspace_name}
                    </p>

                    <p className="mt-1 text-sm capitalize text-slate-500 dark:text-neutral-500">
                      {workspace.status} · {workspace.role} ·{" "}
                      {formatEnvironment(workspace.environment)}
                    </p>
                  </div>

                  {workspace.role === "owner" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-300/10 dark:text-amber-200">
                      <Crown className="h-3 w-3" />
                      Owner
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}