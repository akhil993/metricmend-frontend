"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  Building2,
  CreditCard,
  FileSearch,
  KeyRound,
  LayoutDashboard,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "Platform",
    items: [
      {
        label: "Overview",
        href: "/internal/metricmend",
        icon: LayoutDashboard,
      },
      {
        label: "Founder View",
        href: "/internal/metricmend/founder",
        icon: KeyRound,
      },
      {
        label: "Companies",
        href: "/internal/metricmend/companies",
        icon: Building2,
      },
      {
        label: "Users",
        href: "/internal/metricmend/users",
        icon: Users,
      },
    ],
  },

  {
    section: "Billing",
    items: [
      {
        label: "Plans",
        href: "/internal/metricmend/plans",
        icon: CreditCard,
      },
      {
        label: "Credits",
        href: "/internal/metricmend/credits",
        icon: Sparkles,
      },
      {
        label: "Usage",
        href: "/internal/metricmend/usage",
        icon: Activity,
      },
    ],
  },

  {
    section: "AI Operations",
    items: [
      {
        label: "Mira Monitoring",
        href: "/internal/metricmend/mira-monitoring",
        icon: Sparkles,
      },
      {
        label: "Audit Logs",
        href: "/internal/metricmend/audit-logs",
        icon: FileSearch,
      },
    ],
  },

  {
    section: "Infrastructure",
    items: [
      {
        label: "System Health",
        href: "/internal/metricmend/system-health",
        icon: Shield,
      },
      {
        label: "Settings",
        href: "/internal/metricmend/settings",
        icon: Settings,
      },
    ],
  },
];

export default function InternalMetricMendSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.045] lg:w-72">
      <div className="px-3 pb-5 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Internal Operations
        </p>

        <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
          MetricMend
        </h2>
      </div>

      <div className="space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <div className="px-3 pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {group.section}
              </p>
            </div>

            <nav className="space-y-1">
              {group.items.map((item) => {
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
          </div>
        ))}
      </div>
    </aside>
  );
}
