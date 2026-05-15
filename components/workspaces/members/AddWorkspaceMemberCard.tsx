"use client";

import { useEffect, useState } from "react";

import {
  addWorkspaceMember,
  type WorkspaceMember,
} from "@/lib/api/workspace-members";

import {
  listCompanyMembers,
  type CompanyMember,
} from "@/lib/api/company-members";

import { getCurrentUserId } from "@/lib/auth/session";

type AddWorkspaceMemberCardProps = {
  workspaceId: string;
  companyId: string;
  existingUserIds: string[];
  onMemberAdded: (
    member: WorkspaceMember
  ) => void;
};

const ROLE_OPTIONS = [
  "owner",
  "admin",
  "editor",
  "member",
  "viewer",
];

export function AddWorkspaceMemberCard({
  workspaceId,
  companyId,
  existingUserIds,
  onMemberAdded,
}: AddWorkspaceMemberCardProps) {
  const [members, setMembers] = useState<
    CompanyMember[]
  >([]);
  const availableMembers = members.filter(
  (member) =>
    !existingUserIds.includes(member.user_id)
);

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [role, setRole] =
    useState("member");

  const [loading, setLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        const currentUserId =
          await getCurrentUserId();

        const data =
          await listCompanyMembers(
            companyId,
            currentUserId
          );

        setMembers(data);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, [companyId]);

  async function handleAddMember() {
    try {
      setIsSubmitting(true);

      const member =
        await addWorkspaceMember(
          workspaceId,
          {
            company_id: companyId,
            user_id: selectedUserId,
            role,
          }
        );

      onMemberAdded(member);

      setSelectedUserId("");
      setRole("member");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        Add workspace member
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Add existing company users
        into this workspace and assign
        environment-specific roles.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_auto]">
        <select
          value={selectedUserId}
          disabled={loading}
          onChange={(event) =>
            setSelectedUserId(
              event.target.value
            )
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
        >
          <option value="">
            Select company member
          </option>

          {availableMembers.map((member) => (
            <option
              key={member.user_id}
              value={member.user_id}
            >
              {member.profiles
                ?.full_name ||
                member.profiles
                  ?.email ||
                member.user_id}
            </option>
          ))}
        </select>

        <select
          value={role}
          onChange={(event) =>
            setRole(event.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
        >
          {ROLE_OPTIONS.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>

        <button
          onClick={handleAddMember}
          disabled={
            isSubmitting ||
            !selectedUserId
          }
          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Adding..."
            : "Add member"}
        </button>
      </div>
    </section>
  );
}