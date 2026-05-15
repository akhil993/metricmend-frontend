"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AppAccountMenu from "@/components/app/AppAccountMenu";
import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import { getMyBilling } from "@/lib/api/billing";

function formatPageSegment(segment?: string) {
  if (!segment) return "Home";

  return segment
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function getPageTitle(
  pathname: string,
  workspaceName?: string
) {
  if (pathname === "/app") return "Home";
  if (pathname === "/app/launchpad") return "Launchpad";
  if (pathname === "/app/billing") return "Billing";

  const workspaceRootMatch = pathname.match(
    /^\/app\/workspaces\/[^/]+$/
  );

  if (workspaceRootMatch) {
    return workspaceName || "Workspace";
  }

  const workspaceChildMatch = pathname.match(
    /^\/app\/workspaces\/[^/]+\/([^/]+)/
  );

  if (workspaceChildMatch) {
    return formatPageSegment(workspaceChildMatch[1]);
  }

  const page = pathname.split("/").pop();

  return formatPageSegment(page);
}

type AppTopbarProps = {
  userEmail?: string | null;
};

export default function AppTopbar({
  userEmail,
}: AppTopbarProps) {
  const pathname = usePathname();
  const { activeWorkspace } = useAppWorkspace();

  const [remainingCredits, setRemainingCredits] =
    useState<number | null>(null);

  useEffect(() => {
    async function loadCredits() {
      try {
        const billing = await getMyBilling();
        setRemainingCredits(
          billing.credits.remaining ?? 0
        );
      } catch {
        setRemainingCredits(null);
      }
    }

    loadCredits();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#070810]/85">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {getPageTitle(
              pathname,
              activeWorkspace?.workspace_name
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/billing"
            className="rounded-full border border-cyan-300/20 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-300/10 dark:text-cyan-100 dark:hover:bg-cyan-300/20"
          >
            AI credits: {remainingCredits ?? "—"}
          </Link>

          <AppAccountMenu userEmail={userEmail} />
        </div>
      </div>
    </header>
  );
}