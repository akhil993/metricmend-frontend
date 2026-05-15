type Props = {
  databases: string[];
  selectedDatabase: string;
  loading: boolean;
  disabled: boolean;
  onSelect: (database: string) => void;
};

export default function DatabasePicker({
  databases,
  selectedDatabase,
  loading,
  disabled,
  onSelect,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        2. Select database
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose the database/schema source for table discovery.
      </p>

      <select
        value={selectedDatabase}
        disabled={disabled || loading}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
      >
        <option value="">
          {loading ? "Loading databases..." : "Choose database..."}
        </option>

        {databases.map((database) => (
          <option key={database} value={database}>
            {database}
          </option>
        ))}
      </select>
    </div>
  );
}