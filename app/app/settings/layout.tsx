import { ReactNode } from "react";

import SettingsSidebar from "@/components/settings/SettingsSidebar";

type Props = {
  children: ReactNode;
};

export default function SettingsLayout({
  children,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <SettingsSidebar />

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}