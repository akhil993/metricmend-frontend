"use client";

import { LockKeyhole, ShieldAlert } from "lucide-react";

export default function ProductionProtectionCard() {
  return (
    <div className="rounded-[2rem] border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-500/20 dark:bg-amber-500/10">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Production Protection Rules
        </h2>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 text-amber-500" />
          <p>Direct production editing is restricted.</p>
        </div>

        <div className="flex gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 text-amber-500" />
          <p>Only certified semantic assets can enter production.</p>
        </div>

        <div className="flex gap-3">
          <LockKeyhole className="mt-0.5 h-4 w-4 text-amber-500" />
          <p>Production promotion creates a governance snapshot.</p>
        </div>
      </div>
    </div>
  );
}