export default function MetricMendLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 shadow-[0_0_30px_rgba(15,23,42,0.14)] dark:border-white/15 dark:from-indigo-500/20 dark:via-cyan-400/10 dark:to-emerald-400/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_35%)]" />

        <svg
          viewBox="0 0 48 48"
          className="relative h-7 w-7 text-white dark:text-cyan-100"
          fill="none"
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
        <p className="text-xl font-semibold tracking-tight text-white">
          MetricMend
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
          Intelligence
        </p>
      
    </div>
    </div >
  );
}