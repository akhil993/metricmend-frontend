"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bot,
  Boxes,
  Database,
  Gauge,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

export default function AppContextNav() {
  const pathname = usePathname();
  const { activeWorkspace } = useAppWorkspace();

  const isLaunchpad = pathname.startsWith("/app/launchpad");

  const workspaceMatch = pathname.match(
    /^\/app\/workspaces\/([^/]+)/
  );

  if (!isLaunchpad && !workspaceMatch) return null;

  const workspaceId = workspaceMatch?.[1];

  const baseHref = isLaunchpad
    ? "/app/launchpad"
    : `/app/workspaces/${workspaceId}`;

  const isSharedWorkspace =
    !isLaunchpad &&
    activeWorkspace?.workspace_type !== "launchpad";

  const items = [
    {
      label: "Overview",
      href: baseHref,
      icon: Gauge,
    },
    {
      label: "Connections",
      href: `${baseHref}/connections`,
      icon: Database,
    },
    {
      label: "Models",
      href: `${baseHref}/models`,
      icon: Boxes,
    },
    {
      label: "Mira",
      href: `${baseHref}/mira`,
      icon: Bot,
    },
    ...(isSharedWorkspace
      ? [
          {
            label: "Governance",
            href: `${baseHref}/governance`,
            icon: ShieldCheck,
          },
          {
            label: "Members",
            href: `${baseHref}/members`,
            icon: Users,
          },
        ]
      : []),
  ];

  return (
    <div className="border-b border-slate-200 bg-white/80 px-5 py-3 backdrop-blur dark:border-white/10 dark:bg-[#070810]/80 md:px-8">
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === baseHref
              ? pathname === baseHref
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.07] dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}