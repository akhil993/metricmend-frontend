import Link from "next/link";
import type {
  AdminRole,
  InternalCompany,
  InternalUserSearchResult,
} from "./types";
import { Badge } from "./shared";
import CompanyAdminsList from "./CompanyAdminsList";
import AssignCompanyAdminCell from "./AssignCompanyAdminCell";

export default function InternalCompaniesTable({
  companies,
  search,
  onSearchChange,
  selectedCompanyId,
  userSearch,
  userResults,
  selectedUser,
  userSearchLoading,
  newAdminRole,
  onSelectCompany,
  onUserSearchChange,
  onSelectUser,
  onRoleChange,
  onAssignAdmin,
  onRemoveAdmin,
}: {
  companies: InternalCompany[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedCompanyId: string | null;
  userSearch: string;
  userResults: InternalUserSearchResult[];
  selectedUser: InternalUserSearchResult | null;
  userSearchLoading: boolean;
  newAdminRole: AdminRole;
  onSelectCompany: (companyId: string) => void;
  onUserSearchChange: (value: string) => void;
  onSelectUser: (user: InternalUserSearchResult) => void;
  onRoleChange: (role: AdminRole) => void;
  onAssignAdmin: (companyId: string) => void;
  onRemoveAdmin: (companyId: string, adminUserId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Companies
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Assign initial company owners/admins from here.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search companies or admins..."
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300/40 md:w-80"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Admins</th>
              <th className="px-4 py-3 font-medium">Assign Admin</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {companies.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => {
                const companyName =
                  company.name || company.company_name || "Untitled company";

                return (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/internal/metricmend/companies/${company.id}`}
                        className="font-medium text-slate-950 transition hover:text-cyan-700 hover:underline dark:text-white dark:hover:text-cyan-200"
                      >
                        {companyName}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        {company.id}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge>{company.plan || "free"}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      <Badge>{company.status || "active"}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      <CompanyAdminsList
                        company={company}
                        onRemoveAdmin={onRemoveAdmin}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <AssignCompanyAdminCell
                        companyId={company.id}
                        selectedCompanyId={selectedCompanyId}
                        userSearch={userSearch}
                        userResults={userResults}
                        selectedUser={selectedUser}
                        userSearchLoading={userSearchLoading}
                        newAdminRole={newAdminRole}
                        onSelectCompany={onSelectCompany}
                        onUserSearchChange={onUserSearchChange}
                        onSelectUser={onSelectUser}
                        onRoleChange={onRoleChange}
                        onAssign={onAssignAdmin}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}