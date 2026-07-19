import CompanyDashboardPage from "@/components/company/CompanyDashboardPage";

type Props = {
  params: Promise<{
    companySlug: string;
  }>;
};

export default async function CompanyPage({ params }: Props) {
  const { companySlug } = await params;

  return <CompanyDashboardPage companySlug={companySlug} />;
}
