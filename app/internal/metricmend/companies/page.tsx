"use client";

import { useEffect, useMemo, useState } from "react";
import {
  assignCompanyAdmin,
  createInternalCompany,
  getInternalCompanies,
  removeCompanyAdmin,
  searchInternalUsers,
} from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";
import InternalCompanyStats from "@/components/internal/metricmend/companies/InternalCompanyStats";
import InternalCompaniesTable from "@/components/internal/metricmend/companies/InternalCompaniesTable";
import type {
  AdminRole,
  InternalCompany,
  InternalUserSearchResult,
} from "@/components/internal/metricmend/companies/types";

export default function InternalCompaniesPage() {
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<InternalCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<InternalUserSearchResult[]>(
    []
  );
  const [selectedUser, setSelectedUser] =
    useState<InternalUserSearchResult | null>(null);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("admin");

  const filteredCompanies = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return companies;

    return companies.filter((company) => {
      const companyNameValue = company.name || company.company_name || "";
      const admins = company.admins || [];

      const haystack = [
        companyNameValue,
        company.status,
        company.plan,
        ...admins.map((admin) => admin.profiles?.email),
        ...admins.map((admin) => admin.profiles?.full_name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(value);
    });
  }, [companies, search]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        setAuthUserId(user.id);

        const data = await getInternalCompanies(user.id);

        setCompanies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    async function runSearch() {
      if (!authUserId || !selectedCompanyId || userSearch.trim().length < 2) {
        setUserResults([]);
        return;
      }

      setUserSearchLoading(true);

      try {
        const results = await searchInternalUsers({
          authUserId,
          search: userSearch,
        });

        setUserResults(results);
      } catch (error) {
        console.error(error);
        setUserResults([]);
      } finally {
        setUserSearchLoading(false);
      }
    }

    const timeout = window.setTimeout(runSearch, 250);

    return () => window.clearTimeout(timeout);
  }, [authUserId, selectedCompanyId, userSearch]);

  async function reloadCompanies() {
    if (!authUserId) return;

    const data = await getInternalCompanies(authUserId);

    setCompanies(data);
  }

  async function handleCreateCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authUserId) return;

    const name = companyName.trim();
    const slug = companySlug.trim();

    if (!name) {
      setCreateError("Company name is required.");
      return;
    }

    try {
      setCreateLoading(true);
      setCreateError(null);

      await createInternalCompany(authUserId, {
        name,
        slug: slug || null,
      });

      setCompanyName("");
      setCompanySlug("");

      await reloadCompanies();
    } catch (error) {
      console.error(error);
      setCreateError("Unable to create company.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleAssignAdmin(companyId: string) {
    if (!authUserId || !selectedUser?.id) return;

    await assignCompanyAdmin({
      authUserId,
      companyId,
      userId: selectedUser.id,
      role: newAdminRole,
    });

    setUserSearch("");
    setUserResults([]);
    setSelectedUser(null);
    setNewAdminRole("admin");

    await reloadCompanies();
  }

  async function handleRemoveAdmin(companyId: string, adminUserId: string) {
    if (!authUserId) return;

    const confirmed = window.confirm("Remove this company admin?");

    if (!confirmed) return;

    await removeCompanyAdmin({
      authUserId,
      companyId,
      adminUserId,
    });

    await reloadCompanies();
  }

  function handleSelectCompany(companyId: string) {
    if (selectedCompanyId !== companyId) {
      setSelectedCompanyId(companyId);
      setUserSearch("");
      setUserResults([]);
      setSelectedUser(null);
      setNewAdminRole("admin");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Company Admin Control
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          View all companies, create new client tenants, and manage
          owner/admin assignments.
        </p>
      </section>

      <CreateCompanyPanel
        companyName={companyName}
        companySlug={companySlug}
        loading={createLoading}
        error={createError}
        onCompanyNameChange={setCompanyName}
        onCompanySlugChange={setCompanySlug}
        onSubmit={handleCreateCompany}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          Loading internal companies...
        </div>
      ) : (
        <>
          <InternalCompanyStats companies={companies} />

          <InternalCompaniesTable
            companies={filteredCompanies}
            search={search}
            onSearchChange={setSearch}
            selectedCompanyId={selectedCompanyId}
            userSearch={userSearch}
            userResults={userResults}
            selectedUser={selectedUser}
            userSearchLoading={userSearchLoading}
            newAdminRole={newAdminRole}
            onSelectCompany={handleSelectCompany}
            onUserSearchChange={(value) => {
              setSelectedUser(null);
              setUserSearch(value);
            }}
            onSelectUser={(user) => {
              setSelectedUser(user);
              setUserSearch(user.full_name || user.email || user.id);
              setUserResults([]);
            }}
            onRoleChange={setNewAdminRole}
            onAssignAdmin={handleAssignAdmin}
            onRemoveAdmin={handleRemoveAdmin}
          />
        </>
      )}
    </div>
  );
}

function CreateCompanyPanel({
  companyName,
  companySlug,
  loading,
  error,
  onCompanyNameChange,
  onCompanySlugChange,
  onSubmit,
}: {
  companyName: string;
  companySlug: string;
  loading: boolean;
  error: string | null;
  onCompanyNameChange: (value: string) => void;
  onCompanySlugChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Create Company
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create a new client tenant. After creation, assign an owner or admin
          below.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={companyName}
          onChange={(event) => onCompanyNameChange(event.target.value)}
          placeholder="Company name"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300/40"
        />

        <input
          value={companySlug}
          onChange={(event) => onCompanySlugChange(event.target.value)}
          placeholder="Slug optional"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300/40"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {loading ? "Creating..." : "Create Company"}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
        </p>
      ) : null}
    </section>
  );
}