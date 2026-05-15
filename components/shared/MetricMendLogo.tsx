export default function MetricMendLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_0_30px_rgba(15,23,42,0.14)] dark:border-white/15 dark:bg-gradient-to-br dark:from-white/20 dark:via-white/8 dark:to-white/3 dark:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_35%)]" />

        <svg
          viewBox="0 0 48 48"
          className="relative h-7 w-7"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 31L19 24L25 29L36 17"
            stroke="white"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 18V31H25"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="19" cy="24" r="3.2" fill="white" />
          <circle cx="25" cy="29" r="3.2" fill="white" />
          <circle cx="36" cy="17" r="3.2" fill="white" />
        </svg>
      </div>

      <div className="leading-none">
        <p className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          MetricMend
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-neutral-500">
          Intelligence
        </p>
      </div>
    </div>
  );
}