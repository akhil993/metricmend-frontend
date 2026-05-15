type Props = {
  status: string;
};

export default function ConnectionStatusBadge({ status }: Props) {
  const isActive = status === "active" || status === "available";

  return (
    <span
      className={[
        "rounded-full px-2.5 py-1 text-xs font-medium",
        isActive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      ].join(" ")}
    >
      {status}
    </span>
  );
}