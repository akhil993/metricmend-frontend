type Props = {
  status: string;
};

export default function MetricStatusBadge({
  status,
}: Props) {

  if (status === "approved") {
    return (
      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        Approved
      </span>
    );
  }

  if (status === "deprecated") {
    return (
      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
        Deprecated
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
      Draft
    </span>
  );
}