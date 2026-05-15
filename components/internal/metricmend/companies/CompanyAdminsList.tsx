import type { InternalCompany } from "./types";
import { Badge } from "./shared";

export default function CompanyAdminsList({
  company,
  onRemoveAdmin,
}: {
  company: InternalCompany;
  onRemoveAdmin: (companyId: string, adminUserId: string) => void;
}) {
  const admins = company.admins || [];

  if (admins.length === 0) {
    return <p className="text-sm text-amber-300">No admins assigned</p>;
  }

  return (
    <div className="space-y-2">
      {admins.map((admin) => (
        <div
          key={admin.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950 px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium">
              {admin.profiles?.full_name || admin.profiles?.email || admin.user_id}
            </p>
            <p className="text-xs text-slate-500">
              {admin.profiles?.email || admin.role}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge>{admin.role}</Badge>
            <button
              onClick={() => onRemoveAdmin(company.id, admin.user_id)}
              className="rounded-lg border border-rose-900/60 px-2 py-1 text-xs text-rose-300 hover:bg-rose-950/40"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}