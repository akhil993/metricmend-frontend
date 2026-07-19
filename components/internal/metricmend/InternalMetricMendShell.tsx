"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Activity,
  Building2,
  ChevronDown,
  CreditCard,
  Gauge,
  HeartPulse,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Shield,
  Sparkles,
  Sun,
  UserCircle,
  Users,
  WalletCards,
} from "lucide-react";

import InternalAccessGate from "@/components/internal/metricmend/InternalAccessGate";
import { createClient } from "@/lib/supabase/client";

type ThemeValue = "light" | "dark" | "system";

const navItems = [
  { label: "Overview", href: "/internal/metricmend", icon: LayoutDashboard },
  { label: "Founder", href: "/internal/metricmend/founder", icon: KeyRound },
  { label: "Companies", href: "/internal/metricmend/companies", icon: Building2 },
  { label: "Users", href: "/internal/metricmend/users", icon: Users },
  { label: "Usage", href: "/internal/metricmend/usage", icon: Gauge },
  { label: "Billing", href: "/internal/metricmend/billing", icon: CreditCard },
  { label: "Plans", href: "/internal/metricmend/plans", icon: WalletCards },
  { label: "Credits", href: "/internal/metricmend/credits", icon: Sparkles },
  { label: "Mira Monitor", href: "/internal/metricmend/mira-monitoring", icon: Activity },
  { label: "Audit Logs", href: "/internal/metricmend/audit-logs", icon: Shield },
  { label: "System Health", href: "/internal/metricmend/system-health", icon: HeartPulse },
  { label: "Settings", href: "/internal/metricmend/settings", icon: Settings },
];

const themeOptions: {
  label: string;
  value: ThemeValue;
  icon: typeof Sun;
}[] = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
  { label: "System", value: "system", icon: Monitor },
];

type InternalMetricMendShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function InternalMetricMendShell({
  title,
  subtitle,
  children,
}: InternalMetricMendShellProps) {
  const pathname = usePathname();

  return (
    <InternalAccessGate>
      <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen">
          <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-slate-950/95 lg:block">
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:text-cyan-200/70">
                Internal
              </p>

              <h1 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                MetricMend
              </h1>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Super-admin control plane for companies, access, usage, billing,
                credits, and platform health.
              </p>
            </div>

            <nav className="mt-5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/internal/metricmend"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-700 dark:text-cyan-200/70">
                    MetricMend Internal
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {title}
                  </h2>

                  {subtitle ? (
                    <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                      {subtitle}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <InternalAccountMenu />

                  <div className="flex flex-wrap justify-end gap-2 lg:hidden">
                    {navItems.map((item) => {
                      const active =
                        item.href === "/internal/metricmend"
                          ? pathname === item.href
                          : pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            active
                              ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                              : "border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
          </section>
        </div>
      </main>
    </InternalAccessGate>
  );
}

function InternalAccountMenu() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);
    }

    loadUser();
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.09]"
      >
        <UserCircle className="h-4 w-4" />
        Account
        <ChevronDown
          className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#0b1020]">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-white/[0.05]">
            <p className="text-xs text-slate-500 dark:text-neutral-500">
              Signed in as
            </p>

            <p className="mt-1 truncate text-sm font-medium text-slate-950 dark:text-white">
              {userEmail ?? "MetricMend admin"}
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
                    onClick={() => {
                      setTheme(option.value);
                      setMenuOpen(false);
                    }}
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

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
