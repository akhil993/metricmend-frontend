import { ReactNode } from "react";

import InternalAccessGate from "@/components/internal/metricmend/InternalAccessGate";

import InternalMetricMendShell from "@/components/internal/metricmend/InternalMetricMendShell";

import InternalMetricMendSidebar from "@/components/internal/metricmend/InternalMetricMendSidebar";

type Props = {
  children: ReactNode;
};

export default function InternalMetricMendLayout({
  children,
}: Props) {
  return (
    <InternalAccessGate>
      <InternalMetricMendShell title="Internal Operations">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <InternalMetricMendSidebar />

          <div className="min-w-0">
            {children}
          </div>
        </div>
      </InternalMetricMendShell>
    </InternalAccessGate>
  );
}