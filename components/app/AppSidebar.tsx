"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Gauge,
  Settings,
  Home,
  Building2,
  Landmark,
} from "lucide-react";
import MetricMendLogo from "@/components/shared/MetricMendLogo";

const navItems = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Company", href: "/app/company", icon: Landmark },
  { label: "Launchpad", href: "/app/launchpad", icon: Gauge },
  { label: "Workspaces", href: "/app/workspaces", icon: Building2 },
  { label: "Mira", href: "/app/mira", icon: Bot },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-[#070810] lg:block">
      <MetricMendLogo />

      <nav className="mt-8 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
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
