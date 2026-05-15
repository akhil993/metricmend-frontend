"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import AppSidebar from "@/components/app/AppSidebar";
import AppTopbar from "@/components/app/AppTopbar";
import AppContextNav from "@/components/app/AppContextNav";
import { AppWorkspaceProvider } from "@/components/app/AppWorkspaceContext";

import { createClient } from "@/lib/supabase/client";

import {
  getMyWorkspaces,
  type MyWorkspace,
} from "@/lib/api/workspaces";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>([]);

  const [activeWorkspace, setActiveWorkspace] =
    useState<MyWorkspace | null>(null);

  const [userEmail, setUserEmail] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAppContext() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUserEmail(user.email ?? null);

        const rows = await getMyWorkspaces();

        if (rows.length === 0) {
          router.push("/onboarding");
          return;
        }

        setWorkspaces(rows);
        setActiveWorkspace(rows[0]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load workspace."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAppContext();
  }, [router, supabase]);

  useEffect(() => {
    if (!workspaces.length) return;

    const workspaceMatch = pathname.match(
      /^\/app\/workspaces\/([^/]+)/
    );

    if (workspaceMatch) {
      const workspaceId = workspaceMatch[1];

      const matchedWorkspace = workspaces.find(
        (workspace) =>
          workspace.workspace_id === workspaceId
      );

      if (
        matchedWorkspace &&
        matchedWorkspace.workspace_id !==
        activeWorkspace?.workspace_id
      ) {
        setActiveWorkspace(matchedWorkspace);
      }

      return;
    }

    if (pathname.startsWith("/app/launchpad")) {
      const launchpadWorkspace = workspaces.find(
        (workspace) =>
          workspace.workspace_name
            ?.toLowerCase() === "launchpad"
      );

      if (
        launchpadWorkspace &&
        launchpadWorkspace.workspace_id !==
        activeWorkspace?.workspace_id
      ) {
        setActiveWorkspace(launchpadWorkspace);
      }
    }
  }, [
    pathname,
    workspaces,
    activeWorkspace?.workspace_id,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-950 dark:bg-[#070810] dark:text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl dark:border-white/10 dark:bg-white/[0.05]">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
          Loading workspace...
        </div>
      </main>
    );
  }

  if (error || !activeWorkspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950 dark:bg-[#070810] dark:text-white">
        <div className="max-w-md rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-500 dark:text-red-100">
          {error || "No workspace selected."}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#070810] dark:text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <div className="min-w-0 flex-1">
          <AppWorkspaceProvider
            value={{
              workspaces,
              activeWorkspace,
              setActiveWorkspace,
            }}
          >
            <AppTopbar userEmail={userEmail} />
            <AppContextNav />

            <div className="p-5 md:p-8">
              {children}
            </div>
          </AppWorkspaceProvider>
        </div>
      </div>
    </main>
  );
}