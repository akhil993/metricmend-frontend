type EnvironmentBadgeProps = {
  environment?: string | null;
};

export function EnvironmentBadge({ environment }: EnvironmentBadgeProps) {
  const normalized = environment || "development";

  const styles: Record<string, string> = {
    development:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-300/20 dark:bg-blue-400/10 dark:text-blue-100",
    test:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100",
    production:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
        styles[normalized] ?? styles.development
      }`}
    >
      {normalized}
    </span>
  );
}