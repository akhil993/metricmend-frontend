type CertificationBadgeProps = {
  certified?: boolean;
};

export function CertificationBadge({
  certified,
}: CertificationBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        certified
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100"
          : "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300"
      }`}
    >
      {certified ? "Certified" : "Not certified"}
    </span>
  );
}