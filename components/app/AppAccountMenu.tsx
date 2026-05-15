"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ChevronDown,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

const themeOptions = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "System", value: "system", icon: Monitor },
];

type Props = {
  userEmail?: string | null;
};

export default function AppAccountMenu({ userEmail }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.09]"
      >
        Account
        <ChevronDown className="h-4 w-4" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#0b1020]">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.05]">
            <p className="text-xs text-slate-500 dark:text-neutral-500">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-950 dark:text-white">
              {userEmail ?? "MetricMend user"}
            </p>
          </div>

          <div className="mt-3">
            <p className="px-2 text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-neutral-500">
              Theme
            </p>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`rounded-xl px-2 py-2 text-xs transition ${
                      isActive
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-white/[0.05] dark:text-neutral-400 dark:hover:bg-white/[0.08]"
                    }`}
                  >
                    <Icon className="mx-auto mb-1 h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            href="/app/billing"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-white/[0.06]"
          >
            Billing & AI credits
          </Link>

          <Link
            href="/app/admin/mira-monitoring"
            onClick={() => setMenuOpen(false)}
            className="mt-3 flex items-start gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-white/[0.06]"
          >
            <Activity className="mt-0.5 h-4 w-4 text-cyan-500" />

            <span>
              <span className="block font-medium text-slate-900 dark:text-white">
                Mira Monitor
              </span>
              <span className="block text-xs text-slate-500 dark:text-neutral-500">
                AI observability & governance
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}