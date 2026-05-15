import type { CompanyDetailMember } from "./types";

export default function CompanyUsersTable({
  members,
  emptyText = "No members found.",
}: {
  members: CompanyDetailMember[];
  emptyText?: string;
}) {
  if (!members.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03]">
              <td className="px-4 py-3">
                <p className="font-medium text-slate-900 dark:text-white">
                  {member.profiles?.full_name || member.profiles?.email || "Unknown user"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  {member.profiles?.email || member.user_id}
                </p>
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 dark:bg-white/[0.08] dark:text-slate-200">
                  {member.role}
                </span>
              </td>

              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                {member.status || "—"}
              </td>

              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {formatDate(member.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}