"use client";

import { useState } from "react";


import {
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
  type WorkspaceMember,
} from "@/lib/api/workspace-members";
import { AddWorkspaceMemberCard } from "./AddWorkspaceMemberCard";

type WorkspaceMembersPageProps = {
  workspaceId: string;
  initialMembers: WorkspaceMember[];
  canManageMembers: boolean;
};

const ROLE_OPTIONS = ["owner", "admin", "editor", "member", "viewer"];

export function WorkspaceMembersPage({
  workspaceId,
  initialMembers,
  canManageMembers,
}: WorkspaceMembersPageProps) {
  const [members, setMembers] = useState(initialMembers);
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);

  const companyId = members[0]?.company_id ?? null;

  async function handleRoleChange(memberId: string, role: string) {
    try {
      setLoadingMemberId(memberId);

      const updated = await updateWorkspaceMemberRole(
        workspaceId,
        memberId,
        role
      );

      setMembers((current) =>
        current.map((member) =>
          member.id === memberId ? { ...member, role: updated.role } : member
        )
      );
    } finally {
      setLoadingMemberId(null);
    }
  }

  async function handleRemove(memberId: string) {
    try {
      setLoadingMemberId(memberId);

      await removeWorkspaceMember(workspaceId, memberId);

      setMembers((current) =>
        current.filter((member) => member.id !== memberId)
      );
    } finally {
      setLoadingMemberId(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-50 px-4 py-2 text-sm text-sky-700 dark:border-sky-300/20 dark:bg-sky-400/10 dark:text-sky-100">
              Workspace Members
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Manage workspace access
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Control semantic collaboration, governance participation, and
              workspace-level permissions for this environment.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Active Members
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              {members.length}
            </p>
          </div>
        </div>
      </section>


      {canManageMembers && companyId && (
        <AddWorkspaceMemberCard
          workspaceId={workspaceId}
          companyId={companyId}
          existingUserIds={members.map((member) => member.user_id)}
          onMemberAdded={(member) =>
            setMembers((current) => [member, ...current])
          }
        />
      )}

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead className="bg-slate-50 dark:bg-white/[0.03]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-5">
                    <p className="font-medium text-slate-950 dark:text-white">
                      {member.profiles?.full_name || "Unnamed User"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {member.profiles?.email || member.user_id}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {canManageMembers ? (
                      <select
                        value={member.role}
                        disabled={loadingMemberId === member.id}
                        onChange={(event) =>
                          handleRoleChange(member.id, event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium capitalize text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                        {member.role}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                      {member.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    {canManageMembers ? (
                      <button
                        disabled={loadingMemberId === member.id}
                        onClick={() => handleRemove(member.id)}
                        className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-400/20 dark:text-rose-300 dark:hover:bg-rose-400/10"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}