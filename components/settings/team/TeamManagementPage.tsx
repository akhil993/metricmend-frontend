"use client";

import { useEffect, useState } from "react";
import {
    AlertTriangle,
    Loader2,
    Mail,
    Plus,
    Shield,
    Trash2,
    Users,
    X,
} from "lucide-react";

import {
    AssignableCompanyMemberRole,
    CompanyMember,
    CompanyMemberRole,
    inviteCompanyMemberByEmail,
    listCompanyMembers,
    removeCompanyMember,
    updateCompanyMemberRole,
} from "@/lib/api/company-members";

import { createClient } from "@/lib/supabase/client";

type BillingResponse = {
    company_id?: string;
    company?: {
        id?: string;
    };
};

const ROLE_OPTIONS: AssignableCompanyMemberRole[] = [
    "viewer",
    "member",
    "editor",
    "admin",
];

export default function TeamManagementPage() {
    const [members, setMembers] = useState<CompanyMember[]>([]);
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [companyId, setCompanyId] = useState("");
    const [currentUserId, setCurrentUserId] =
        useState("");

    const [inviteOpen, setInviteOpen] =
        useState(false);

    const [inviteEmail, setInviteEmail] =
        useState("");

    const [inviteRole, setInviteRole] =
        useState<AssignableCompanyMemberRole>(
            "viewer"
        );

    const [inviteLoading, setInviteLoading] =
        useState(false);

    async function load() {
        try {
            setLoading(true);

            const supabase = createClient();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error(
                    "User not authenticated."
                );
            }

            setCurrentUserId(user.id);

            const billingResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/billing/me`,
                {
                    headers: {
                        "user-id": user.id,
                    },
                }
            );

            const billingData =
                (await billingResponse.json()) as BillingResponse;

            const resolvedCompanyId =
                billingData.company?.id ??
                billingData.company_id;

            if (!resolvedCompanyId) {
                throw new Error(
                    "Unable to resolve company for this user."
                );
            }

            setCompanyId(resolvedCompanyId);

            const membersData =
                await listCompanyMembers(
                    resolvedCompanyId,
                    user.id
                );

            setMembers(membersData);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load team."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function getFriendlyError(message: string) {
        const lowered = message.toLowerCase();

        if (
            lowered.includes("editor") ||
            lowered.includes("builder")
        ) {
            return "Your current plan has reached its editor/admin seat limit.";
        }

        if (lowered.includes("member")) {
            return "Your current plan has reached its team member limit.";
        }

        if (
            lowered.includes(
                "no metricmend account"
            )
        ) {
            return "This email does not belong to an existing MetricMend account.";
        }

        return message;
    }

    async function handleInviteMember() {
        try {
            setInviteLoading(true);

            setError("");
            setMessage("");

            await inviteCompanyMemberByEmail(
                {
                    company_id: companyId,
                    email: inviteEmail,
                    role: inviteRole,
                },
                currentUserId
            );

            setInviteEmail("");
            setInviteRole("viewer");

            setInviteOpen(false);

            await load();

            setMessage(
                "Member invited successfully."
            );
        } catch (error) {
            setError(
                getFriendlyError(
                    error instanceof Error
                        ? error.message
                        : "Failed to invite member."
                )
            );
        } finally {
            setInviteLoading(false);
        }
    }

    async function handleRoleChange(
        memberId: string,
        role: AssignableCompanyMemberRole
    ) {
        try {
            setError("");
            setMessage("");

            await updateCompanyMemberRole(
                memberId,
                role,
                currentUserId
            );

            await load();

            setMessage(
                "Role updated successfully."
            );
        } catch (error) {
            setError(
                getFriendlyError(
                    error instanceof Error
                        ? error.message
                        : "Failed to update role."
                )
            );
        }
    }

    async function handleRemove(
        memberId: string
    ) {
        const confirmed = window.confirm(
            "Remove this member from the company?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await removeCompanyMember(
                memberId,
                currentUserId
            );

            await load();

            setMessage(
                "Member removed successfully."
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to remove member."
            );
        }
    }

    function roleBadge(role: string) {
        switch (role) {
            case "owner":
                return "border border-amber-300/30 bg-amber-100 text-amber-700 dark:bg-amber-300/10 dark:text-amber-200";

            case "admin":
                return "border border-purple-300/30 bg-purple-100 text-purple-700 dark:bg-purple-400/10 dark:text-purple-200";

            case "editor":
                return "border border-blue-300/30 bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200";

            default:
                return "border border-slate-300/30 bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
                            <Users className="h-4 w-4" />
                            Team management
                        </div>

                        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                            Company members
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-neutral-400">
                            Manage admins,
                            editors, members, and viewers
                            across your company
                            workspaces.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setInviteOpen(true)
                        }
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        <Plus className="h-4 w-4" />
                        Invite member
                    </button>
                </div>
            </section>

            {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-300/30 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                </div>
            ) : null}

            {message ? (
                <div className="rounded-2xl border border-emerald-300/30 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                    {message}
                </div>
            ) : null}

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
                {loading ? (
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading members...
                    </div>
                ) : members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 dark:bg-white/5">
                            <Users className="h-8 w-8 text-slate-400" />
                        </div>

                        <h2 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
                            Invite your first
                            teammate
                        </h2>

                        <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                            Collaborate securely
                            across governed
                            workspaces with
                            enterprise-grade access
                            control.
                        </p>

                        <button
                            onClick={() =>
                                setInviteOpen(true)
                            }
                            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                        >
                            <Plus className="h-4 w-4" />
                            Invite member
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 md:flex-row md:items-center md:justify-between"
                            >
                                <div>
                                    <p className="font-semibold text-slate-950 dark:text-white">
                                        {member
                                            .profiles
                                            ?.full_name ||
                                            member
                                                .profiles
                                                ?.email ||
                                            "Unknown user"}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {
                                            member
                                                .profiles
                                                ?.email
                                        }
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${roleBadge(
                                            member.role
                                        )}`}
                                    >
                                        {member.role ===
                                            "owner" ? (
                                            <Shield className="h-3 w-3" />
                                        ) : null}

                                        {member.role}
                                    </div>

                                    {member.role !==
                                        "owner" && (
                                            <>
                                                <select
                                                    value={
                                                        member.role
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        handleRoleChange(
                                                            member.id,
                                                            event
                                                                .target
                                                                .value as AssignableCompanyMemberRole
                                                        )
                                                    }
                                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#070810] dark:text-white"
                                                >
                                                    {ROLE_OPTIONS.map(
                                                        (
                                                            role
                                                        ) => (
                                                            <option
                                                                key={
                                                                    role
                                                                }
                                                                value={
                                                                    role
                                                                }
                                                            >
                                                                {
                                                                    role
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemove(
                                                            member.id
                                                        )
                                                    }
                                                    className="rounded-2xl border border-red-300/20 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/20"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {inviteOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#0b0d14]">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                                    Invite member
                                </h2>

                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Add teammates to
                                    collaborate across
                                    governed workspaces.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setInviteOpen(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="email"
                                        value={
                                            inviteEmail
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setInviteEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="name@company.com"
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-950 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#070810] dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Role
                                </label>

                                <select
                                    value={inviteRole}
                                    onChange={(event) =>
                                        setInviteRole(
                                            event
                                                .target
                                                .value as AssignableCompanyMemberRole
                                        )
                                    }
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-[#070810] dark:text-white"
                                >
                                    {ROLE_OPTIONS.map(
                                        (role) => (
                                            <option
                                                key={
                                                    role
                                                }
                                                value={
                                                    role
                                                }
                                            >
                                                {role}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="rounded-2xl border border-amber-300/30 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
                                Editor and admin
                                roles consume
                                governed collaboration
                                seats based on your
                                company plan.
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() =>
                                        setInviteOpen(
                                            false
                                        )
                                    }
                                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={
                                        handleInviteMember
                                    }
                                    disabled={
                                        inviteLoading ||
                                        !inviteEmail
                                    }
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    {inviteLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}

                                    Invite member
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}