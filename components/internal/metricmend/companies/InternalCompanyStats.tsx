import type { InternalCompany } from "./types";
import { MetricCard } from "./shared";

export default function InternalCompanyStats({
  companies,
}: {
  companies: InternalCompany[];
}) {
  const totalAdmins = companies.reduce(
    (total, company) => total + (company.admin_count ?? 0),
    0
  );

  const companiesWithoutAdmins = companies.filter(
    (company) => (company.admin_count ?? 0) === 0
  ).length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <MetricCard label="Companies" value={companies.length} />
      <MetricCard label="Total Admins" value={totalAdmins} />
      <MetricCard
        label="Companies Without Admins"
        value={companiesWithoutAdmins}
      />
    </section>
  );
}