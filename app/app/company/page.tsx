"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getMyBilling } from "@/lib/api/billing";
import { slugifyCompanyName } from "@/lib/company-slug";

export default function CompanyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToCompany() {
      const billing = await getMyBilling();
      const company = billing.company;
      const slug = slugifyCompanyName(company.name || company.id);

      router.replace(`/app/company/${slug}`);
    }

    redirectToCompany().catch(() => {
      router.replace("/app/settings");
    });
  }, [router]);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
      Loading company...
    </div>
  );
}
