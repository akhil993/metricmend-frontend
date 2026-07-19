type MetricMendLogoProps = {
  variant?: "default" | "inverse";
};

export default function MetricMendLogo({
  variant = "default",
}: MetricMendLogoProps) {
  const isInverse = variant === "inverse";

  return (
    <div className="flex items-center gap-3">
      <div
        className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border shadow-[0_12px_28px_rgba(15,23,42,0.18)] ${
          isInverse
            ? "border-white/15 bg-white/[0.08]"
            : "border-slate-200 bg-white dark:border-white/15 dark:bg-white/[0.06]"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isInverse
              ? "bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(16,185,129,0.18)_48%,rgba(255,255,255,0.08))]"
              : "bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(8,145,178,0.88)_48%,rgba(16,185,129,0.78))] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.28),rgba(16,185,129,0.16)_52%,rgba(255,255,255,0.08))]"
          }`}
        />
        <div className="absolute inset-px rounded-[11px] border border-white/20" />

        <svg
          viewBox="0 0 48 48"
          className="relative h-7 w-7 text-white"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 31L19 24L25 29L36 17"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M12 18V31H25"
            className="opacity-35"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx="19"
            cy="24"
            r="3.2"
            fill="currentColor"
          />

          <circle
            cx="25"
            cy="29"
            r="3.2"
            fill="currentColor"
          />

          <circle
            cx="36"
            cy="17"
            r="3.2"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="leading-none">
        <p
          className={`text-xl font-semibold ${
            isInverse
              ? "text-white"
              : "text-slate-950 dark:text-white"
          }`}
        >
          MetricMend
        </p>

        <p
          className={`mt-1 text-[10px] font-semibold uppercase ${
            isInverse
              ? "text-white/62"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Intelligence
        </p>
      </div>
    </div>
  );
}
