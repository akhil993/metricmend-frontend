import type { SelectedModelTable } from "@/lib/api/models";

type Props = {
  selectedTables: SelectedModelTable[];
};

export default function SelectedModelTables({ selectedTables }: Props) {
  const facts = selectedTables.filter((table) => table.table_role === "fact");
  const dimensions = selectedTables.filter(
    (table) => table.table_role === "dimension"
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        Model preview
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Star-schema validation starts here. Relationships will only allow fact
        to dimension.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Fact tables
          </p>

          <div className="mt-2 space-y-2">
            {facts.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No fact table selected.
              </p>
            ) : (
              facts.map((table) => (
                <div
                  key={table.source_table}
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-50 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100"
                >
                  {table.source_table}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Dimension tables
          </p>

          <div className="mt-2 space-y-2">
            {dimensions.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No dimension tables selected.
              </p>
            ) : (
              dimensions.map((table) => (
                <div
                  key={table.source_table}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-200"
                >
                  {table.source_table}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}