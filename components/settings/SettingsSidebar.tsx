"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  CreditCard,
  FileSearch,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const ITEMS = [
  {
    label: "General",
    href: "/app/settings",
    icon: Settings,
  },
  {
    label: "Team",
    href: "/app/settings/team",
    icon: Users,
  },
  {
    label: "Usage",
    href: "/app/settings/usage",
    icon: Activity,
  },
  {
    label: "Audit Logs",
    href: "/app/settings/audit-logs",
    icon: FileSearch,
  },
  {
    label: "Billing",
    href: "/app/settings/billing",
    icon: CreditCard,
  },
  {
    label: "Security",
    href: "/app/settings/security",
    icon: Shield,
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.045] lg:w-72">
      <div className="px-3 pb-4 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Organization Settings
        </p>
      </div>

      <nav className="space-y-1">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-slate-950 text-white dark:bg-white dark:text-black"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}