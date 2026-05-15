"use client";

import type { WorkspaceOption } from "@/lib/api/governance";

type PipelineWorkspaceSelectorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  workspaces: WorkspaceOption[];
};

export function PipelineWorkspaceSelector({
  label,
  value,
  onChange,
  workspaces,
}: PipelineWorkspaceSelectorProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
      >
        <option value="">
          Select workspace
        </option>

        {workspaces.map((workspace) => (
          <option
            key={workspace.id}
            value={workspace.id}
          >
            {workspace.name} (
            {workspace.environment_type})
          </option>
        ))}
      </select>
    </div>
  );
}