import type { AdminRole, InternalUserSearchResult } from "./types";

export default function AssignCompanyAdminCell({
  companyId,
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
  onAssign,
}: {
  companyId: string;
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
  onAssign: (companyId: string) => void;
}) {
  const isSelectedCompany = selectedCompanyId === companyId;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          value={isSelectedCompany ? userSearch : ""}
          onChange={(event) => {
            onSelectCompany(companyId);
            onUserSearchChange(event.target.value);
          }}
          placeholder="Search user by name or email..."
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
        />

        {isSelectedCompany && userSearch.trim().length >= 2 && !selectedUser && (
          <div className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-white/10 bg-slate-950 shadow-2xl">
            {userSearchLoading ? (
              <div className="px-3 py-3 text-xs text-slate-400">
                Searching users...
              </div>
            ) : userResults.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400">
                No users found.
              </div>
            ) : (
              userResults.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className="block w-full px-3 py-3 text-left text-xs hover:bg-white/[0.06]"
                >
                  <p className="font-medium text-white">
                    {user.full_name || user.email || "Unnamed user"}
                  </p>
                  <p className="mt-1 text-slate-500">{user.email || user.id}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {isSelectedCompany && selectedUser && (
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
          Selected: {selectedUser.full_name || selectedUser.email}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={isSelectedCompany ? newAdminRole : "admin"}
          onChange={(event) => {
            onSelectCompany(companyId);
            onRoleChange(event.target.value as AdminRole);
          }}
          className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
        >
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>

        <button
          onClick={() => onAssign(companyId)}
          disabled={!isSelectedCompany || !selectedUser}
          className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-semibold text-slate-950 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Assign
        </button>
      </div>
    </div>
  );
}